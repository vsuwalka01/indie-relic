import 'server-only';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import type { PublicUser, Role } from './roles';

export interface User extends PublicUser {
  /** scrypt: `salt:hash`, both hex. Never sent to the browser. */
  passwordHash: string;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  try {
    const expected = Buffer.from(hashHex, 'hex');
    const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

/** Strips the hash so a user record can safely cross to the client. */
export function publicUser(user: User): PublicUser {
  const { passwordHash, ...rest } = user;
  return rest;
}

/**
 * The first owner comes from env vars so a fresh install is never locked out
 * and no default password ships in the code. Memoised because scrypt is
 * deliberately slow and this would otherwise run on every request.
 */
let cachedOwner: User | null | undefined;

export function seedOwner(): User | null {
  if (cachedOwner !== undefined) return cachedOwner;

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    cachedOwner = null;
    return null;
  }

  cachedOwner = {
    id: 'owner',
    name: 'Owner',
    username,
    role: 'owner' as Role,
    active: true,
    passwordHash: hashPassword(password),
    createdAt: new Date(0).toISOString(),
  };
  return cachedOwner;
}
