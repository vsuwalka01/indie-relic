import { NextResponse } from 'next/server';
import { readJson } from '@/lib/cms/readJson';
import { verifyCredentials, createSessionToken, setSessionCookie, isAdminConfigured } from '@/lib/cms/auth';
import { checkThrottle, clientKey, recordFailure, recordSuccess, LIMIT_ACCOUNT, LIMIT_SOURCE } from '@/lib/cms/loginThrottle';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: 'No admin account is set. Add ADMIN_USERNAME and ADMIN_PASSWORD to .env.local, then restart.' },
      { status: 503 },
    );
  }

  const parsed = await readJson(request, 2 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const username = typeof parsed.body.username === 'string' ? parsed.body.username : '';
  const password = typeof parsed.body.password === 'string' ? parsed.body.password : '';

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Incorrect ID or password' }, { status: 401 });
  }

  // The source is capped tightly; the account name far more loosely, so a
  // stranger cannot lock the real owner out by guessing at their username.
  const keys = [
    { key: `ip:${clientKey(request)}`, limit: LIMIT_SOURCE },
    { key: `user:${username.trim().toLowerCase()}`, limit: LIMIT_ACCOUNT },
  ];

  const throttled = checkThrottle(keys);
  if (throttled.blocked) {
    return NextResponse.json(
      { error: 'Too many failed attempts. Try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(throttled.retryAfterSec) } },
    );
  }

  const user = await verifyCredentials(username, password);
  if (!user) {
    recordFailure(keys);
    // Deliberately vague: saying which of the two was wrong would let someone
    // confirm a valid admin ID before attacking the password.
    return NextResponse.json({ error: 'Incorrect ID or password' }, { status: 401 });
  }

  recordSuccess(keys);
  await setSessionCookie(createSessionToken(user.id));
  return NextResponse.json({ ok: true, role: user.role, name: user.name });
}
