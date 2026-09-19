import { NextResponse } from 'next/server';
import { readJson } from '@/lib/cms/readJson';
import { requirePermission } from '@/lib/cms/auth';
import { read, update } from '@/lib/cms/store';
import { can } from '@/lib/cms/roles';
import { ORDER_STATUSES, STATUS_LABELS, type Order, type OrderStatus } from '@/lib/cms/orders';

export const dynamic = 'force-dynamic';

const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function GET() {
  const actor = await requirePermission('orders');
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ data: await read('orders') });
}

/** Updates status, assignment, courier details and notes — never the money. */
export async function PATCH(request: Request) {
  const actor = await requirePermission('orders');
  if (!actor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = await readJson(request, 16 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  const id = clean(body.id, 80);
  const orders = await read('orders');
  const target = orders.find((o) => o.id === id);
  if (!target) return NextResponse.json({ error: 'No such order' }, { status: 404 });


  const timeline = [...target.timeline];
  const next: Order = { ...target };

  if (body.status !== undefined) {
    const status = body.status as OrderStatus;
    if (!ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Unknown status' }, { status: 400 });
    }
    if (status !== target.status) {
      next.status = status;
      timeline.push({ at: new Date().toISOString(), label: `Marked ${STATUS_LABELS[status]}`, by: actor.name });
    }
  }

  if (body.assignedTo !== undefined) {
    if (!can(actor.role, 'orders:assign')) {
      return NextResponse.json({ error: 'You cannot reassign orders' }, { status: 403 });
    }
    const assignedTo = clean(body.assignedTo, 80);
    if (assignedTo) {
      const users = await read('users');
      const assignee = users.find((u) => u.id === assignedTo && u.active);
      if (!assignee) return NextResponse.json({ error: 'No such team member' }, { status: 400 });
      if (assignedTo !== target.assignedTo) {
        timeline.push({ at: new Date().toISOString(), label: `Assigned to ${assignee.name}`, by: actor.name });
      }
    } else if (target.assignedTo) {
      timeline.push({ at: new Date().toISOString(), label: 'Unassigned', by: actor.name });
    }
    next.assignedTo = assignedTo;
  }

  if (body.courier !== undefined) next.courier = clean(body.courier, 80);
  if (body.trackingNumber !== undefined) next.trackingNumber = clean(body.trackingNumber, 80);
  if (body.notes !== undefined) next.notes = clean(body.notes, 4000);

  if (
    (body.courier !== undefined || body.trackingNumber !== undefined) &&
    (next.courier !== target.courier || next.trackingNumber !== target.trackingNumber) &&
    next.trackingNumber
  ) {
    timeline.push({
      at: new Date().toISOString(),
      label: `Tracking added: ${next.courier || 'Courier'} ${next.trackingNumber}`,
      by: actor.name,
    });
  }

  next.timeline = timeline;
  // Queued so two staff saving at once don't discard each other's change.
  await update('orders', (current) => current.map((o) => (o.id === next.id ? next : o)));
  return NextResponse.json({ ok: true, order: next });
}
