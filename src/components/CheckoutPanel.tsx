'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cartStore';
import { useToast } from '@/lib/toastStore';
import { pressable } from '@/lib/motion';
import { Chip } from './Ornaments';
import { AddressForm, formatAddress, type AddressDraft } from './AddressBook';
import type { PublicCustomer, SavedAddress } from '@/lib/cms/customers';

const money = (n: number) => `₹ ${n.toLocaleString('en-IN')}`;

/**
 * Order summary, coupon entry and checkout. Totals shown here are a preview —
 * the server recalculates both price and discount when the order is placed.
 */
export default function CheckoutPanel() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const showToast = useToast((s) => s.show);

  const [code, setCode] = useState('');
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const [customer, setCustomer] = useState<PublicCustomer | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [chosenId, setChosenId] = useState('');
  const [addingAddress, setAddingAddress] = useState(false);

  const [open, setOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState<{ number: string; total: number } | null>(null);

  // Guest checkout still needs somewhere to type.
  const [guest, setGuest] = useState({
    name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: '', pincode: '',
  });
  const setGuestField = (patch: Partial<typeof guest>) => setGuest((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/account');
        const json = await res.json();
        if (cancelled) return;
        if (json.customer) {
          setCustomer(json.customer);
          const preferred = json.customer.addresses.find((a: SavedAddress) => a.isDefault) ?? json.customer.addresses[0];
          if (preferred) setChosenId(preferred.id);
        }
      } catch {
        // Not signed in, or offline — fall through to guest checkout.
      } finally {
        if (!cancelled) setLoadingAccount(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const discount = applied?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);
  const chosen = customer?.addresses.find((a) => a.id === chosenId) ?? null;

  const applyCoupon = async () => {
    setCheckingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const json = await res.json();
      if (!json.ok) {
        setApplied(null);
        setCouponError(json.reason || 'That code cannot be used');
        return;
      }
      setApplied({ code: json.code, discount: json.discount });
      showToast(`${json.code} applied — ${money(json.discount)} off`);
    } catch {
      setCouponError('Could not check that code');
    } finally {
      setCheckingCoupon(false);
    }
  };

  const saveAddress = async (draft: AddressDraft, makeDefault: boolean): Promise<string | null> => {
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, isDefault: makeDefault }),
      });
      const json = await res.json();
      if (!res.ok) return json.error || 'Could not save that address';
      setCustomer(json.customer);
      setChosenId(json.address.id);
      setAddingAddress(false);
      showToast('Address saved');
      return null;
    } catch {
      return 'Network error';
    }
  };

  const placeOrder = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setPlacing(true);
    setError('');

    const payload = chosen
      ? {
          customer: { name: chosen.name, email: customer!.email, phone: chosen.phone || customer!.phone },
          shipping: {
            line1: chosen.line1, line2: chosen.line2,
            city: chosen.city, state: chosen.state, pincode: chosen.pincode,
          },
        }
      : {
          customer: { name: guest.name, email: guest.email, phone: guest.phone },
          shipping: {
            line1: guest.line1, line2: guest.line2,
            city: guest.city, state: guest.state, pincode: guest.pincode,
          },
        };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
          couponCode: applied?.code ?? '',
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Could not place the order');
        return;
      }
      setPlaced({ number: json.number, total: json.total });
      clear();
      showToast(`Order ${json.number} placed`);
    } catch {
      setError('Could not place the order: network error');
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="bg-navy text-cream rounded-2xl p-8 h-fit">
        <h2 className="font-display text-2xl font-bold mb-3">Thank you.</h2>
        <p className="text-cream/80 leading-relaxed">
          Your order <strong className="text-gold">{placed.number}</strong> is in. We&rsquo;ve emailed the details, and
          the workshop will be in touch as it&rsquo;s packed.
        </p>
        <p className="text-cream/60 text-sm mt-4">Total paid on delivery: {money(placed.total)}</p>
        {customer && (
          <Link href="/account" className="inline-block mt-5 text-gold font-bold text-sm underline">
            Track it in your account ↗
          </Link>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="craft-checkout-panel bg-navy text-cream rounded-2xl p-8 h-fit">
      <h2 className="font-display text-2xl font-bold mb-6">Summary</h2>

      <div className="flex justify-between text-cream/80 mb-2">
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>

      {applied && (
        <div className="flex justify-between text-gold mb-2">
          <span>{applied.code}</span>
          <span>−{money(discount)}</span>
        </div>
      )}

      <div className="flex justify-between font-bold text-lg border-t border-cream/20 pt-3 mt-3">
        <span>Total</span>
        <span>{money(total)}</span>
      </div>

      <div className="mt-6">
        <label htmlFor="coupon" className="block text-xs uppercase tracking-[0.14em] text-cream/60 mb-2">
          Coupon code
        </label>
        <div className="flex gap-2">
          <input
            id="coupon"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setCouponError(''); }}
            placeholder="WELCOME10"
            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-cream/10 border border-cream/25 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold"
          />
          <motion.button
            {...pressable}
            type="button"
            onClick={applyCoupon}
            disabled={!code || checkingCoupon}
            className="px-4 py-2 rounded-lg bg-cream/15 text-cream font-bold text-sm disabled:opacity-40"
          >
            {checkingCoupon ? '…' : 'Apply'}
          </motion.button>
        </div>
        {couponError && <p className="text-gold text-xs mt-2">{couponError}</p>}
      </div>

      {/* Neither mode="wait" nor an animated height here: the checkout step
          must appear when it's clicked even if animation frames are throttled,
          otherwise the button silently does nothing. */}
      <AnimatePresence initial={false}>
        {!open ? (
          <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.button
              {...pressable}
              onClick={() => setOpen(true)}
              data-cursor="Checkout"
              className="w-full mt-6 py-4 bg-gold text-navy-dark font-bold rounded-lg hover:bg-cream transition-colors"
            >
              PROCEED TO CHECKOUT
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="step" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
            {loadingAccount ? (
              <p className="text-cream/60 text-sm">Checking your account…</p>
            ) : customer ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-cream/60">Deliver to</p>
                  {!addingAddress && (
                    <button onClick={() => setAddingAddress(true)} className="text-gold text-xs font-bold underline">
                      + New address
                    </button>
                  )}
                </div>

                {customer.addresses.length === 0 && !addingAddress && (
                  <p className="text-cream/60 text-sm mb-3">
                    No saved addresses yet — add one and it&rsquo;ll be remembered for next time.
                  </p>
                )}

                <div className="checkout-addr-list">
                  {customer.addresses.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setChosenId(a.id)}
                      className={`checkout-addr ${a.id === chosenId ? 'is-chosen' : ''}`}
                    >
                      <span className="checkout-addr-label">
                        {a.label}
                        {a.isDefault && <i>default</i>}
                      </span>
                      <span className="checkout-addr-name">{a.name}</span>
                      <span className="checkout-addr-body">{formatAddress(a)}</span>
                    </button>
                  ))}
                </div>

                {addingAddress && (
                  <div className="mt-3">
                    <AddressForm
                      dark
                      submitLabel="Save address"
                      initial={{ label: 'Home', name: customer.name, phone: customer.phone, line1: '', line2: '', city: '', state: '', pincode: '' }}
                      onCancel={() => setAddingAddress(false)}
                      onSubmit={saveAddress}
                    />
                  </div>
                )}

                {error && <p className="text-gold text-sm mt-3">{error}</p>}

                <motion.button
                  {...pressable}
                  onClick={() => placeOrder()}
                  disabled={placing || !chosen}
                  className="w-full mt-4 py-4 bg-gold text-navy-dark font-bold rounded-lg hover:bg-cream transition-colors disabled:opacity-50"
                >
                  {placing ? 'Placing order…' : chosen ? `PLACE ORDER · ${money(total)}` : 'CHOOSE AN ADDRESS'}
                </motion.button>
                <p className="text-cream/50 text-xs mt-3 text-center">Cash on delivery. No card details are taken.</p>
              </>
            ) : (
              <form onSubmit={placeOrder}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-cream/60">Where should it go?</p>
                  <Link href="/account" className="text-gold text-xs font-bold underline">Sign in</Link>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input required placeholder="Full name" value={guest.name} onChange={(e) => setGuestField({ name: e.target.value })} className="checkout-input col-span-2" autoComplete="name" />
                  <input required type="email" placeholder="Email" value={guest.email} onChange={(e) => setGuestField({ email: e.target.value })} className="checkout-input col-span-2" autoComplete="email" />
                  <input placeholder="Phone" value={guest.phone} onChange={(e) => setGuestField({ phone: e.target.value })} className="checkout-input col-span-2" autoComplete="tel" />
                  <input required placeholder="Address" value={guest.line1} onChange={(e) => setGuestField({ line1: e.target.value })} className="checkout-input col-span-2" autoComplete="address-line1" />
                  <input placeholder="Apartment, landmark (optional)" value={guest.line2} onChange={(e) => setGuestField({ line2: e.target.value })} className="checkout-input col-span-2" autoComplete="address-line2" />
                  <input required placeholder="City" value={guest.city} onChange={(e) => setGuestField({ city: e.target.value })} className="checkout-input" autoComplete="address-level2" />
                  <input placeholder="State" value={guest.state} onChange={(e) => setGuestField({ state: e.target.value })} className="checkout-input" autoComplete="address-level1" />
                  <input required placeholder="Pincode" value={guest.pincode} onChange={(e) => setGuestField({ pincode: e.target.value })} className="checkout-input col-span-2" autoComplete="postal-code" />
                </div>

                {error && <p className="text-gold text-sm mt-3">{error}</p>}

                <motion.button
                  {...pressable}
                  type="submit"
                  disabled={placing}
                  className="w-full mt-4 py-4 bg-gold text-navy-dark font-bold rounded-lg hover:bg-cream transition-colors disabled:opacity-50"
                >
                  {placing ? 'Placing order…' : `PLACE ORDER · ${money(total)}`}
                </motion.button>
                <p className="text-cream/50 text-xs mt-3 text-center">Cash on delivery. No card details are taken.</p>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2 mt-5">
        <Chip tone="gold">Secure checkout</Chip>
        <Chip tone="gold">7-day returns</Chip>
      </div>
    </motion.div>
  );
}
