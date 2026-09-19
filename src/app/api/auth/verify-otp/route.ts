import { NextResponse } from 'next/server';
import { readJson } from '@/lib/cms/readJson';
import { read, update } from '@/lib/cms/store';
import { normalisePhone, newCustomer, publicCustomer } from '@/lib/cms/customers';
import { verifyChallenge } from '@/lib/cms/otp';
import { createCustomerToken, setCustomerCookie } from '@/lib/cms/customerAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let phone: string | null = null;
  let code = '';
  const parsed = await readJson(request, 2 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;
  try {
    phone = normalisePhone(body.phone);
    code = typeof body.code === 'string' ? body.code.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!phone || !code) {
    return NextResponse.json({ error: 'Enter the code we sent you' }, { status: 400 });
  }

  const result = await verifyChallenge(phone, code);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 401 });
  }

  // Verified: this person controls the number, so the account is theirs.
  const customers = await read('customers');
  const existing = customers.find((c) => c.phone === phone);
  const customer = existing ?? newCustomer(phone);
  customer.lastLoginAt = new Date().toISOString();

  // Queued: two devices verifying the same number at once would otherwise
  // create the account twice, or drop one of the writes.
  await update('customers', (current) =>
    current.some((c) => c.id === customer.id)
      ? current.map((c) => (c.id === customer.id ? customer : c))
      : [...current, customer],
  );

  await setCustomerCookie(createCustomerToken(customer.id));

  return NextResponse.json({
    ok: true,
    isNew: !customer.profileComplete,
    customer: publicCustomer(customer),
  });
}
