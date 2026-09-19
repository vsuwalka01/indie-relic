'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { can, ROLE_LABELS, type Permission, type PublicUser } from '@/lib/cms/roles';

const NAV: { href: string; label: string; permission: Permission }[] = [
  { href: '/admin', label: 'Dashboard', permission: 'orders' },
  { href: '/admin/orders', label: 'Orders', permission: 'orders' },
  { href: '/admin/products', label: 'Products', permission: 'products' },
  { href: '/admin/crafts', label: 'Craft stories', permission: 'crafts' },
  { href: '/admin/coupons', label: 'Coupons', permission: 'coupons' },
  { href: '/admin/settings', label: 'Site content', permission: 'settings' },
  { href: '/admin/theme', label: 'Theme', permission: 'theme' },
  { href: '/admin/users', label: 'Team', permission: 'users' },
];

export default function AdminChrome({
  children,
  storage,
  user,
}: {
  children: React.ReactNode;
  storage: string;
  user: PublicUser;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // The dashboard is the one page everyone can see, whatever their role.
  const visible = NAV.filter((item) => item.href === '/admin' || can(user.role, item.permission));

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <div>
          <p className="cms-brand">Indie Relic</p>
          <p className="cms-brand-sub">Content manager</p>

          <nav className="cms-nav">
            {visible.map((item) => {
              const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`cms-nav-link ${active ? 'is-active' : ''}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="cms-sidebar-foot">
          <div className="cms-whoami">
            <strong>{user.name}</strong>
            <span title={ROLE_LABELS[user.role]}>{user.role}</span>
          </div>
          <p className="cms-storage">Saving to<br /><strong>{storage}</strong></p>
          <Link href="/" target="_blank" className="cms-ghost-btn">View site ↗</Link>
          <button onClick={logout} className="cms-ghost-btn">Sign out</button>
        </div>
      </aside>

      <main className="cms-main">{children}</main>
    </div>
  );
}
