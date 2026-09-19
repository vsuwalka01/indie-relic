'use client';

import { useCallback, useMemo, useState } from 'react';

/**
 * Holds an editable copy of a collection alongside the last-saved version, so
 * "dirty" is a real comparison rather than a flag that can drift out of sync.
 */
export function useCollection<T>(name: string, initial: T) {
  const [saved, setSaved] = useState<T>(initial);
  const [draft, setDraft] = useState<T>(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  const save = useCallback(async () => {
    setSaving(true);
    setStatus('');
    try {
      const res = await fetch(`/api/admin/content/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: draft }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setStatus(`Could not save: ${body.error || res.statusText}`);
        return;
      }
      setSaved(draft);
      setStatus('Saved — live on the site now');
    } catch {
      setStatus('Could not save: network error');
    } finally {
      setSaving(false);
    }
  }, [draft, name]);

  const revert = useCallback(() => {
    setDraft(saved);
    setStatus('');
  }, [saved]);

  return { draft, setDraft, dirty, saving, status, save, revert };
}
