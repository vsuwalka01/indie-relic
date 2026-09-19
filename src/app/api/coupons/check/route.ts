import { NextResponse } from 'next/server';
import { readJson } from '@/lib/cms/readJson';
import { read } from '@/lib/cms/store';
import { checkCoupon } from '@/lib/cms/coupons';

export const dynamic = 'force-dynamic';

/**
 * Public preview so the cart can show a discount before checkout. It returns
 * only the amount off — the order endpoint re-checks the code independently,
 * so a forged response here cannot buy anything cheaper.
 */
export async function POST(request: Request) {
  const parsed = await readJson(request, 2 * 1024);
  if (!parsed.ok) return NextResponse.json({ ok: false, reason: parsed.error }, { status: parsed.status });
  const code = typeof parsed.body.code === 'string' ? parsed.body.code : '';
  const subtotal = Math.max(0, Math.round(Number(parsed.body.subtotal) || 0));

  const coupons = await read('coupons');
  const result = checkCoupon(coupons, code, subtotal);

  if (!result.ok) return NextResponse.json({ ok: false, reason: result.reason });
  return NextResponse.json({
    ok: true,
    code: result.coupon.code,
    discount: result.discount,
    description: result.coupon.description,
  });
}
