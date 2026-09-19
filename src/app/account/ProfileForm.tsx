'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { pressable } from '@/lib/motion';
import type { PublicCustomer } from '@/lib/cms/customers';

/** Details capture — shown on a first sign-in, and reused for editing later. */
export default function ProfileForm({
  customer,
  heading,
  intro,
  submitLabel,
  onSaved,
  onCancel,
}: {
  customer: PublicCustomer;
  heading: string;
  intro?: string;
  submitLabel: string;
  onSaved: (customer: PublicCustomer) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState({ name: customer.name, email: customer.email });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Functional update: browser autofill can set several fields in one tick,
  // and spreading a captured `form` would keep only the last of them.
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Could not save your details');
        return;
      }
      onSaved(json.customer);
    } catch {
      setError('Network error — please try again');
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.form
      key="details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={submit}
    >
      <h2 className="font-display text-2xl font-bold text-navy-dark mb-1">{heading}</h2>
      {intro && <p className="text-navy-dark/60 text-sm mb-5">{intro}</p>}

      <div className="profile-grid">
        <label className="profile-field col-span-2">
          <span>Full name</span>
          <input value={form.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" autoFocus />
        </label>
        <label className="profile-field col-span-2">
          <span>Email</span>
          <input type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" />
        </label>
        <label className="profile-field">
          <span>Phone <em>(verified)</em></span>
          <input value={`+91 ${customer.phone}`} readOnly className="is-readonly" />
        </label>
      </div>

      {error && <p className="text-maroon text-sm font-semibold mt-3">{error}</p>}

      <div className="flex gap-3 mt-5">
        <motion.button
          {...pressable}
          type="submit"
          disabled={busy}
          className="flex-1 py-4 bg-navy text-cream font-bold rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-50"
        >
          {busy ? 'Saving…' : submitLabel}
        </motion.button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-5 py-4 border border-navy/30 rounded-lg text-sm font-semibold">
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  );
}
