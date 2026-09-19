import { NextResponse } from 'next/server';
import { clearSessionCookie, revokeCurrentSession } from '@/lib/cms/auth';

export async function POST() {
  // Invalidate the token itself, not just this browser's copy of it.
  await revokeCurrentSession();
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
