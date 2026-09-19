import 'server-only';
import { createHmac, timingSafeEqual, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { read } from './store';
import { can, type Permission } from './roles';
import { verifyPasswordHash, type User } from './users';
import { isRevoked, revokeToken } from './revoked';

export const SESSION_COOKIE = 'indie_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 8;

/**
 * In development an unset secret would otherwise make every restart invalidate
 * sessions silently; in production a missing secret is a hard failure, because
 * falling back to a known default would let anyone forge a session cookie.
 */
function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_SESSION_SECRET must be set in production');
  }
  return 'dev-only-insecure-secret';
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

/** Compares without leaking match position through timing. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Both fields are always compared, and the result combined only afterwards, so
 * a wrong username and a wrong password cost the same — otherwise response
 * timing would reveal which half was already correct.
 */
export async function verifyCredentials(username: string, password: string): Promise<User | null> {
  const users = await read('users');
  const candidate = username.trim().toLowerCase();

  const user = users.find((u) => u.username.trim().toLowerCase() === candidate);
  if (!user) {
    // Still do the work, so a missing account isn't faster than a wrong password.
    verifyPasswordHash(password, `${'0'.repeat(32)}:${'0'.repeat(128)}`);
    return null;
  }

  const passOk = verifyPasswordHash(password, user.passwordHash);
  if (!passOk || !user.active) return null;
  return user;
}

export function createSessionToken(userId: string): string {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const nonce = randomBytes(8).toString('hex');
  const payload = `${userId}.${expires}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

function parseToken(token: string | undefined): { userId: string; nonce: string; expiresAt: number } | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 4) return null;

  const [userId, expires, nonce, signature] = parts;
  if (!safeEqual(signature, sign(`${userId}.${expires}.${nonce}`))) return null;

  const expiresAt = Number(expires);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;
  return { userId, nonce, expiresAt };
}

/** Invalidates the caller's own token server-side, not just the cookie. */
export async function revokeCurrentSession() {
  const parsed = parseToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (parsed) await revokeToken(parsed.nonce, parsed.expiresAt);
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** The signed-in user, re-read each time so a disabled account loses access at once. */
export async function currentUser(): Promise<User | null> {
  const parsed = parseToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!parsed) return null;
  // A signed-out token stays signed out even if someone kept a copy.
  if (await isRevoked(parsed.nonce)) return null;

  const users = await read('users');
  const user = users.find((u) => u.id === parsed.userId);
  return user && user.active ? user : null;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await currentUser()) !== null;
}

/** Returns the user only when they hold the permission, otherwise null. */
export async function requirePermission(permission: Permission): Promise<User | null> {
  const user = await currentUser();
  if (!user || !can(user.role, permission)) return null;
  return user;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
}
