'use client';
import ProductImage from '@/components/ProductImage';
import ProductCard from '@/components/ProductCard';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { type Product } from '@/lib/products';
import UiIconSvg from '@/components/UiIconSvg';
import { arrowRightIcon } from '@/components/uiIconPaths';
import StarRating from '@/components/StarRating';
import { useCart } from '@/lib/cartStore';
import { useToast } from '@/lib/toastStore';
import { pressable } from '@/lib/motion';
import Marquee from '@/components/Marquee';
import { SectionLabel, StitchDivider, DriftMotif, Chip } from '@/components/Ornaments';

const ratingBreakdown = [
  { stars: 5, count: 1985 },
  { stars: 4, count: 0 },
  { stars: 3, count: 0 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

const reviews = [
  { name: 'Ananya S.', date: 'Aug 2026', review: 'Absolutely beautiful craftsmanship. The panels tell the story so vividly.' },
  { name: 'Rohan M.', date: 'Jul 2026', review: 'Even better in person. Packaging was excellent too.' },
  { name: 'Priya K.', date: 'Jul 2026', review: 'Loved the artisan story card that came with it.' },
  { name: 'Devansh T.', date: 'Jun 2026', review: 'A conversation starter every time guests visit.' },
];

const accordions = [
  { key: 'description', label: 'DESCRIPTION' },
  { key: 'details', label: 'PRODUCT DETAILS' },
  { key: 'shipping', label: 'SHIPPING DETAILS' },
  { key: 'aboutCraft', label: 'ABOUT CRAFT' },
] as const;

export default function ProductDetailClient({ product, products }: { product: Product; products: Product[] }) {
  const router = useRouter();
  const purchaseRef = useRef<HTMLButtonElement>(null);
  const purchaseVisible = useInView(purchaseRef, { amount: 1 });
  const gallery = product.gallery.length ? product.gallery : [product.image];

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');

  const cartAdd = useCart((s) => s.add);
  const showToast = useToast((s) => s.show);

  const handleAddToCart = () => {
    cartAdd(
      { id: product.id, name: product.name, price: product.price, image: product.image, craft: product.craft },
      qty,
    );
    showToast(`Added ${product.name} to bag`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };


  const more = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="product-detail-page min-h-screen bg-cream">
      {/* Gallery + Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="detail-gallery">
          <div className="detail-thumbnails">
            {gallery.map((img, i) => (
              <button
                key={i}
                aria-label={`View product photo ${i + 1}`} aria-pressed={activeImage === i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-navy' : 'border-transparent'}`}
              >
                <ProductImage src={img} alt="" sizes="80px" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="detail-main-photo relative aspect-square rounded-2xl overflow-hidden bg-white"
          >
            <ProductImage src={gallery[activeImage] ?? product.image} alt={product.name} loading="eager" fetchPriority="high" sizes="(max-width: 1023px) 75vw, 560px" className="w-full h-full object-cover" />
            <span className="product-craft-label">{product.craft}</span>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <SectionLabel index="01" className="text-maroon mb-4">{product.craft}</SectionLabel>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy-dark">{product.name}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            <Chip tone="gold">Handmade</Chip>
            <Chip tone="navy">Artisan-made</Chip>
            <Chip tone="maroon">Limited run</Chip>
          </div>
          <p className="text-navy-dark/60 mt-3">{product.intro}</p>

          <div className="detail-purchase mt-6">
            <p className="font-display text-2xl font-bold text-navy-dark">₹ {product.price.toLocaleString('en-IN')}</p>
            <p className="text-navy-dark/50 text-sm">Inclusive of all taxes</p>

            <div className="detail-purchase-actions">
              <div className="flex items-center border border-navy-dark/30 rounded-lg overflow-hidden">
                <motion.button whileTap={{ scale: 0.9 }} aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-cream transition-colors"><Minus size={16} /></motion.button>
                <span className="px-4 font-bold w-10 text-center">{qty}</span>
                <motion.button whileTap={{ scale: 0.9 }} aria-label="Increase quantity" onClick={() => setQty(qty + 1)} className="px-4 py-3 hover:bg-cream transition-colors"><Plus size={16} /></motion.button>
              </div>
              <motion.button
                {...pressable}
                ref={purchaseRef} aria-label="Add this product to cart" onClick={handleAddToCart}
                className="flex-1 bg-navy text-cream font-bold rounded-lg hover:bg-navy-dark transition-colors py-3 px-6"
              >
                ADD TO CART
              </motion.button>
            </div>
          </div>
          <div className="mt-8">
            <p className="font-bold text-navy-dark">About craft:</p>
            <p className="text-navy-dark/80 mt-1 leading-relaxed">{product.aboutCraft}</p>
          </div>

          <div className="mt-6">
            <p className="font-bold text-navy-dark">Idea behind product:</p>
            <p className="text-navy-dark/80 mt-1 leading-relaxed">{product.ideaBehind}</p>
          </div>

        </motion.div>
      </div>

      {/* Craft promise ribbon */}
      <div className="bg-navy text-gold py-3 mt-14 border-y border-gold/25">
        <Marquee items={['Free shipping over ₹2,000', '7-day returns', 'Ships in 3–5 days', 'Artisan-signed piece']} speed={30} />
      </div>

      {/* Sticky bar + accordions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-navy text-cream rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-white flex-shrink-0">
              <ProductImage src={product.image} alt="" sizes="56px" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold">{product.name}</p>
              <p className="text-cream/80 text-sm">₹ {product.price.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <motion.button
              {...pressable}
              onClick={handleAddToCart}
              className="flex-1 sm:flex-none px-6 py-3 bg-cream text-navy-dark font-bold rounded-lg hover:bg-gold transition-colors"
            >
              ADD TO CART
            </motion.button>
            <motion.button
              {...pressable}
              onClick={handleBuyNow}
              className="flex-1 sm:flex-none px-6 py-3 bg-cream text-navy-dark font-bold rounded-lg hover:bg-gold transition-colors"
            >
              BUY NOW
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-3">
            {accordions.map(({ key, label }) => (
              <div key={key} className="bg-navy text-cream rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === key ? null : key)}
                  className="w-full flex justify-between items-center px-6 py-4 font-bold text-sm tracking-wide"
                >
                  {label}
                  <span className={`inline-block transition-transform ${openAccordion === key ? 'rotate-90' : ''}`}>
                    <UiIconSvg icon={arrowRightIcon} size={14} />
                  </span>
                </button>
                <AnimatePresence>
                  {openAccordion === key && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-cream/85 text-sm leading-relaxed">{product[key]}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-white">
            <ProductImage src={gallery[Math.min(1, gallery.length - 1)]} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* See the size in your space */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <SectionLabel index="02" className="text-maroon mb-3">Scale &amp; proportion</SectionLabel>
        <h2 className="section-display text-navy-dark mb-8">See the Size in Your Space</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-8 flex items-center justify-center text-center text-navy-dark/50 aspect-square">
            Product flat sketch with measurements
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            {gallery.slice(0, 4).map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white aspect-square">
                <ProductImage src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <SectionLabel index="03" className="text-maroon mb-5">What people say</SectionLabel>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-6">
            <p className="font-display text-5xl font-bold text-navy-dark">5</p>
            <div>
              <StarRating size={18} />
              <p className="text-navy-dark/60 text-sm">1985 reviews</p>
            </div>
          </div>
          <div className="flex-1 max-w-md w-full space-y-1">
            {ratingBreakdown.map((r) => (
              <div key={r.stars} className="flex items-center gap-3 text-sm">
                <span className="w-4 text-navy-dark/70">{r.stars}</span>
                <div className="flex-1 h-2 bg-navy/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-navy rounded-full"
                    style={{ width: `${(r.count / 1985) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-navy-dark/70">{r.count}</span>
              </div>
            ))}
          </div>
          <motion.button
            {...pressable}
            className="px-8 py-3 bg-navy text-cream font-bold rounded-lg hover:bg-navy-dark transition-colors whitespace-nowrap"
          >
            WRITE
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-navy text-cream rounded-lg p-5"
            >
              <p className="font-bold">{r.name}</p>
              <p className="text-cream/60 text-xs mb-2">{r.date}</p>
              <StarRating size={14} className="mb-2" />
              <p className="text-cream/85 text-sm leading-relaxed">{r.review}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* More products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pb-20 relative">
        <StitchDivider className="text-navy mb-12" />
        <DriftMotif kind="diamond" className="w-14 h-14 right-0 top-14 text-gold hidden lg:block" />
        <SectionLabel index="04" className="text-maroon mb-3 justify-center w-full">Keep exploring</SectionLabel>
        <h2 className="section-display text-navy-dark text-center mb-10">More Products</h2>
        <div className="catalog-grid">{more.map(item => <ProductCard key={item.id} product={item} />)}</div>
      </div>
      {!purchaseVisible && <div className="mobile-product-purchase"><div><span>{product.name}</span><strong>₹{product.price.toLocaleString('en-IN')}</strong></div><button type="button" onClick={handleAddToCart}>Add to cart <span aria-hidden="true">+</span></button></div>}
    </div>
  );
}
