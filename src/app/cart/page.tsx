'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/lib/cartStore';
import { useToast } from '@/lib/toastStore';
import { slideUp, stagger, pressable } from '@/lib/motion';
import Marquee from '@/components/Marquee';
import { SectionLabel, StitchDivider, DriftMotif, Chip } from '@/components/Ornaments';

export default function CartPage() {
  const { items, remove, setQty, subtotal } = useCart();
  const showToast = useToast((s) => s.show);

  // avoid hydration mismatch between the server render (always empty) and
  // whatever the persisted store actually holds on the client
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <DriftMotif kind="diamond" className="w-14 h-14 right-0 top-12 text-gold hidden md:block" />
        <SectionLabel index="01" className="text-maroon mb-4">Ready when you are</SectionLabel>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-navy-dark mb-3">
          Your Bag
        </h1>
        {hydrated && items.length > 0 && (
          <Chip tone="navy" className="mb-8">{items.length} {items.length === 1 ? 'piece' : 'pieces'}</Chip>
        )}
        <StitchDivider className="text-navy mb-10" />

        {!hydrated ? null : items.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp}
            className="text-center py-20"
          >
            <p className="text-navy-dark/60 text-lg mb-8">Your bag is empty.</p>
            <Link href="/products">
              <motion.span {...pressable} className="inline-block btn-primary">
                Browse Products
              </motion.span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <motion.div
              className="lg:col-span-2 space-y-4"
              initial="hidden"
              animate="visible"
              variants={stagger()}
            >
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={slideUp}
                    exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                    className="flex gap-4 bg-white rounded-2xl p-4 items-center"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-navy-dark truncate">{item.name}</p>
                      <p className="text-navy-dark/50 text-sm">Craft: {item.craft}</p>
                      <p className="text-navy-dark font-semibold mt-1">
                        ₹ {item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center border border-navy-dark/20 rounded-lg overflow-hidden flex-shrink-0">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="px-3 py-2 hover:bg-cream transition-colors"
                      >
                        <Minus size={14} />
                      </motion.button>
                      <span className="px-3 font-bold w-8 text-center">{item.qty}</span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="px-3 py-2 hover:bg-cream transition-colors"
                      >
                        <Plus size={14} />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        remove(item.id);
                        showToast(`Removed ${item.name}`);
                      }}
                      className="text-navy-dark/40 hover:text-maroon transition-colors flex-shrink-0"
                    >
                      <X size={20} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp}
              className="bg-navy text-cream rounded-2xl p-8 h-fit"
            >
              <h2 className="font-display text-2xl font-bold mb-6">Summary</h2>
              <div className="flex justify-between text-cream/80 mb-2">
                <span>Subtotal</span>
                <span>₹ {subtotal().toLocaleString('en-IN')}</span>
              </div>
              <p className="text-cream/50 text-xs mb-6">Shipping & taxes calculated at checkout</p>
              <motion.button
                {...pressable}
                onClick={() => showToast('Checkout is coming soon')}
                className="w-full py-4 bg-gold text-navy-dark font-bold rounded-lg hover:bg-cream transition-colors"
              >
                PROCEED TO CHECKOUT
              </motion.button>
              <div className="flex flex-wrap gap-2 mt-5">
                <Chip tone="gold">Secure checkout</Chip>
                <Chip tone="gold">7-day returns</Chip>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <div className="bg-navy text-gold py-3 border-y border-gold/25">
        <Marquee items={['Free shipping over ₹2,000', 'Packed by hand', 'Artisan-signed piece', '7-day returns']} speed={30} />
      </div>
    </div>
  );
}
