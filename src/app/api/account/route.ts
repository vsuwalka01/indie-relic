import { NextResponse } from 'next/server';
import { readJson } from '@/lib/cms/readJson';
import { update } from '@/lib/cms/store';
import { currentCustomer, clearCustomerCookie, revokeCurrentCustomerSession } from '@/lib/cms/customerAuth';
import { publicCustomer, type Customer } from '@/lib/cms/customers';

export const dynamic = 'force-dynamic';

const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function GET() {
  const customer = await currentCustomer();
  if (!customer) return NextResponse.json({ customer: null });
  return NextResponse.json({ customer: publicCustomer(customer) });
}

/** Saves the signed-in customer's own details. The phone is never editable here — it's the verified identity. */
export async function PUT(request: Request) {
  const customer = await currentCustomer();
  if (!customer) return NextResponse.json({ error: 'Please sign in' }, { status: 401 });

  const parsed = await readJson(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  if (!name) return NextResponse.json({ error: 'Please tell us your name' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'That email doesn’t look right' }, { status: 400 });
  }

  // Addresses are managed through /api/account/addresses.
  const updated: Customer = { ...customer, name, email, profileComplete: true };

  await update('customers', (customers) =>
    customers.map((c) => (c.id === updated.id ? updated : c)),
  );

  return NextResponse.json({ ok: true, customer: publicCustomer(updated) });
}

export async function DELETE() {
  // Invalidate the token itself, not just this browser's copy of it.
  await revokeCurrentCustomerSession();
  await clearCustomerCookie();
  return NextResponse.json({ ok: true });
}
