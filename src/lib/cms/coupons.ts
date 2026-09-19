export interface Coupon {
  code: string;
  description: string;
  type: 'percent' | 'fixed';
  /** Percent (0–100) or rupees off, depending on `type`. */
  value: number;
  minSubtotal: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

export type CouponCheck =
  | { ok: true; coupon: Coupon; discount: number }
  | { ok: false; reason: string };

/**
 * Single source of truth for whether a code applies, used by both the cart
 * preview and order creation — a client-side-only check would let a customer
 * post an expired code straight to the orders endpoint.
 */
export function checkCoupon(coupons: Coupon[], rawCode: string, subtotal: number): CouponCheck {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, reason: 'Enter a code' };

  const coupon = coupons.find((c) => c.code.toUpperCase() === code);
  if (!coupon) return { ok: false, reason: 'That code doesn’t exist' };
  if (!coupon.active) return { ok: false, reason: 'That code is no longer active' };

  if (coupon.expiresAt) {
    const expiry = new Date(coupon.expiresAt);
    // Treat the expiry date as inclusive — a code "valid to the 30th" should work all day.
    expiry.setHours(23, 59, 59, 999);
    if (Number.isFinite(expiry.getTime()) && expiry.getTime() < Date.now()) {
      return { ok: false, reason: 'That code has expired' };
    }
  }

  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return { ok: false, reason: 'That code has been fully redeemed' };
  }

  if (subtotal < coupon.minSubtotal) {
    return { ok: false, reason: `Spend ₹${coupon.minSubtotal.toLocaleString('en-IN')} to use this code` };
  }

  const raw = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value;
  // Never discount below zero, and never more than the order is worth.
  const discount = Math.max(0, Math.min(Math.round(raw), subtotal));

  return { ok: true, coupon, discount };
}

export const DEFAULT_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    description: '10% off a first order',
    type: 'percent',
    value: 10,
    minSubtotal: 0,
    maxUses: 0,
    usedCount: 0,
    expiresAt: '',
    active: true,
  },
];
