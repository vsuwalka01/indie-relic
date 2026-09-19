import 'server-only';
import { createHash, randomInt, timingSafeEqual } from 'crypto';
import { write, mutate } from './store';

export interface Challenge {
  phone: string;
  /** SHA-256 of the code — never the code itself, so a leaked store can't log anyone in. */
  codeHash: string;
  expiresAt: number;
  attempts: number;
  sentAt: number;
  /** Sends in the current window, to stop a number being used as an SMS cannon. */
  sends: number;
  windowStartedAt: number;
}

export const CODE_LENGTH = 6;
export const CODE_TTL_MS = 5 * 60 * 1000;
export const MAX_ATTEMPTS = 5;
export const RESEND_COOLDOWN_MS = 30 * 1000;
export const MAX_SENDS_PER_WINDOW = 5;
export const SEND_WINDOW_MS = 60 * 60 * 1000;

/**
 * Challenges are persisted rather than held in memory. Each serverless
 * invocation gets its own module instance, so an in-memory map would issue a
 * code in one process and look for it in another — sign-in would fail for
 * almost everyone in production.
 */
function prune(all: Challenge[]): Challenge[] {
  const now = Date.now();
  // Drop anything both expired and outside its rate-limit window.
  return all.filter((c) => c.expiresAt > now || now - c.windowStartedAt < SEND_WINDOW_MS);
}

async function save(list: Challenge[]): Promise<void> {
  await write('otps', list);
}

export function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

export function generateCode(): string {
  // Drawn from the CSPRNG, unlike Math.random.
  return String(randomInt(0, 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, '0');
}

export type IssueResult =
  | { ok: true; code: string }
  | { ok: false; reason: string; retryAfterMs?: number };

export async function issueChallenge(phone: string): Promise<IssueResult> {
  // Serialised: two requests for the same number would otherwise each write a
  // challenge, and the loser's code would silently stop working.
  return mutate('otps', async (stored) => {
  const now = Date.now();
  const list = prune(stored);
  const existing = list.find((c) => c.phone === phone);

  if (existing) {
    const sinceSend = now - existing.sentAt;
    if (sinceSend < RESEND_COOLDOWN_MS) {
      return { ok: false, reason: 'Please wait before asking for another code', retryAfterMs: RESEND_COOLDOWN_MS - sinceSend };
    }
    if (now - existing.windowStartedAt < SEND_WINDOW_MS && existing.sends >= MAX_SENDS_PER_WINDOW) {
      return { ok: false, reason: 'Too many codes requested. Try again later.' };
    }
  }

  const windowOpen = existing && now - existing.windowStartedAt < SEND_WINDOW_MS;
  const code = generateCode();
  const challenge: Challenge = {
    phone,
    codeHash: hashCode(code),
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
    sentAt: now,
    sends: windowOpen ? existing!.sends + 1 : 1,
    windowStartedAt: windowOpen ? existing!.windowStartedAt : now,
  };

  await save([...list.filter((c) => c.phone !== phone), challenge]);
  return { ok: true, code };
  });
}

/** Remove an unusable challenge when the SMS provider rejects the send. */
export async function cancelChallenge(phone: string): Promise<void> {
  await mutate('otps', async (stored) => {
    await save(prune(stored).filter((challenge) => challenge.phone !== phone));
  });
}

export type VerifyResult = { ok: true } | { ok: false; reason: string };

export async function verifyChallenge(phone: string, code: string): Promise<VerifyResult> {
  // Serialised so the attempt counter cannot be reset by a parallel guess.
  return mutate('otps', async (stored) => {
  const list = prune(stored);
  const challenge = list.find((c) => c.phone === phone);
  if (!challenge) return { ok: false, reason: 'Ask for a code first' };

  if (Date.now() > challenge.expiresAt) {
    await save(list.filter((c) => c.phone !== phone));
    return { ok: false, reason: 'That code has expired. Ask for a new one.' };
  }

  if (challenge.attempts >= MAX_ATTEMPTS) {
    await save(list.filter((c) => c.phone !== phone));
    return { ok: false, reason: 'Too many wrong attempts. Ask for a new code.' };
  }

  const attempted: Challenge = { ...challenge, attempts: challenge.attempts + 1 };

  const provided = Buffer.from(hashCode(String(code)));
  const expected = Buffer.from(challenge.codeHash);
  const matches = provided.length === expected.length && timingSafeEqual(provided, expected);

  if (!matches) {
    await save([...list.filter((c) => c.phone !== phone), attempted]);
    const left = MAX_ATTEMPTS - attempted.attempts;
    return {
      ok: false,
      reason: left > 0 ? `Incorrect code — ${left} attempt${left === 1 ? '' : 's'} left` : 'Too many wrong attempts. Ask for a new code.',
    };
  }

  // Single use: burn it the moment it works.
  await save(list.filter((c) => c.phone !== phone));
  return { ok: true };
  });
}
