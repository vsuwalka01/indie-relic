import { NextResponse } from 'next/server';
import { readJson } from '@/lib/cms/readJson';
import { requirePermission } from '@/lib/cms/auth';
import { read, update, isCollection, type CollectionName } from '@/lib/cms/store';
import { validateCollection } from '@/lib/cms/validate';
import type { Permission } from '@/lib/cms/roles';

export const dynamic = 'force-dynamic';

/** Each collection is gated by the permission that owns it. */
const REQUIRED: Record<CollectionName, Permission> = {
  products: 'products',
  crafts: 'crafts',
  settings: 'settings',
  theme: 'theme',
  coupons: 'coupons',
  orders: 'orders',
  users: 'users',
  // Whoever fulfils orders already sees these details on each order.
  customers: 'orders',
  // Never reachable: login challenges and revoked tokens aren't content.
  otps: 'users',
  revoked: 'users',
};

function resolve(params: { collection: string }): CollectionName | null {
  return isCollection(params.collection) ? params.collection : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ collection: string }> }) {
  const name = resolve(await params);
  if (!name) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 });

  // Login challenges are not content and must never be readable, even by an
  // owner — the hashes and windows are only for the auth flow itself.
  if (name === 'otps' || name === 'revoked') return NextResponse.json({ error: 'Not available' }, { status: 404 });

  const user = await requirePermission(REQUIRED[name]);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await read(name);
  // Password hashes must never leave the server, even for an owner.
  if (name === 'users') {
    const safe = (data as Awaited<ReturnType<typeof read<'users'>>>).map(({ passwordHash, ...rest }) => rest);
    return NextResponse.json({ data: safe });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: Request, { params }: { params: Promise<{ collection: string }> }) {
  const name = resolve(await params);
  if (!name) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 });

  // Users and orders have their own endpoints, because both need to merge with
  // stored state (hashes, timelines) rather than be replaced wholesale.
  // Customer accounts are read-only here: they belong to the people who
  // verified those numbers, and a wholesale replace would erase them.
  if (name === 'users' || name === 'orders' || name === 'customers' || name === 'otps' || name === 'revoked') {
    return NextResponse.json({ error: `${name} cannot be replaced through this endpoint` }, { status: 405 });
  }

  const user = await requirePermission(REQUIRED[name]);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = await readJson(request, 2 * 1024 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  const result = validateCollection(name, body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  // Queued so two editors saving the same collection don't clobber each other.
  await update(name, () => result.value as never);
  return NextResponse.json({ ok: true });
}
