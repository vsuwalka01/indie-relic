import 'server-only';

export type DeliveryResult =
  | { delivered: true; via: string }
  | { delivered: false; via: string; reason: string; retryTomorrow?: boolean };

/**
 * Sends the code for real when a provider is configured. Paid providers take
 * priority, followed by providers that use an explicit API key.
 *
 *   Twilio  — TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM
 *   MSG91   — MSG91_AUTH_KEY, MSG91_SENDER_ID  (India; needs DLT registration)
 *   2Factor — TWO_FACTOR_API_KEY, TWO_FACTOR_TEMPLATE_NAME (free test credits)
 *   Textbelt — TEXTBELT_API_KEY (its public free key does not deliver to India)
 *
 * With neither, nothing is sent: the caller falls back to showing the code
 * locally in development, and refuses to sign anyone in from production.
 */
export async function sendOtp(phone: string, code: string): Promise<DeliveryResult> {
  const message = `${code} is your Indie Relic login code. It expires in 5 minutes. Do not share it.`;

  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: `+91${phone}`, From: process.env.TWILIO_FROM, Body: message }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      // The code itself must never reach the logs.
      console.error('[otp] Twilio rejected the send:', res.status, detail.slice(0, 300));
      return { delivered: false, via: 'none', reason: 'Could not send the code right now' };
    }
    return { delivered: true, via: 'twilio' };
  }

  if (process.env.MSG91_AUTH_KEY && process.env.MSG91_SENDER_ID) {
    const res = await fetch('https://api.msg91.com/api/v2/sendsms', {
      method: 'POST',
      headers: { authkey: process.env.MSG91_AUTH_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: process.env.MSG91_SENDER_ID,
        route: '4',
        country: '91',
        sms: [{ message, to: [phone] }],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[otp] MSG91 rejected the send:', res.status, detail.slice(0, 300));
      return { delivered: false, via: 'none', reason: 'Could not send the code right now' };
    }
    return { delivered: true, via: 'msg91' };
  }

  if (process.env.TWO_FACTOR_API_KEY && process.env.TWO_FACTOR_TEMPLATE_NAME) {
    // Accounts created through 2Factor's CP dashboard use the legacy V1
    // endpoint. The newer header-based endpoint advertised on the v4 site
    // returns 404 for these API keys.
    const apiKey = encodeURIComponent(process.env.TWO_FACTOR_API_KEY);
    const template = encodeURIComponent(process.env.TWO_FACTOR_TEMPLATE_NAME);
    const res = await fetch(
      `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${encodeURIComponent(code)}/${template}`,
      { method: 'POST' },
    );
    const data = await res.json().catch(() => null) as
      | { Status?: string; Details?: string; status?: string; message?: string; error?: string }
      | null;
    const providerStatus = data?.Status ?? data?.status ?? '';
    if (!res.ok || !['sent', 'success'].includes(providerStatus.toLowerCase())) {
      console.error(
        '[otp] 2Factor rejected the send:',
        res.status,
        data?.Details ?? data?.message ?? data?.error ?? 'Unknown response',
      );
      return { delivered: false, via: '2factor', reason: 'Could not send the code right now. Please try again.' };
    }
    return { delivered: true, via: '2factor' };
  }

  // A Textbelt key remains supported for non-Indian deployments. Textbelt's
  // shared free key rejects Indian destinations, so it is never enabled here
  // implicitly.
  const textbeltKey = process.env.TEXTBELT_API_KEY;

  if (textbeltKey) {
    const res = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: `+91${phone}`,
        message,
        key: textbeltKey,
        sender: 'Indie Relic',
      }),
    });

    const data = await res.json().catch(() => null) as
      | { success?: boolean; error?: string; quotaRemaining?: number }
      | null;

    if (!res.ok || !data?.success) {
      const outOfQuota = data?.quotaRemaining === 0 || /quota/i.test(data?.error ?? '');
      console.error('[otp] Textbelt rejected the send:', res.status, data?.error ?? 'Unknown response');
      return {
        delivered: false,
        via: 'textbelt',
        reason: outOfQuota
          ? 'The free SMS limit has been used for today. Please try again tomorrow.'
          : 'Could not send the code right now. Please try again.',
        retryTomorrow: outOfQuota,
      };
    }

    return { delivered: true, via: 'textbelt' };
  }

  return { delivered: false, via: 'none', reason: 'No SMS provider configured' };
}

export function smsConfigured(): boolean {
  return Boolean(
    (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM) ||
      (process.env.MSG91_AUTH_KEY && process.env.MSG91_SENDER_ID) ||
      (process.env.TWO_FACTOR_API_KEY && process.env.TWO_FACTOR_TEMPLATE_NAME) ||
      process.env.TEXTBELT_API_KEY,
  );
}
