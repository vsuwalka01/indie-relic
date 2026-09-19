import { NextResponse } from 'next/server';
import { readJson } from '@/lib/cms/readJson';
import { normalisePhone } from '@/lib/cms/customers';
import { cancelChallenge, issueChallenge, RESEND_COOLDOWN_MS } from '@/lib/cms/otp';
import { sendOtp, smsConfigured } from '@/lib/cms/sms';
import { checkThrottle, clientKey, recordFailure, LIMIT_SOURCE } from '@/lib/cms/loginThrottle';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let phone: string | null = null;
  const parsed = await readJson(request, 2 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;
  try {
    phone = normalisePhone(body.phone);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!phone) {
    return NextResponse.json({ error: 'Enter a valid 10-digit mobile number' }, { status: 400 });
  }

  // Per-phone limits alone don't stop someone cycling through numbers: each
  // request costs real money and rings a real stranger's phone. Cap the source
  // as well.
  const source = [{ key: `otp-ip:${clientKey(request)}`, limit: LIMIT_SOURCE }];
  const throttled = checkThrottle(source);
  if (throttled.blocked) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(throttled.retryAfterSec) } },
    );
  }
  recordFailure(source);

  const issued = await issueChallenge(phone);
  if (!issued.ok) {
    return NextResponse.json(
      { error: issued.reason, retryAfterMs: issued.retryAfterMs ?? 0 },
      { status: 429 },
    );
  }

  const delivery = await sendOtp(phone, issued.code);

  if (delivery.delivered) {
    const deliveryMode = delivery.via === '2factor'
      ? (process.env.TWO_FACTOR_DELIVERY_MODE === 'sms' ? 'sms' : 'voice')
      : 'sms';
    return NextResponse.json({
      ok: true,
      sent: true,
      deliveryMode,
      cooldownMs: RESEND_COOLDOWN_MS,
    });
  }

  // A configured provider that failed leaves a code nobody can receive, so
  // drop it and let them retry. With no provider at all the code is handed
  // back below for local testing — cancelling it there would delete the very
  // challenge it has to verify against, making dev sign-in impossible.
  if (smsConfigured()) {
    await cancelChallenge(phone);
  }

  // No provider configured. In development the code is surfaced so the flow is
  // testable; in production that would hand every account to anyone who asked,
  // so sign-in is refused instead.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: delivery.reason },
      { status: delivery.retryTomorrow ? 429 : 503 },
    );
  }

  console.info(`[otp] ${phone} -> ${issued.code} (dev only; configure Twilio or MSG91 to send for real)`);
  return NextResponse.json({
    ok: true,
    sent: false,
    devCode: issued.code,
    notice: smsConfigured() ? 'Delivery failed' : 'No SMS provider configured — showing the code for local testing only.',
    cooldownMs: RESEND_COOLDOWN_MS,
  });
}
