'use client';

import { useState } from 'react';
import type { StateCraft } from '@/lib/stateCrafts';
import type { Product } from '@/lib/products';
import { useCollection } from '../../useCollection';
import { Field, TextArea, SaveBar } from '../../fields';

export default function CraftsEditor({ initial, products }: { initial: StateCraft[]; products: Product[] }) {
  const { draft, setDraft, dirty, saving, status, save, revert } = useCollection<StateCraft[]>('crafts', initial);
  const [selectedState, setSelectedState] = useState<string | null>(initial[0]?.state ?? null);
  const [filter, setFilter] = useState('');

  const selected = draft.find((c) => c.state === selectedState) ?? null;
  const shown = draft.filter((c) => (c.state + ' ' + c.craft).toLowerCase().includes(filter.toLowerCase()));

  const update = (patch: Partial<StateCraft>) => {
    setDraft(draft.map((c) => (c.state === selectedState ? { ...c, ...patch } : c)));
  };

  return (
    <>
      <header className="cms-header">
        <div>
          <h1 className="cms-title">Craft stories</h1>
          <p className="cms-subtitle">{draft.length} states on the atlas</p>
        </div>
      </header>

      <SaveBar dirty={dirty} saving={saving} status={status} onSave={save} onRevert={revert} />

      <div className="cms-split">
        <div>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter states…"
            className="cms-input mb-3"
          />
          <ul className="cms-list">
            {shown.map((c) => (
              <li key={c.state}>
                <button
                  onClick={() => setSelectedState(c.state)}
                  className={`cms-list-item ${c.state === selectedState ? 'is-active' : ''}`}
                >
                  <span className="cms-list-text">
                    <strong>{c.state}</strong>
                    <small>{c.craft}{c.productId ? ' · linked' : ''}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="cms-detail">
          {!selected ? (
            <p className="cms-empty">Pick a state to edit its story.</p>
          ) : (
            <>
              <h2 className="cms-panel-title mb-4">{selected.state}</h2>

              <div className="cms-grid-2">
                <Field label="Craft name" value={selected.craft} onChange={(v) => update({ craft: v })} />
                <Field label="Region" value={selected.region} onChange={(v) => update({ region: v })} />
                <Field label="Age" value={selected.age} onChange={(v) => update({ age: v })} hint="e.g. Alive from 400 yrs" />

                <label className="cms-field">
                  <span className="cms-label">Linked product</span>
                  <select
                    value={selected.productId ?? ''}
                    onChange={(e) => update({ productId: e.target.value ? Number(e.target.value) : undefined })}
                    className="cms-input"
                  >
                    <option value="">Not sold yet</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <span className="cms-hint">Linked states get a gold pin on the map.</span>
                </label>
              </div>

              <TextArea label="Tagline" value={selected.tagline} onChange={(v) => update({ tagline: v })} rows={2} />
              <TextArea label="Description" value={selected.description} onChange={(v) => update({ description: v })} rows={8} />

              <p className="cms-hint mt-2">
                State names match the map artwork, so they can&rsquo;t be renamed here — editing one would break its pin.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
