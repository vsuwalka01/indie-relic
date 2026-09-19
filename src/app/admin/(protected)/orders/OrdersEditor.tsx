'use client';

import { useMemo, useState } from 'react';
import { ORDER_STATUSES, STATUS_LABELS, formatAddress, type Order, type OrderStatus } from '@/lib/cms/orders';
import type { PublicUser } from '@/lib/cms/roles';

const money = (n: number) => `₹ ${n.toLocaleString('en-IN')}`;
const when = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function OrdersEditor({
  initial,
  team,
  canAssign,
}: {
  initial: Order[];
  team: PublicUser[];
  canAssign: boolean;
}) {
  const [orders, setOrders] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(initial[0]?.id ?? null);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const selected = orders.find((o) => o.id === selectedId) ?? null;
  const shown = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const counts = useMemo(() => {
    const base = { open: 0, revenue: 0 };
    for (const o of orders) {
      if (o.status !== 'delivered' && o.status !== 'cancelled') base.open += 1;
      if (o.status !== 'cancelled') base.revenue += o.total;
    }
    return base;
  }, [orders]);

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...body }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Could not update the order');
        return;
      }
      setOrders((list) => list.map((o) => (o.id === id ? json.order : o)));
    } catch {
      setError('Could not update the order: network error');
    } finally {
      setBusy(false);
    }
  };

  const nameFor = (id: string) => team.find((u) => u.id === id)?.name ?? 'Unassigned';

  return (
    <>
      <header className="cms-header">
        <div>
          <h1 className="cms-title">Orders</h1>
          <p className="cms-subtitle">
            {orders.length} total · {counts.open} still to fulfil · {money(counts.revenue)} booked
          </p>
        </div>
      </header>

      {error && <p className="cms-error mb-3">{error}</p>}

      <div className="cms-filter-row">
        <button onClick={() => setFilter('all')} className={`cms-pill ${filter === 'all' ? 'is-active' : ''}`}>
          All ({orders.length})
        </button>
        {ORDER_STATUSES.map((s) => {
          const n = orders.filter((o) => o.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)} className={`cms-pill ${filter === s ? 'is-active' : ''}`}>
              {STATUS_LABELS[s]} ({n})
            </button>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <p className="cms-empty">
          No orders yet. They appear here the moment a customer completes checkout on the site.
        </p>
      ) : (
        <div className="cms-split">
          <ul className="cms-list">
            {shown.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => setSelectedId(o.id)}
                  className={`cms-list-item ${o.id === selectedId ? 'is-active' : ''}`}
                >
                  <span className="cms-list-text">
                    <strong>{o.number} · {o.customer.name}</strong>
                    <small>
                      {money(o.total)} · {STATUS_LABELS[o.status]} · {nameFor(o.assignedTo)}
                    </small>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="cms-detail">
            {!selected ? (
              <p className="cms-empty">Pick an order.</p>
            ) : (
              <>
                <div className="cms-detail-head">
                  <div>
                    <h2 className="cms-panel-title">{selected.number}</h2>
                    <p className="cms-subtitle">Placed {when(selected.createdAt)}</p>
                  </div>
                  <span className={`cms-badge is-${selected.status}`}>{STATUS_LABELS[selected.status]}</span>
                </div>

                <div className="cms-grid-2">
                  <div className="cms-readout">
                    <span className="cms-label">Ships to</span>
                    <strong>{selected.customer.name}</strong>
                    <p>{formatAddress(selected.shipping)}</p>
                    <p>{selected.customer.email}{selected.customer.phone ? ` · ${selected.customer.phone}` : ''}</p>
                  </div>

                  <div className="cms-readout">
                    <span className="cms-label">Payment</span>
                    <p>Subtotal {money(selected.subtotal)}</p>
                    {selected.discount > 0 && (
                      <p>Discount −{money(selected.discount)} {selected.couponCode && `(${selected.couponCode})`}</p>
                    )}
                    <strong>Total {money(selected.total)}</strong>
                  </div>
                </div>

                <span className="cms-label mt-4">Items</span>
                <ul className="cms-order-items">
                  {selected.items.map((item) => (
                    <li key={item.productId}>
                      <span>{item.qty} × {item.name}</span>
                      <span>{money(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>

                <div className="cms-grid-2 mt-4">
                  <label className="cms-field">
                    <span className="cms-label">Status</span>
                    <select
                      value={selected.status}
                      disabled={busy}
                      onChange={(e) => patch(selected.id, { status: e.target.value })}
                      className="cms-input"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </label>

                  <label className="cms-field">
                    <span className="cms-label">Handled by</span>
                    <select
                      value={selected.assignedTo}
                      disabled={busy || !canAssign}
                      onChange={(e) => patch(selected.id, { assignedTo: e.target.value })}
                      className="cms-input"
                    >
                      <option value="">Unassigned</option>
                      {team.map((u) => (
                        <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                      ))}
                    </select>
                    <span className="cms-hint">
                      {canAssign ? 'Who is responsible for packing and dispatch.' : 'Only owners and managers can reassign.'}
                    </span>
                  </label>

                  <label className="cms-field">
                    <span className="cms-label">Courier</span>
                    <input
                      defaultValue={selected.courier}
                      onBlur={(e) => e.target.value !== selected.courier && patch(selected.id, { courier: e.target.value })}
                      className="cms-input"
                    />
                  </label>

                  <label className="cms-field">
                    <span className="cms-label">Tracking number</span>
                    <input
                      defaultValue={selected.trackingNumber}
                      onBlur={(e) =>
                        e.target.value !== selected.trackingNumber && patch(selected.id, { trackingNumber: e.target.value })
                      }
                      className="cms-input"
                    />
                  </label>
                </div>

                <label className="cms-field">
                  <span className="cms-label">Internal notes</span>
                  <textarea
                    defaultValue={selected.notes}
                    rows={3}
                    onBlur={(e) => e.target.value !== selected.notes && patch(selected.id, { notes: e.target.value })}
                    className="cms-input cms-textarea"
                  />
                  <span className="cms-hint">Saved when you click away. Never shown to the customer.</span>
                </label>

                <span className="cms-label mt-4">History</span>
                <ol className="cms-timeline">
                  {[...selected.timeline].reverse().map((event, i) => (
                    <li key={i}>
                      <strong>{event.label}</strong>
                      <small>{when(event.at)} · {event.by}</small>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
