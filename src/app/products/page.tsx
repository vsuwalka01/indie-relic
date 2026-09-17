'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { products } from '@/lib/products';
import UiIconSvg from '@/components/UiIconSvg';
import { smallArrowRightIcon, dottedPlusIcon } from '@/components/uiIconPaths';
import { useCart } from '@/lib/cartStore';
import { useToast } from '@/lib/toastStore';
import { pressable } from '@/lib/motion';
import TiltCard from '@/components/TiltCard';
import RevealText from '@/components/RevealText';
import Marquee from '@/components/Marquee';
import Newsletter from '@/components/Newsletter';
import { SectionLabel, StitchDivider, DriftMotif, Chip } from '@/components/Ornaments';

const CRAFT_ICONS = ['◆', '✦', '❖', '✚', '❋'];

const sortOptions = ['Featured', 'Most relevant', 'Best selling', 'Alphabetically, A-Z', 'Alphabetically, Z-A', 'Price, low to high', 'Price, high to low', 'Date, old to new', 'Date, new to old'];

export default function ProductsPage() {
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const cartAdd = useCart((s) => s.add);
  const showToast = useToast((s) => s.show);

  const sorted = useMemo(() => {
    const list = [...products];
    if (sortBy === 'Price, low to high') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price, high to low') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'Alphabetically, A-Z') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'Alphabetically, Z-A') list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-navy rounded-[2.5rem] h-64 md:h-72 flex items-center justify-center overflow-hidden"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-gold/70 select-none"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                fontSize: `${8 + (i % 3) * 4}px`,
              }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.1 }}
            >
              {CRAFT_ICONS[i % CRAFT_ICONS.length]}
            </motion.span>
          ))}
          <RevealText
            as="h1"
            lines={['ALL PRODUCTS']}
            delay={0.15}
            className="relative z-10 text-cream font-body font-extrabold text-4xl md:text-6xl tracking-wide"
          />
        </motion.div>
      </div>

      {/* Craft ribbon */}
      <div className="bg-navy text-gold py-3 mt-6 border-y border-gold/25">
        <Marquee items={['Kavad', 'Bidriware', 'Pattachitra', 'Blue pottery', 'Dhokra', 'Warli', 'Channapatna', 'Madhubani']} speed={26} reverse />
      </div>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-8">
        <div className="flex items-center gap-3">
          <p className="text-maroon font-bold">{sorted.length} PRODUCTS</p>
          <Chip tone="gold">In stock</Chip>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1 text-maroon font-bold"
            >
              SORT BY <ChevronDown size={16} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-lg py-2 z-20"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setSortOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-cream transition-colors ${sortBy === opt ? 'text-navy font-bold' : 'text-gray-500'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFilterOpen(true)} className="text-maroon font-bold">
            FILTER
          </motion.button>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative">
        <DriftMotif kind="flower" className="w-20 h-20 -right-2 -top-6 text-gold hidden lg:block" />
        <SectionLabel index="01" className="text-maroon mb-6">The full collection</SectionLabel>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {sorted.map((product) => (
            <motion.div
              key={product.id}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
            >
              <TiltCard className="[perspective:800px]">
                <Link href={`/products/${product.id}`} data-cursor="View" className="group cursor-pointer block">
                  <div className="relative h-72 bg-white overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="product-craft-label">{product.craft}</span>
                    <div className="absolute inset-y-0 right-3 flex items-center text-navy-dark">
                      <UiIconSvg icon={smallArrowRightIcon} size={17} />
                    </div>
                  </div>
                  <div className="bg-navy text-cream p-5 flex justify-between items-start rounded-b-lg">
                    <div>
                      <p className="font-bold text-sm uppercase">{product.name}</p>
                      <p className="text-cream/80 text-sm mt-1">₹ {product.price.toLocaleString('en-IN')}</p>
                    </div>
                    <motion.button
                      data-cursor="Add"
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        cartAdd({ id: product.id, name: product.name, price: product.price, image: product.image, craft: product.craft });
                        showToast(`Added ${product.name} to bag`);
                      }}
                      className="flex-shrink-0"
                    >
                      <UiIconSvg icon={dottedPlusIcon} size={28} />
                    </motion.button>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
        <StitchDivider className="text-navy mt-16" />
      </div>

      <Newsletter />

      {/* Filter drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-navy text-cream z-50 p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-display text-2xl font-bold">FILTERS</h3>
                <button onClick={() => setFilterOpen(false)}><X size={24} /></button>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-sm">Availability</span>
                <button className="text-sm underline text-cream/70" onClick={() => setInStockOnly(false)}>Reset all</button>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors ${inStockOnly ? 'bg-gold justify-end' : 'bg-cream justify-start'}`}
              >
                <motion.div layout transition={{ duration: 0.2, ease: 'easeOut' }} className="w-6 h-6 rounded-full bg-navy-dark" />
              </motion.button>

              <div className="absolute bottom-8 left-8 right-8">
                <motion.button
                  {...pressable}
                  onClick={() => setFilterOpen(false)}
                  className="w-full py-4 bg-cream text-navy-dark font-bold rounded-full hover:bg-gold transition-colors"
                >
                  VIEW RESULTS
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
