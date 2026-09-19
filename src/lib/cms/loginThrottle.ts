import 'server-only';

/**
 * Slows down password guessing against the CMS.
 *
 * Admin sign-in had no limit at all: an unlimited stream of guesses against a
 * known username is the whole attack. Failures are counted per username and
 * per client address, so one account being targeted cannot lock out everyone
 * else, and a spray across many usernames from one source is still caught.
 *
 * In-process, like the collection queues: a single server is protected, and a
 * multi-instance deployment divides the budget across instances rather than
 * losing it entirely.
 */
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

/**
 * The source is locked quickly, because that is where an attacker actually
 * sits. The account name is locked far more reluctantly: a low threshold there
 * would let anyone lock the owner out of their own CMS just by submitting bad
 * passwords for a known username.
 */
export const LIMIT_SOURCE = 8;
export const LIMIT_ACCOUNT = 30;

interface Bucket {
  failures: number;
  firstFailureAt: number;
  lockedUntil: number;
}

const buckets = new Map<string, Bucket>();

function sweep(now: number) {
  for (const [key, b] of buckets) {
    if (b.lockedUntil < now && now - b.firstFailureAt > WINDOW_MS) buckets.delete(key);
  }
}

/** Best-effort client address; proxies set x-forwarded-for on Vercel. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for') ?? '';
  const ip = forwarded.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
  return ip.slice(0, 64);
}

export interface ThrottleKey {
  key: string;
  limit: number;
}

export function checkThrottle(keys: ThrottleKey[]): { blocked: boolean; retryAfterSec: number } {
  const now = Date.now();
  sweep(now);

  let longest = 0;
  for (const { key } of keys) {
    const bucket = buckets.get(key);
    if (bucket && bucket.lockedUntil > now) longest = Math.max(longest, bucket.lockedUntil - now);
  }
  return { blocked: longest > 0, retryAfterSec: Math.ceil(longest / 1000) };
}

export function recordFailure(keys: ThrottleKey[]) {
  const now = Date.now();
  for (const { key, limit } of keys) {
    const bucket = buckets.get(key);
    if (!bucket || now - bucket.firstFailureAt > WINDOW_MS) {
      buckets.set(key, { failures: 1, firstFailureAt: now, lockedUntil: 0 });
      continue;
    }
    bucket.failures += 1;
    if (bucket.failures >= limit) {
      bucket.lockedUntil = now + LOCKOUT_MS;
      bucket.failures = 0;
      bucket.firstFailureAt = now;
    }
  }
}

/** A correct password clears the counters for that identity. */
export function recordSuccess(keys: ThrottleKey[]) {
  for (const { key } of keys) buckets.delete(key);
}
