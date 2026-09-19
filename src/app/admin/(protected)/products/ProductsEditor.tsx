'use client';

import { useState } from 'react';
import type { Product } from '@/lib/products';
import { useCollection } from '../../useCollection';
import { Field, TextArea, ImageField, ListField, SaveBar } from '../../fields';

const blank = (id: number): Product => ({
  id,
  name: 'New product',
  craft: '',
  price: 0,
  image: '',
  gallery: [],
  intro: '',
  aboutCraft: '',
  ideaBehind: '',
  description: '',
  details: '',
  shipping: '',
});

export default function ProductsEditor({ initial }: { initial: Product[] }) {
  const { draft, setDraft, dirty, saving, status, save, revert } = useCollection<Product[]>('products', initial);
  const [selectedId, setSelectedId] = useState<number | null>(initial[0]?.id ?? null);

  const selected = draft.find((p) => p.id === selectedId) ?? null;

  const update = (patch: Partial<Product>) => {
    setDraft(draft.map((p) => (p.id === selectedId ? { ...p, ...patch } : p)));
  };

  const addProduct = () => {
    const nextId = draft.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const item = blank(nextId);
    setDraft([...draft, item]);
    setSelectedId(nextId);
  };

  const removeProduct = (id: number) => {
    const target = draft.find((p) => p.id === id);
    if (!target) return;
    if (!confirm(`Delete "${target.name}"? This cannot be undone once you save.`)) return;
    const remaining = draft.filter((p) => p.id !== id);
    setDraft(remaining);
    if (selectedId === id) setSelectedId(remaining[0]?.id ?? null);
  };

  return (
    <>
      <header className="cms-header">
        <div>
          <h1 className="cms-title">Products</h1>
          <p className="cms-subtitle">{draft.length} in the shop</p>
        </div>
        <button onClick={addProduct} className="cms-btn">Add product</button>
      </header>

      <SaveBar dirty={dirty} saving={saving} status={status} onSave={save} onRevert={revert} />

      <div className="cms-split">
        <ul className="cms-list">
          {draft.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => setSelectedId(p.id)}
                className={`cms-list-item ${p.id === selectedId ? 'is-active' : ''}`}
              >
                <span className="cms-list-thumb">
                  {p.image ? <img src={p.image} alt="" /> : <i />}
                </span>
                <span className="cms-list-text">
                  <strong>{p.name || 'Untitled'}</strong>
                  <small>₹ {p.price.toLocaleString('en-IN')}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="cms-detail">
          {!selected ? (
            <p className="cms-empty">No product selected. Add one to get started.</p>
          ) : (
            <>
              <div className="cms-detail-head">
                <h2 className="cms-panel-title">{selected.name || 'Untitled'}</h2>
                <button onClick={() => removeProduct(selected.id)} className="cms-danger-btn">Delete</button>
              </div>

              <div className="cms-grid-2">
                <Field label="Name" value={selected.name} onChange={(v) => update({ name: v })} />
                <Field label="Craft" value={selected.craft} onChange={(v) => update({ craft: v })} hint="Shown as the badge on the product image." />
                <Field label="Price (₹)" type="number" value={selected.price} onChange={(v) => update({ price: Number(v) || 0 })} />
                <Field label="ID" type="number" value={selected.id} onChange={(v) => {
                  const nextId = Math.trunc(Number(v)) || selected.id;
                  if (draft.some((p) => p.id === nextId && p.id !== selected.id)) return;
                  setDraft(draft.map((p) => (p.id === selectedId ? { ...p, id: nextId } : p)));
                  setSelectedId(nextId);
                }} hint="Used in the product URL. Must be unique." />
              </div>

              <ImageField label="Main image" value={selected.image} onChange={(v) => update({ image: v })} />
              <ListField label="Gallery images" value={selected.gallery} onChange={(v) => update({ gallery: v })} hint="One image URL per line." />

              <TextArea label="Intro" value={selected.intro} onChange={(v) => update({ intro: v })} rows={2} />
              <TextArea label="About the craft" value={selected.aboutCraft} onChange={(v) => update({ aboutCraft: v })} />
              <TextArea label="Idea behind the product" value={selected.ideaBehind} onChange={(v) => update({ ideaBehind: v })} />
              <TextArea label="Description" value={selected.description} onChange={(v) => update({ description: v })} />
              <TextArea label="Product details" value={selected.details} onChange={(v) => update({ details: v })} rows={3} />
              <TextArea label="Shipping" value={selected.shipping} onChange={(v) => update({ shipping: v })} rows={3} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
