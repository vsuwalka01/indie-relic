'use client';

import { useState } from 'react';
import { ROLES, ROLE_LABELS, type PublicUser, type Role } from '@/lib/cms/roles';

export default function UsersEditor({ initial, actorId }: { initial: PublicUser[]; actorId: string }) {
  const [users, setUsers] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'editor' as Role });
  const [resetFor, setResetFor] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const call = async (method: string, body?: unknown, query = '') => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch(`/api/admin/users${query}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Something went wrong');
        return null;
      }
      return json;
    } catch {
      setError('Network error');
      return null;
    } finally {
      setBusy(false);
    }
  };

  const refresh = async () => {
    const json = await call('GET');
    if (json) setUsers(json.data);
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const json = await call('POST', form);
    if (json) {
      setForm({ name: '', username: '', password: '', role: 'editor' });
      setNotice(`${json.user.name} can now sign in`);
      await refresh();
    }
  };

  const update = async (id: string, patch: Record<string, unknown>) => {
    const json = await call('PATCH', { id, ...patch });
    if (json) await refresh();
  };

  const resetPassword = async (id: string) => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    const json = await call('PATCH', { id, password: newPassword });
    if (json) {
      setResetFor(null);
      setNewPassword('');
      setNotice('Password updated');
    }
  };

  const remove = async (user: PublicUser) => {
    if (!confirm(`Remove ${user.name}? They lose access immediately.`)) return;
    const json = await call('DELETE', undefined, `?id=${encodeURIComponent(user.id)}`);
    if (json) await refresh();
  };

  return (
    <>
      <header className="cms-header">
        <div>
          <h1 className="cms-title">Team</h1>
          <p className="cms-subtitle">{users.length} {users.length === 1 ? 'person' : 'people'} with access</p>
        </div>
      </header>

      {error && <p className="cms-error mb-3">{error}</p>}
      {notice && <p className="cms-notice mb-3">{notice}</p>}

      <section className="cms-panel">
        <h2 className="cms-panel-title mb-4">Add someone</h2>
        <form onSubmit={create}>
          <div className="cms-grid-2">
            <label className="cms-field">
              <span className="cms-label">Name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="cms-input" />
            </label>
            <label className="cms-field">
              <span className="cms-label">Login ID</span>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
                className="cms-input"
              />
              <span className="cms-hint">Letters, numbers, . _ - (3+ characters)</span>
            </label>
            <label className="cms-field">
              <span className="cms-label">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="cms-input"
              />
              <span className="cms-hint">At least 8 characters. Stored hashed — you won&rsquo;t see it again.</span>
            </label>
            <label className="cms-field">
              <span className="cms-label">Role</span>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className="cms-input"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" disabled={busy} className="cms-btn">Add to team</button>
        </form>
      </section>

      <section className="cms-panel">
        <h2 className="cms-panel-title mb-4">Everyone</h2>
        <table className="cms-table">
          <thead>
            <tr>
              <th>Name</th><th>Login ID</th><th>Role</th><th>Status</th><th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.name}</strong>
                  {u.id === actorId && <span className="cms-you">you</span>}
                </td>
                <td>{u.username}</td>
                <td>
                  <select
                    value={u.role}
                    disabled={busy || u.id === actorId}
                    onChange={(e) => update(u.id, { role: e.target.value })}
                    className="cms-input cms-input-sm"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td>{u.active ? 'Active' : 'Disabled'}</td>
                <td className="cms-row-actions">
                  <button
                    onClick={() => setResetFor(resetFor === u.id ? null : u.id)}
                    disabled={busy}
                    className="cms-ghost-btn"
                  >
                    Reset password
                  </button>
                  <button
                    onClick={() => update(u.id, { active: !u.active })}
                    disabled={busy || u.id === actorId}
                    className="cms-ghost-btn"
                  >
                    {u.active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => remove(u)}
                    disabled={busy || u.id === actorId || u.id === 'owner'}
                    className="cms-danger-btn"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {resetFor && (
          <div className="cms-inline-form">
            <input
              type="password"
              placeholder="New password (8+ characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="cms-input"
            />
            <button onClick={() => resetPassword(resetFor)} disabled={busy} className="cms-btn">Set password</button>
            <button onClick={() => { setResetFor(null); setNewPassword(''); }} className="cms-ghost-btn">Cancel</button>
          </div>
        )}
      </section>

      <section className="cms-panel">
        <h2 className="cms-panel-title mb-3">What each role can do</h2>
        <ul className="cms-role-list">
          {ROLES.map((r) => (
            <li key={r}><strong>{r}</strong> — {ROLE_LABELS[r].split('— ')[1]}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
