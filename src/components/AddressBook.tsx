'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pressable } from '@/lib/motion';
import { Chip } from './Ornaments';
import type { PublicCustomer, SavedAddress } from '@/lib/cms/customers';

export const BLANK_ADDRESS = {
  label: 'Home', name: '', phone: '',
  line1: '', line2: '', city: '', state: '', pincode: '',
};

export type AddressDraft = typeof BLANK_ADDRESS;

export function formatAddress(a: SavedAddress): string {
  return [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(', ');
}

/** Add/edit form, used by both the account page and checkout. */
export function AddressForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  dark = false,
}: {
  initial?: AddressDraft;
  submitLabel: string;
  onSubmit: (draft: AddressDraft, makeDefault: boolean) => Promise<string | null>;
  onCancel?: () => void;
  dark?: boolean;
}) {
  const [draft, setDraft] = useState<AddressDraft>({ ...BLANK_ADDRESS, ...initial });
  const [makeDefault, setMakeDefault] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Functional update: autofill can set several fields in one tick.
  const set = (patch: Partial<AddressDraft>) => setDraft((prev) => ({ ...prev, ...patch }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const problem = await onSubmit(draft, makeDefault);
    if (problem) setError(problem);
    setBusy(false);
  };

  const cls = dark ? 'checkout-input' : '';

  return (
    <form onSubmit={submit} className={dark ? 'addr-form is-dark' : 'addr-form'}>
      <div className="addr-grid">
        <label className="addr-field">
          <span>Label</span>
          <input className={cls} value={draft.label} onChange={(e) => set({ label: e.target.value })} placeholder="Home" />
        </label>
        <label className="addr-field">
          <span>Deliver to</span>
          <input className={cls} value={draft.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" />
        </label>
        <label className="addr-field addr-wide">
          <span>Address</span>
          <input className={cls} value={draft.line1} onChange={(e) => set({ line1: e.target.value })} autoComplete="address-line1" />
        </label>
        <label className="addr-field addr-wide">
          <span>Apartment, landmark <em>(optional)</em></span>
          <input className={cls} value={draft.line2} onChange={(e) => set({ line2: e.target.value })} autoComplete="address-line2" />
        </label>
        <label className="addr-field">
          <span>City</span>
          <input className={cls} value={draft.city} onChange={(e) => set({ city: e.target.value })} autoComplete="address-level2" />
        </label>
        <label className="addr-field">
          <span>State</span>
          <input className={cls} value={draft.state} onChange={(e) => set({ state: e.target.value })} autoComplete="address-level1" />
        </label>
        <label className="addr-field">
          <span>Pincode</span>
          <input className={cls} value={draft.pincode} onChange={(e) => set({ pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} inputMode="numeric" autoComplete="postal-code" />
        </label>
        <label className="addr-field">
          <span>Contact number <em>(optional)</em></span>
          <input className={cls} value={draft.phone} onChange={(e) => set({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} inputMode="numeric" autoComplete="tel" />
        </label>
      </div>

      <label className="addr-default-toggle">
        <input type="checkbox" checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)} />
        <span>Make this my default address</span>
      </label>

      {error && <p className={dark ? 'text-gold text-sm mt-2' : 'text-maroon text-sm font-semibold mt-2'}>{error}</p>}

      <div className="flex gap-3 mt-4">
        <motion.button {...pressable} type="submit" disabled={busy} className={dark ? 'addr-btn is-dark' : 'addr-btn'}>
          {busy ? 'Saving…' : submitLabel}
        </motion.button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={dark ? 'addr-ghost is-dark' : 'addr-ghost'}>Cancel</button>
        )}
      </div>
    </form>
  );
}

/** Full address book: list, add, edit, delete, choose a default. */
export default function AddressBook({
  customer,
  onChange,
}: {
  customer: PublicCustomer;
  onChange: (customer: PublicCustomer) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState('');

  const call = async (method: string, body?: unknown, query = ''): Promise<string | null> => {
    try {
      const res = await fetch(`/api/account/addresses${query}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json();
      if (!res.ok) return json.error || 'Something went wrong';
      if (json.customer) onChange(json.customer);
      return null;
    } catch {
      return 'Network error';
    }
  };

  const remove = async (a: SavedAddress) => {
    if (!confirm(`Remove the "${a.label}" address?`)) return;
    const problem = await call('DELETE', undefined, `?id=${encodeURIComponent(a.id)}`);
    if (problem) setError(problem);
  };

  const makeDefault = async (a: SavedAddress) => {
    const problem = await call('PUT', { id: a.id, setDefault: true });
    if (problem) setError(problem);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-bold text-navy-dark">Address book</h3>
        {!adding && (
          <button onClick={() => { setAdding(true); setEditing(null); }} className="text-sm font-semibold underline text-maroon">
            Add address
          </button>
        )}
      </div>

      {error && <p className="text-maroon text-sm font-semibold mb-3">{error}</p>}

      {customer.addresses.length === 0 && !adding && (
        <p className="text-navy-dark/60 text-sm leading-relaxed">
          No addresses saved yet. Add one and checkout will fill itself in from then on.
        </p>
      )}

      <div className="addr-list">
        <AnimatePresence initial={false}>
          {customer.addresses.map((a) => (
            <motion.div
              key={a.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`addr-card ${a.isDefault ? 'is-default' : ''}`}
            >
              {editing === a.id ? (
                <AddressForm
                  initial={a}
                  submitLabel="Save changes"
                  onCancel={() => setEditing(null)}
                  onSubmit={async (draft, setAsDefault) => {
                    const problem = await call('PUT', { id: a.id, ...draft, setDefault: setAsDefault || a.isDefault });
                    if (!problem) setEditing(null);
                    return problem;
                  }}
                />
              ) : (
                <>
                  <div className="addr-card-head">
                    <strong>{a.label}</strong>
                    {a.isDefault && <Chip tone="gold">Default</Chip>}
                  </div>
                  <p className="addr-card-name">{a.name}{a.phone ? ` · +91 ${a.phone}` : ''}</p>
                  <p className="addr-card-body">{formatAddress(a)}</p>
                  <div className="addr-card-actions">
                    <button onClick={() => { setEditing(a.id); setAdding(false); }}>Edit</button>
                    {!a.isDefault && <button onClick={() => makeDefault(a)}>Make default</button>}
                    <button onClick={() => remove(a)} className="is-danger">Remove</button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {adding && (
        <div className="addr-card mt-3">
          <AddressForm
            submitLabel="Save address"
            onCancel={() => setAdding(false)}
            onSubmit={async (draft, setAsDefault) => {
              const problem = await call('POST', { ...draft, isDefault: setAsDefault });
              if (!problem) setAdding(false);
              return problem;
            }}
          />
        </div>
      )}
    </div>
  );
}
