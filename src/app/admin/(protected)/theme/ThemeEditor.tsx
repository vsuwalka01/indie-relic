'use client';

import { DEFAULT_THEME, THEME_PRESETS, type Theme } from '@/lib/cms/theme';
import { useCollection } from '../../useCollection';
import { SaveBar } from '../../fields';

const SWATCHES: { key: keyof Omit<Theme, 'preset'>; label: string; note: string }[] = [
  { key: 'cream', label: 'Paper', note: 'Page background' },
  { key: 'navy', label: 'Navy', note: 'Hero and ribbons' },
  { key: 'navyDark', label: 'Ink', note: 'Body text and deep panels' },
  { key: 'gold', label: 'Gold', note: 'Accents and highlights' },
  { key: 'maroon', label: 'Maroon', note: 'Labels and links' },
];

export default function ThemeEditor({ initial }: { initial: Theme }) {
  const { draft, setDraft, dirty, saving, status, save, revert } = useCollection<Theme>('theme', initial);

  return (
    <>
      <header className="cms-header">
        <div>
          <h1 className="cms-title">Theme</h1>
          <p className="cms-subtitle">Brand colours used across the storefront</p>
        </div>
      </header>

      <SaveBar dirty={dirty} saving={saving} status={status} onSave={save} onRevert={revert} />

      <section className="cms-panel">
        <h2 className="cms-panel-title mb-4">Presets</h2>
        <div className="cms-preset-row">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.preset}
              onClick={() => setDraft({ ...preset })}
              className={`cms-preset ${draft.preset === preset.preset ? 'is-active' : ''}`}
            >
              <span className="cms-preset-swatches">
                {(['cream', 'navy', 'gold', 'maroon'] as const).map((k) => (
                  <i key={k} style={{ background: preset[k] }} />
                ))}
              </span>
              {preset.preset}
            </button>
          ))}
        </div>
      </section>

      <section className="cms-panel">
        <h2 className="cms-panel-title mb-4">Colours</h2>
        {SWATCHES.map(({ key, label, note }) => (
          <div key={key} className="cms-color-row">
            <input
              type="color"
              value={draft[key]}
              onChange={(e) => setDraft({ ...draft, [key]: e.target.value, preset: 'Custom' })}
              className="cms-color"
              aria-label={label}
            />
            <div>
              <strong>{label}</strong>
              <small>{note}</small>
            </div>
            <input
              value={draft[key]}
              onChange={(e) => setDraft({ ...draft, [key]: e.target.value, preset: 'Custom' })}
              className="cms-input cms-input-sm"
            />
          </div>
        ))}
        <button onClick={() => setDraft({ ...DEFAULT_THEME })} className="cms-ghost-btn mt-3">
          Reset to the original palette
        </button>
      </section>

      <section className="cms-panel">
        <h2 className="cms-panel-title mb-4">Preview</h2>
        <div className="cms-theme-preview" style={{ background: draft.cream, color: draft.navyDark }}>
          <div style={{ background: draft.navy, color: draft.cream }} className="cms-theme-hero">
            <span style={{ color: draft.gold }}>Living traditions</span>
            <strong>Indian Traditions, Reimagined.</strong>
          </div>
          <div className="cms-theme-row">
            <span style={{ background: draft.gold, color: draft.navyDark }}>Explore the collection</span>
            <span style={{ color: draft.maroon }}>01 — Objects with a story</span>
          </div>
        </div>
      </section>
    </>
  );
}
