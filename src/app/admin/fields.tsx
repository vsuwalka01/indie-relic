'use client';

import { useState } from 'react';

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  hint,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: 'text' | 'number' | 'url';
  hint?: string;
}) {
  return (
    <label className="cms-field">
      <span className="cms-label">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="cms-input" />
      {hint && <span className="cms-hint">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="cms-field">
      <span className="cms-label">{label}</span>
      <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="cms-input cms-textarea" />
      {hint && <span className="cms-hint">{hint}</span>}
    </label>
  );
}

/** Edits a string[] as one entry per line — simpler than a row-builder for short lists. */
export function ListField({
  label,
  value,
  onChange,
  hint,
  rows = 5,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
  rows?: number;
}) {
  return (
    <label className="cms-field">
      <span className="cms-label">{label}</span>
      <textarea
        rows={rows}
        value={value.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
        className="cms-input cms-textarea"
      />
      <span className="cms-hint">{hint ?? 'One per line.'}</span>
    </label>
  );
}

export function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="cms-field">
      <span className="cms-label">{label}</span>
      <div className="cms-image-row">
        <div className="cms-image-preview">
          {value && !broken ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" onError={() => setBroken(true)} onLoad={() => setBroken(false)} />
          ) : (
            <span>{value ? 'not found' : 'no image'}</span>
          )}
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => { setBroken(false); onChange(e.target.value); }}
          placeholder="https://…"
          className="cms-input"
        />
      </div>
      <span className="cms-hint">Paste an image URL (https://…) or a path from /public such as /logo-mark.png</span>
    </div>
  );
}

export function SaveBar({
  dirty,
  saving,
  status,
  onSave,
  onRevert,
}: {
  dirty: boolean;
  saving: boolean;
  status: string;
  onSave: () => void;
  onRevert: () => void;
}) {
  return (
    <div className="cms-savebar">
      <span className={`cms-status ${status.startsWith('Could not') ? 'is-error' : ''}`}>
        {status || (dirty ? 'Unsaved changes' : 'All changes saved')}
      </span>
      <div className="cms-savebar-actions">
        <button onClick={onRevert} disabled={!dirty || saving} className="cms-ghost-btn">Discard</button>
        <button onClick={onSave} disabled={!dirty || saving} className="cms-btn">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
