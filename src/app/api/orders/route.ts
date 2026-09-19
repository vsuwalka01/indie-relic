import { NextResponse } from 'next/server';
import { readJson } from '@/lib/cms/readJson';
import { randomUUID } from 'crypto';
import { read, write, mutate, update } from '@/lib/cms/store';
import { checkCoupon } from '@/lib/cms/coupons';
import { orderNumber, type Order, type OrderItem } from '@/lib/cms/orders';
import { currentCustomer } from '@/lib/cms/customerAuth';

export const dynamic = 'force-dynamic';

const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * Public checkout. Prices and the discount are recalculated from stored data —
 * whatever totals the browser sends are ignored, since a customer could
 * otherwise post their own price.
 */
export async function POST(request: Request) {
  const parsed = await readJson(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.body;

  const customer = {
    name: clean((body.customer as Record<string, unknown>)?.name),
    email: clean((body.customer as Record<string, unknown>)?.email),
    phone: clean((body.customer as Record<string, unknown>)?.phone, 20),
  };
  if (!customer.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }

  const addr = (body.shipping ?? {}) as Record<string, unknown>;
  const shipping = {
    line1: clean(addr.line1),
    line2: clean(addr.line2),
    city: clean(addr.city, 80),
    state: clean(addr.state, 80),
    pincode: clean(addr.pincode, 12),
  };
  if (!shipping.line1 || !shipping.city || !shipping.pincode) {
    return NextResponse.json({ error: 'Address, city and pincode are required' }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (!rawItems.length) return NextResponse.json({ error: 'Your bag is empty' }, { status: 400 });

  const products = await read('products');
  const items: OrderItem[] = [];
  for (const raw of rawItems.slice(0, 100)) {
    const entry = (raw ?? {}) as Record<string, unknown>;
    const product = products.find((p) => p.id === Number(entry.id ?? entry.productId));
    if (!product) continue;
    const qty = Math.min(Math.max(1, Math.round(Number(entry.qty) || 1)), 99);
    items.push({ productId: product.id, name: product.name, craft: product.craft, price: product.price, qty });
  }
  if (!items.length) return NextResponse.json({ error: 'No valid items in the order' }, { status: 400 });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Taken from the session, never from the request body — a customer id in
  // the payload would let anyone file orders against someone else's account.
  const signedIn = await currentCustomer();
  const requestedCode = clean(body.couponCode, 40);

  const now = new Date().toISOString();

  // Reserving the coupon and recording the order both happen inside their
  // collection's mutation queue. Without that, concurrent checkouts each read
  // the same order list and the last write wins — every caller gets a success
  // response and an order number, but only one order survives.
  const reserved = await mutate('coupons', async (coupons) => {
    if (!requestedCode) return { discount: 0, code: '' };

    const result = checkCoupon(coupons, requestedCode, subtotal);
    if (!result.ok) return { discount: 0, code: '' };

    // Re-checked and incremented atomically, so a single-use code cannot be
    // redeemed by several checkouts at once.
    await write(
      'coupons',
      coupons.map((c) => (c.code === result.coupon.code ? { ...c, usedCount: c.usedCount + 1 } : c)),
    );
    return { discount: result.discount, code: result.coupon.code };
  });

  const discount = reserved.discount;
  const couponCode = reserved.code;

  let order: Order;
  try {
    order = await mutate('orders', async (orders) => {
      const created: Order = {
        customerId: signedIn?.id ?? '',
        id: `o_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        token: randomUUID(),
        number: orderNumber(orders),
        createdAt: now,
        customer,
        shipping,
        items,
        subtotal,
        discount,
        couponCode,
        total: Math.max(0, subtotal - discount),
        status: 'new',
        assignedTo: '',
        trackingNumber: '',
        courier: '',
        notes: '',
        timeline: [{ at: now, label: 'Order placed', by: 'Customer' }],
      };
      await write('orders', [created, ...orders]);
      return created;
    });
  } catch {
    // The order never landed, so hand the coupon use back rather than burning it.
    if (couponCode) {
      await update('coupons', (coupons) =>
        coupons.map((c) => (c.code === couponCode ? { ...c, usedCount: Math.max(0, c.usedCount - 1) } : c)),
      );
    }
    return NextResponse.json({ error: 'Could not place the order. Please try again.' }, { status: 500 });
  }

  // The token goes back to the browser once, and only here.
  return NextResponse.json({ ok: true, id: order.id, token: order.token, number: order.number, total: order.total });
}
