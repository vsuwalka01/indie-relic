import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { read } from './store';
import type { Customer } from './customers';
import { isRevoked, revokeToken } from './revoked';

export const CUSTOMER_COOKIE = 'indie_customer_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function secret(): string {
  const value = process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CUSTOMER_SESSION_SECRET must be set in production');
  }
  return 'dev-only-insecure-customer-secret';
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createCustomerToken(customerId: string): string {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const nonce = randomBytes(8).toString('hex');
  const payload = `${customerId}.${expires}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

function parse(token: string | undefined): { customerId: string; nonce: string; expiresAt: number } | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 4) return null;
  const [customerId, expires, nonce, signature] = parts;
  if (!safeEqual(signature, sign(`${customerId}.${expires}.${nonce}`))) return null;
  const expiresAt = Number(expires);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;
  return { customerId, nonce, expiresAt };
}

/** Invalidates the caller's own token server-side, not just the cookie. */
export async function revokeCurrentCustomerSession() {
  const parsed = parse((await cookies()).get(CUSTOMER_COOKIE)?.value);
  if (parsed) await revokeToken(parsed.nonce, parsed.expiresAt);
}

export async function setCustomerCookie(token: string) {
  (await cookies()).set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearCustomerCookie() {
  (await cookies()).delete(CUSTOMER_COOKIE);
}

/** The signed-in customer, re-read each time so a deleted account loses access. */
export async function currentCustomer(): Promise<Customer | null> {
  const parsed = parse((await cookies()).get(CUSTOMER_COOKIE)?.value);
  if (!parsed) return null;
  // A signed-out token stays signed out even if someone kept a copy.
  if (await isRevoked(parsed.nonce)) return null;

  const customers = await read('customers');
  return customers.find((c) => c.id === parsed.customerId) ?? null;
}
