import { NextResponse } from 'next/server';
import { read } from '@/lib/cms/store';
import { currentCustomer } from '@/lib/cms/customerAuth';
import { formatAddress } from '@/lib/cms/orders';

export const dynamic = 'force-dynamic';

/**
 * The signed-in customer's orders, matched on the verified account id — so
 * history now follows the person rather than the browser they ordered from.
 */
export async function GET() {
  const customer = await currentCustomer();
  if (!customer) return NextResponse.json({ error: 'Please sign in' }, { status: 401 });

  const orders = await read('orders');

  const mine = orders
    .filter((o) => o.customerId === customer.id)
    .map((o) => ({
      id: o.id,
      number: o.number,
      createdAt: o.createdAt,
      status: o.status,
      items: o.items,
      subtotal: o.subtotal,
      discount: o.discount,
      couponCode: o.couponCode,
      total: o.total,
      courier: o.courier,
      trackingNumber: o.trackingNumber,
      shippingTo: formatAddress(o.shipping),
      // Internal notes and the assigned staff member stay out of this.
      timeline: o.timeline.map((e) => ({ at: e.at, label: e.label })),
    }));

  return NextResponse.json({ data: mine });
}
