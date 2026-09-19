import { NextResponse } from 'next/server';
import { readJson } from '@/lib/cms/readJson';
import { update } from '@/lib/cms/store';
import { currentCustomer } from '@/lib/cms/customerAuth';
import {
  newAddressId,
  normaliseDefaults,
  normalisePhone,
  publicCustomer,
  type Customer,
  type SavedAddress,
} from '@/lib/cms/customers';

export const dynamic = 'force-dynamic';

const MAX_ADDRESSES = 15;
const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

type Draft = Omit<SavedAddress, 'id' | 'isDefault'>;

function parseAddress(body: Record<string, unknown>): Draft | string {
  const name = clean(body.name, 120);
  const line1 = clean(body.line1);
  const city = clean(body.city, 80);
  const pincode = clean(body.pincode, 10);

  if (!name) return 'Who should we deliver to?';
  if (!line1) return 'Please enter the address';
  if (!city) return 'Please enter the city';
  if (!/^\d{6}$/.test(pincode)) return 'Pincode should be 6 digits';

  const phone = normalisePhone(body.phone);
  if (body.phone && !phone) return 'That contact number doesn’t look right';

  return {
    label: clean(body.label, 40) || 'Home',
    name,
    phone: phone ?? '',
    line1,
    line2: clean(body.line2),
    city,
    state: clean(body.state, 80),
    pincode,
  };
}

async function persist(customer: Customer, addresses: SavedAddress[]) {
  // Queued: a parallel profile save would otherwise overwrite this one.
  const updated: Customer = { ...customer, addresses };
  await update('customers', (customers) =>
    customers.map((c) => (c.id === updated.id ? updated : c)),
  );
  return updated;
}

export async function GET() {
  const customer = await currentCustomer();
  if (!customer) return NextResponse.json({ error: 'Please sign in' }, { status: 401 });
  return NextResponse.json({ data: customer.addresses });
}

export async function POST(request: Request) {
  const customer = await currentCustomer();
  if (!customer) return NextResponse.json({ error: 'Please sign in' }, { status: 401 });

  const parsed = await readJson(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  if (customer.addresses.length >= MAX_ADDRESSES) {
    return NextResponse.json({ error: `You can save up to ${MAX_ADDRESSES} addresses` }, { status: 400 });
  }

  const draft = parseAddress(body);
  if (typeof draft === 'string') return NextResponse.json({ error: draft }, { status: 400 });

  const address: SavedAddress = { ...draft, id: newAddressId(), isDefault: false };
  const wantsDefault = body.isDefault === true || customer.addresses.length === 0;
  const addresses = normaliseDefaults(
    [...customer.addresses, address],
    wantsDefault ? address.id : undefined,
  );

  const updated = await persist(customer, addresses);
  return NextResponse.json({ ok: true, address: updated.addresses.find((a) => a.id === address.id), customer: publicCustomer(updated) });
}

export async function PUT(request: Request) {
  const customer = await currentCustomer();
  if (!customer) return NextResponse.json({ error: 'Please sign in' }, { status: 401 });

  const parsed = await readJson(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  const id = clean(body.id, 80);
  const existing = customer.addresses.find((a) => a.id === id);
  if (!existing) return NextResponse.json({ error: 'No such address' }, { status: 404 });

  // Only the default flag is changing.
  if (body.setDefault === true && body.line1 === undefined) {
    const updated = await persist(customer, normaliseDefaults(customer.addresses, id));
    return NextResponse.json({ ok: true, customer: publicCustomer(updated) });
  }

  const draft = parseAddress(body);
  if (typeof draft === 'string') return NextResponse.json({ error: draft }, { status: 400 });

  const addresses = normaliseDefaults(
    customer.addresses.map((a) => (a.id === id ? { ...a, ...draft } : a)),
    body.setDefault === true ? id : undefined,
  );

  const updated = await persist(customer, addresses);
  return NextResponse.json({ ok: true, customer: publicCustomer(updated) });
}

export async function DELETE(request: Request) {
  const customer = await currentCustomer();
  if (!customer) return NextResponse.json({ error: 'Please sign in' }, { status: 401 });

  const id = new URL(request.url).searchParams.get('id') ?? '';
  if (!customer.addresses.some((a) => a.id === id)) {
    return NextResponse.json({ error: 'No such address' }, { status: 404 });
  }

  // Removing the default promotes whichever address is left.
  const addresses = normaliseDefaults(customer.addresses.filter((a) => a.id !== id));
  const updated = await persist(customer, addresses);
  return NextResponse.json({ ok: true, customer: publicCustomer(updated) });
}
