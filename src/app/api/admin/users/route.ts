import { NextResponse } from 'next/server';
import { readJson } from '@/lib/cms/readJson';
import { requirePermission } from '@/lib/cms/auth';
import { read, update } from '@/lib/cms/store';
import { isRole, type Role } from '@/lib/cms/roles';
import { hashPassword, publicUser, type User } from '@/lib/cms/users';

export const dynamic = 'force-dynamic';

const clean = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function GET() {
  const actor = await requirePermission('users');
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await read('users');
  return NextResponse.json({ data: users.map(publicUser), actorId: actor.id });
}

/** Creates a user. Passwords arrive in plain text and are hashed before storage. */
export async function POST(request: Request) {
  const actor = await requirePermission('users');
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = await readJson(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  const name = clean(body.name);
  const username = clean(body.username, 60).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  const role = body.role;

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!/^[a-z0-9._-]{3,}$/.test(username)) {
    return NextResponse.json({ error: 'ID must be 3+ characters: letters, numbers, . _ -' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }
  if (!isRole(role)) return NextResponse.json({ error: 'Unknown role' }, { status: 400 });

  const users = await read('users');
  if (users.some((u) => u.username.toLowerCase() === username)) {
    return NextResponse.json({ error: 'That ID is already taken' }, { status: 409 });
  }

  const user: User = {
    id: `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    username,
    role: role as Role,
    active: true,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  await update('users', (current) => [...current, user]);
  return NextResponse.json({ ok: true, user: publicUser(user) });
}

/** Updates name/role/active, and optionally resets the password. */
export async function PATCH(request: Request) {
  const actor = await requirePermission('users');
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = await readJson(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  const id = clean(body.id, 80);
  const users = await read('users');
  const target = users.find((u) => u.id === id);
  if (!target) return NextResponse.json({ error: 'No such user' }, { status: 404 });

  const nextRole = body.role === undefined ? target.role : body.role;
  if (!isRole(nextRole)) return NextResponse.json({ error: 'Unknown role' }, { status: 400 });

  const nextActive = body.active === undefined ? target.active : body.active !== false;

  // Locking yourself out, or removing the last way back in, is not recoverable
  // from inside the CMS — so it is refused rather than merely warned about.
  const losingOwnAccess = target.id === actor.id && (nextRole !== 'owner' || !nextActive);
  if (losingOwnAccess) {
    return NextResponse.json({ error: 'You cannot remove your own owner access' }, { status: 400 });
  }

  const remainingOwners = users.filter(
    (u) => u.active && u.role === 'owner' && u.id !== target.id,
  ).length;
  if (target.role === 'owner' && (nextRole !== 'owner' || !nextActive) && remainingOwners === 0) {
    return NextResponse.json({ error: 'There must be at least one active owner' }, { status: 400 });
  }

  const password = typeof body.password === 'string' ? body.password : '';
  if (password && password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const updated: User = {
    ...target,
    name: clean(body.name) || target.name,
    role: nextRole as Role,
    active: nextActive,
    passwordHash: password ? hashPassword(password) : target.passwordHash,
  };

  await update('users', (current) => current.map((u) => (u.id === updated.id ? updated : u)));
  return NextResponse.json({ ok: true, user: publicUser(updated) });
}

export async function DELETE(request: Request) {
  const actor = await requirePermission('users');
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = new URL(request.url).searchParams.get('id') ?? '';
  if (id === actor.id) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
  }
  if (id === 'owner') {
    return NextResponse.json({ error: 'The env-var owner account cannot be deleted here' }, { status: 400 });
  }

  const users = await read('users');
  if (!users.some((u) => u.id === id)) {
    return NextResponse.json({ error: 'No such user' }, { status: 404 });
  }

  await update('users', (current) => current.filter((u) => u.id !== id));
  return NextResponse.json({ ok: true });
}
