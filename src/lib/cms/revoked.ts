import 'server-only';
import { read, mutate, write } from './store';

export interface RevokedToken {
  /** The token's nonce — enough to identify it without storing the token. */
  nonce: string;
  /** When the token would have expired anyway; the entry is dropped after. */
  expiresAt: number;
}

/**
 * Tokens invalidated before their natural expiry.
 *
 * Signing out only cleared the cookie, so a token copied beforehand kept
 * working for the rest of its life — eight hours for staff, thirty days for
 * customers. Signing out now records the nonce, and every session check
 * consults this list, so "sign out" genuinely ends that session.
 *
 * Only the one device is affected: other sessions carry different nonces.
 */
export async function revokeToken(nonce: string, expiresAt: number): Promise<void> {
  if (!nonce || !Number.isFinite(expiresAt)) return;
  await mutate('revoked', async (current) => {
    const now = Date.now();
    const kept = current.filter((r) => r.expiresAt > now && r.nonce !== nonce);
    await write('revoked', [...kept, { nonce, expiresAt }]);
  });
}

export async function isRevoked(nonce: string): Promise<boolean> {
  const now = Date.now();
  const list = await read('revoked');
  return list.some((r) => r.nonce === nonce && r.expiresAt > now);
}
