'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { STATUS_LABELS, type OrderStatus } from '@/lib/cms/orders';
import type { PublicCustomer } from '@/lib/cms/customers';
import { Chip, SectionLabel, StitchDivider } from '@/components/Ornaments';
import AddressBook from '@/components/AddressBook';

interface MyOrder {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  items: { productId: number; name: string; qty: number; price: number }[];
  total: number;
  courier: string;
  trackingNumber: string;
  shippingTo: string;
}

const money = (n: number) => `₹ ${n.toLocaleString('en-IN')}`;
const day = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ProfileView({
  customer,
  onEdit,
  onSignedOut,
  onCustomerChange,
}: {
  customer: PublicCustomer;
  onEdit: () => void;
  onSignedOut: () => void;
  onCustomerChange: (c: PublicCustomer) => void;
}) {
  const [orders, setOrders] = useState<MyOrder[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/account/orders');
        const json = await res.json();
        if (!cancelled) setOrders(res.ok ? json.data ?? [] : []);
      } catch {
        if (!cancelled) setOrders([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const signOut = async () => {
    await fetch('/api/account', { method: 'DELETE' });
    onSignedOut();
  };

  return (
    <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <SectionLabel index="01" className="text-maroon mb-3">Your account</SectionLabel>
      <h2 className="font-display text-3xl font-bold text-navy-dark">{customer.name.split(' ')[0] || 'Welcome'}</h2>
      <p className="text-navy-dark/60 text-sm mt-1">+91 {customer.phone}</p>

      <StitchDivider className="text-navy my-6" />

      <div className="profile-readout">
        <span>Name</span><strong>{customer.name}</strong>
        <span>Email</span><strong>{customer.email}</strong>
      </div>

      <button onClick={onEdit} className="mt-4 text-sm font-semibold underline text-maroon">Edit details</button>

      <StitchDivider className="text-navy my-6" />

      <AddressBook customer={customer} onChange={onCustomerChange} />

      <StitchDivider className="text-navy my-6" />

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-bold text-navy-dark">Your orders</h3>
        {orders && orders.length > 0 && <Chip tone="navy">{orders.length}</Chip>}
      </div>

      {orders === null ? (
        <p className="text-navy-dark/50 text-sm">Loading your orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-navy-dark/60 text-sm leading-relaxed">
          Nothing yet. <Link href="/products" className="underline font-semibold">Browse the collection</Link> — orders
          you place will show up here with their progress.
        </p>
      ) : (
        <ul className="profile-orders">
          {orders.map((o) => (
            <li key={o.id}>
              <div className="profile-order-head">
                <strong>{o.number}</strong>
                <Chip tone={o.status === 'delivered' ? 'gold' : 'navy'}>{STATUS_LABELS[o.status]}</Chip>
              </div>
              <p className="profile-order-meta">{day(o.createdAt)} · {o.items.reduce((n, i) => n + i.qty, 0)} item(s) · {money(o.total)}</p>
              <p className="profile-order-items">{o.items.map((i) => `${i.qty} × ${i.name}`).join(', ')}</p>
              {o.trackingNumber && <p className="profile-order-track">{o.courier || 'Courier'} · {o.trackingNumber}</p>}
              <p className="profile-order-meta">To: {o.shippingTo}</p>
            </li>
          ))}
        </ul>
      )}

      <StitchDivider className="text-navy my-6" />

      <button onClick={signOut} className="px-5 py-3 border border-navy/30 rounded-lg text-sm font-semibold">
        Sign out
      </button>
    </motion.div>
  );
}
