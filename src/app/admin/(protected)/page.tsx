import Link from 'next/link';
import { currentUser } from '@/lib/cms/auth';
import { read, storageMode } from '@/lib/cms/store';
import { can } from '@/lib/cms/roles';
import { STATUS_LABELS } from '@/lib/cms/orders';

export const dynamic = 'force-dynamic';

const money = (n: number) => `₹ ${n.toLocaleString('en-IN')}`;

export default async function AdminDashboard() {
  const user = await currentUser();
  if (!user) return null;

  const [products, crafts, orders, coupons] = await Promise.all([
    read('products'),
    read('crafts'),
    read('orders'),
    read('coupons'),
  ]);

  const open = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const mine = orders.filter((o) => o.assignedTo === user.id && o.status !== 'delivered' && o.status !== 'cancelled');
  const revenue = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);

  const cards = [
    { show: can(user.role, 'orders'), href: '/admin/orders', value: String(open.length), label: 'Orders to fulfil', hint: `${orders.length} all time` },
    { show: can(user.role, 'orders'), href: '/admin/orders', value: money(revenue), label: 'Booked revenue', hint: 'Excludes cancelled' },
    { show: can(user.role, 'products'), href: '/admin/products', value: String(products.length), label: 'Products', hint: 'in the shop' },
    { show: can(user.role, 'crafts'), href: '/admin/crafts', value: String(crafts.length), label: 'Craft stories', hint: 'states on the atlas' },
    { show: can(user.role, 'coupons'), href: '/admin/coupons', value: String(coupons.filter((c) => c.active).length), label: 'Active coupons', hint: `${coupons.length} total` },
  ].filter((c) => c.show);

  return (
    <>
      <header className="cms-header">
        <div>
          <h1 className="cms-title">Hello, {user.name.split(' ')[0]}</h1>
          <p className="cms-subtitle">
            Signed in as {user.role}
            {can(user.role, 'orders') && mine.length > 0 && ` · ${mine.length} order${mine.length === 1 ? '' : 's'} assigned to you`}
          </p>
        </div>
      </header>

      <div className="cms-cards">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="cms-card">
            <span className="cms-card-value">{card.value}</span>
            <span className="cms-card-label">{card.label}</span>
            <span className="cms-card-hint">{card.hint}</span>
          </Link>
        ))}
      </div>

      {can(user.role, 'orders') && mine.length > 0 && (
        <section className="cms-panel">
          <h2 className="cms-panel-title mb-3">Assigned to you</h2>
          <ul className="cms-order-items">
            {mine.slice(0, 6).map((o) => (
              <li key={o.id}>
                <Link href="/admin/orders">{o.number} · {o.customer.name}</Link>
                <span>{STATUS_LABELS[o.status]} · {money(o.total)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {can(user.role, 'orders') && orders.length > 0 && (
        <section className="cms-panel">
          <h2 className="cms-panel-title mb-3">Latest orders</h2>
          <ul className="cms-order-items">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id}>
                <Link href="/admin/orders">{o.number} · {o.customer.name} · {o.shipping.city}</Link>
                <span>{STATUS_LABELS[o.status]} · {money(o.total)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="cms-panel">
        <h2 className="cms-panel-title">How saving works</h2>
        <p className="cms-panel-body">
          Changes are written to <strong>{storageMode()}</strong> and appear on the site immediately — no redeploy.
          Until you save something, the site falls back to the original content shipped in the code, so nothing can
          be lost by experimenting here.
        </p>
      </section>
    </>
  );
}
