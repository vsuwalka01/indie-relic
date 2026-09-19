'use client';

import type { SiteSettings } from '@/lib/cms/settings';
import { useCollection } from '../../useCollection';
import { Field, TextArea, ListField, SaveBar } from '../../fields';

export default function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const { draft, setDraft, dirty, saving, status, save, revert } = useCollection<SiteSettings>('settings', initial);

  const set = (patch: Partial<SiteSettings>) => setDraft({ ...draft, ...patch });

  const setStat = (index: number, patch: Partial<SiteSettings['stats'][number]>) => {
    set({ stats: draft.stats.map((s, i) => (i === index ? { ...s, ...patch } : s)) });
  };

  return (
    <>
      <header className="cms-header">
        <div>
          <h1 className="cms-title">Site content</h1>
          <p className="cms-subtitle">Headlines and copy across the home page</p>
        </div>
      </header>

      <SaveBar dirty={dirty} saving={saving} status={status} onSave={save} onRevert={revert} />

      <section className="cms-panel">
        <h2 className="cms-panel-title mb-4">Hero</h2>
        <Field label="Eyebrow" value={draft.heroEyebrow} onChange={(v) => set({ heroEyebrow: v })} />
        <ListField
          label="Headline"
          value={draft.heroLines}
          onChange={(v) => set({ heroLines: v })}
          hint="One line per row — each reveals in sequence."
          rows={3}
        />
        <TextArea label="Intro paragraph" value={draft.heroBody} onChange={(v) => set({ heroBody: v })} />
      </section>

      <section className="cms-panel">
        <h2 className="cms-panel-title mb-4">Scrolling ribbon</h2>
        <ListField label="Phrases" value={draft.marqueeItems} onChange={(v) => set({ marqueeItems: v })} rows={6} />
      </section>

      <section className="cms-panel">
        <h2 className="cms-panel-title mb-4">Numbers strip</h2>
        {draft.stats.map((stat, i) => (
          <div key={i} className="cms-grid-3">
            <Field label="Value" type="number" value={stat.value} onChange={(v) => setStat(i, { value: Number(v) || 0 })} />
            <Field label="Suffix" value={stat.suffix} onChange={(v) => setStat(i, { suffix: v })} hint="e.g. + or  yrs" />
            <Field label="Label" value={stat.label} onChange={(v) => setStat(i, { label: v })} />
          </div>
        ))}
      </section>

      <section className="cms-panel">
        <h2 className="cms-panel-title mb-4">Section headings</h2>
        <div className="cms-grid-2">
          <Field label="Featured products" value={draft.featuredHeading} onChange={(v) => set({ featuredHeading: v })} />
          <Field label="Testimonials" value={draft.testimonialsHeading} onChange={(v) => set({ testimonialsHeading: v })} />
        </div>
      </section>

      <section className="cms-panel">
        <h2 className="cms-panel-title mb-4">Newsletter</h2>
        <Field label="Heading" value={draft.newsletterHeading} onChange={(v) => set({ newsletterHeading: v })} />
        <TextArea label="Body" value={draft.newsletterBody} onChange={(v) => set({ newsletterBody: v })} rows={3} />
      </section>
    </>
  );
}
