'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
      return;
    }

    const body = await res.json().catch(() => ({}));
    setError(body.error || 'Sign in failed');
    setBusy(false);
  };

  return (
    <div className="cms-login">
      <form onSubmit={submit} className="cms-login-card">
        <p className="cms-brand">Indie Relic</p>
        <p className="cms-brand-sub mb-6">Content manager</p>

        {!configured && (
          <p className="cms-alert">
            No admin account is set yet. Add <code>ADMIN_USERNAME</code> and <code>ADMIN_PASSWORD</code> to{' '}
            <code>.env.local</code>, then restart the dev server.
          </p>
        )}

        <label htmlFor="username" className="cms-label">Admin ID</label>
        <input
          id="username"
          type="text"
          autoFocus
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="cms-input mb-4"
        />

        <label htmlFor="password" className="cms-label">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="cms-input"
        />

        {error && <p className="cms-error">{error}</p>}

        <button type="submit" disabled={busy || !username || !password} className="cms-btn mt-5 w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
