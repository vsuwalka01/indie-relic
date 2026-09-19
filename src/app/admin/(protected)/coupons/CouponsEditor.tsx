'use client';

import { useState } from 'react';
import type { Coupon } from '@/lib/cms/coupons';
import { useCollection } from '../../useCollection';
import { Field, TextArea, SaveBar } from '../../fields';

const blank = (): Coupon => ({
  code: '',
  description: '',
  type: 'percent',
  value: 10,
  minSubtotal: 0,
  maxUses: 0,
  usedCount: 0,
  expiresAt: '',
  active: true,
});

export default function CouponsEditor({ initial }: { initial: Coupon[] }) {
  const { draft, setDraft, dirty, saving, status, save, revert } = useCollection<Coupon[]>('coupons', initial);
  const [index, setIndex] = useState(initial.length ? 0 : -1);

  const selected = draft[index] ?? null;
  const update = (patch: Partial<Coupon>) => setDraft(draft.map((c, i) => (i === index ? { ...c, ...patch } : c)));

  const add = () => {
    setDraft([...draft, blank()]);
    setIndex(draft.length);
  };

  const remove = () => {
    if (!selected) return;
    if (!confirm(`Delete coupon "${selected.code || 'untitled'}"?`)) return;
    const next = draft.filter((_, i) => i !== index);
    setDraft(next);
    setIndex(next.length ? Math.max(0, index - 1) : -1);
  };

  return (
    <>
      <header className="cms-header">
        <div>
          <h1 className="cms-title">Coupons</h1>
          <p className="cms-subtitle">{draft.filter((c) => c.active).length} active of {draft.length}</p>
        </div>
        <button onClick={add} className="cms-btn">New coupon</button>
      </header>

      <SaveBar dirty={dirty} saving={saving} status={status} onSave={save} onRevert={revert} />

      <div className="cms-split">
        <ul className="cms-list">
          {draft.map((c, i) => (
            <li key={i}>
              <button onClick={() => setIndex(i)} className={`cms-list-item ${i === index ? 'is-active' : ''}`}>
                <span className="cms-list-text">
                  <strong>{c.code || 'NEW CODE'}</strong>
                  <small>
                    {c.type === 'percent' ? `${c.value}% off` : `₹${c.value} off`}
                    {c.active ? '' : ' · paused'}
                    {c.maxUses > 0 ? ` · ${c.usedCount}/${c.maxUses} used` : c.usedCount ? ` · ${c.usedCount} used` : ''}
                  </small>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="cms-detail">
          {!selected ? (
            <p className="cms-empty">No coupon selected.</p>
          ) : (
            <>
              <div className="cms-detail-head">
                <h2 className="cms-panel-title">{selected.code || 'New coupon'}</h2>
                <button onClick={remove} className="cms-danger-btn">Delete</button>
              </div>

              <div className="cms-grid-2">
                <Field
                  label="Code"
                  value={selected.code}
                  onChange={(v) => update({ code: v.toUpperCase().replace(/\s+/g, '') })}
                  hint="What the customer types. Letters, numbers, - and _"
                />

                <label className="cms-field">
                  <span className="cms-label">Discount type</span>
                  <select
                    value={selected.type}
                    onChange={(e) => update({ type: e.target.value as Coupon['type'] })}
                    className="cms-input"
                  >
                    <option value="percent">Percentage off</option>
                    <option value="fixed">Fixed amount off</option>
                  </select>
                </label>

                <Field
                  label={selected.type === 'percent' ? 'Percent off' : 'Rupees off'}
                  type="number"
                  value={selected.value}
                  onChange={(v) => update({ value: Number(v) || 0 })}
                />
                <Field
                  label="Minimum order (₹)"
                  type="number"
                  value={selected.minSubtotal}
                  onChange={(v) => update({ minSubtotal: Number(v) || 0 })}
                  hint="0 means no minimum."
                />
                <Field
                  label="Usage limit"
                  type="number"
                  value={selected.maxUses}
                  onChange={(v) => update({ maxUses: Number(v) || 0 })}
                  hint="0 means unlimited."
                />

                <label className="cms-field">
                  <span className="cms-label">Expires on</span>
                  <input
                    type="date"
                    value={selected.expiresAt}
                    onChange={(e) => update({ expiresAt: e.target.value })}
                    className="cms-input"
                  />
                  <span className="cms-hint">Valid through the end of this day. Leave blank for no expiry.</span>
                </label>
              </div>

              <TextArea
                label="Description"
                value={selected.description}
                onChange={(v) => update({ description: v })}
                rows={2}
                hint="Shown to the customer when the code applies."
              />

              <label className="cms-toggle">
                <input type="checkbox" checked={selected.active} onChange={(e) => update({ active: e.target.checked })} />
                <span>Active — customers can use this code</span>
              </label>

              <p className="cms-hint mt-3">Redeemed {selected.usedCount} time{selected.usedCount === 1 ? '' : 's'} so far.</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
