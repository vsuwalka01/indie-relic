'use client';

import { useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { products } from '@/lib/products';
import { slugifyState } from '@/lib/stateCrafts';
import BrandScene, { BrandMotif } from '@/components/BrandScene';
import IndiaMap from '@/components/IndiaMap';
import DiamondCross from '@/components/DiamondCross';
import UiIconSvg from '@/components/UiIconSvg';
import { arrowLeftIcon, arrowRightIcon, dottedPlusIcon } from '@/components/uiIconPaths';
import StarRating from '@/components/StarRating';
import { useCart } from '@/lib/cartStore';
import { useToast } from '@/lib/toastStore';
import TiltCard from '@/components/TiltCard';
import RevealText from '@/components/RevealText';
import Magnetic from '@/components/Magnetic';
import Marquee from '@/components/Marquee';
import CountUp from '@/components/CountUp';
import Newsletter from '@/components/Newsletter';
import { SectionLabel, StitchDivider, DriftMotif, Chip, CropMarks } from '@/components/Ornaments';

const STATS = [
  { value: 31, suffix: '', label: 'States mapped' },
  { value: 240, suffix: '+', label: 'Artisan partners' },
  { value: 12, suffix: '', label: 'Living crafts' },
  { value: 400, suffix: ' yrs', label: 'Oldest tradition' },
];

const MARQUEE_ITEMS = [
  'Handmade in India',
  '31 states, one atlas',
  'Artisan-owned workshops',
  'Fair wages, always',
  'Made to be cherished',
];

const testimonials = [
  { name: "Ananya S.", review: "The Kavad box I ordered arrived beautifully packaged, and the craftsmanship blew me away." },
  { name: "Rohan M.", review: "Finally a brand that treats Indian crafts as design, not curio. My living room centerpiece now." },
  { name: "Priya K.", review: "Loved reading the artisan's story that came with the piece. It changed how I see the object." },
  { name: "Devansh T.", review: "Fast shipping, gorgeous packaging, and the Bidriware vase is even better in person." },
  { name: "Meera J.", review: "Gifted this to my parents and they haven't stopped talking about the craftsmanship since." },
];

export default function Home() {
  const router = useRouter();
  const [paused, setPaused] = useState(false);
  const [productStart, setProductStart] = useState(0);
  const featuredProducts = [0, 1, 2].map(offset => products[(productStart + offset) % products.length]);
  const cartAdd = useCart((s) => s.add);
  const showToast = useToast((s) => s.show);
  return (
    <MotionConfig reducedMotion={paused ? 'always' : 'user'}><div className={`home-page bg-cream ${paused ? 'home-motion-paused' : ''}`}>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="home-hero relative bg-navy rounded-[2.5rem] overflow-hidden min-h-[520px] flex flex-col md:flex-row items-center">
          {/* decorative checkered corners */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 grid grid-cols-2 grid-rows-2 opacity-90">
            <div className="bg-navy-dark" /><div className="bg-cream" /><div className="bg-cream" /><div className="bg-navy-dark" />
          </div>

          <BrandScene paused={paused} />

          <div className="relative z-10 px-6 md:px-8 py-10 text-cream max-w-xl">
            <p className="eyebrow text-gold mb-5">Living traditions. Everyday objects.</p>
            <RevealText
              as="h1"
              lines={['Indian Traditions,', 'Reimagined for Everyday Living']}
              delay={0.25}
              className="font-body font-extrabold text-2xl md:text-4xl leading-tight uppercase tracking-wide"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-5 text-cream/85 leading-relaxed"
            >
              Indie Relic bridges the gap between traditional Indian artistry and contemporary lifestyle needs.
              We collaborate closely with local artisans to adapt timeless techniques into modern collections
              — ensuring our rich heritage stays alive, functional, and cherished in everyday spaces.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8">
              <div className="flex flex-wrap items-center gap-6"><Magnetic><Link href="/products" className="home-shop-link">Explore the collection <span aria-hidden="true">↗</span></Link></Magnetic>
              <Link href="/about" className="home-text-link">Our story <span aria-hidden="true">→</span></Link></div>
            </motion.div>
          </div>
          <BrandMotif kind="checker" className="hero-corner-mark" />
        </div>
        <div className="home-ribbon"><span>Thoughtfully reimagined</span><BrandMotif className="w-6 h-6 text-maroon" /><span>Rooted in craft</span><BrandMotif className="w-6 h-6 text-maroon" /><span>Made to be cherished</span>
          <button type="button" className="motion-toggle" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Play' : 'Pause'} decorative motion <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>
        </div>
      </section>

      {/* Craft promise ribbon */}
      <div className="bg-navy text-gold py-3 border-y border-gold/25">
        <Marquee items={MARQUEE_ITEMS} speed={32} />
      </div>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <DriftMotif kind="diamond" className="w-16 h-16 right-2 top-4 text-gold hidden lg:block" />
        <div className="home-section-heading"><div><SectionLabel index="01" className="text-maroon mb-3">Objects with a story</SectionLabel><RevealText lines={['Tradition, brought home.']} className="font-display text-3xl md:text-4xl text-navy-dark" /></div><Link href="/products" className="home-text-link text-maroon">View all pieces <span aria-hidden="true">↗</span></Link></div>
        <div className="flex items-center gap-6 md:gap-10">
          <button aria-label="Previous featured products" onClick={() => setProductStart(i => (i - 3 + products.length) % products.length)} className="hidden md:flex home-carousel-button text-navy hover:text-maroon transition-colors flex-shrink-0">
            <UiIconSvg icon={arrowLeftIcon} size={36} />
          </button>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 flex-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              >
                <TiltCard maxTilt={paused ? 0 : 5} disabled={paused}><div className="group rounded-3xl overflow-hidden border-2 border-navy block bg-cream">
                  <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`} data-cursor="View" className="block relative aspect-[4/5] bg-white overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="product-craft-label">{product.craft}</span>
                  </Link>
                  <div className="bg-navy text-cream p-5 flex justify-between items-start">
                    <div>
                      <Link href={`/products/${product.id}`} className="font-bold text-sm uppercase hover:underline">{product.name}</Link>
                      <p className="text-cream/80 text-sm mt-1">Craft: {product.craft}</p>
                      <p className="text-cream/80 text-sm">₹ {product.price.toLocaleString('en-IN')}</p>
                    </div>
                    <motion.button
                      aria-label={`Add ${product.name} to bag`}
                      data-cursor="Add"
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        cartAdd({ id: product.id, name: product.name, price: product.price, image: product.image, craft: product.craft });
                        showToast(`Added ${product.name} to bag`);
                      }}
                      className="text-cream flex-shrink-0 mt-1"
                    >
                      <UiIconSvg icon={dottedPlusIcon} size={28} />
                    </motion.button>
                  </div>
                </div></TiltCard>
              </motion.div>
            ))}
          </motion.div>

          <button aria-label="Next featured products" onClick={() => setProductStart(i => (i + 3) % products.length)} className="hidden md:flex home-carousel-button text-navy hover:text-maroon transition-colors flex-shrink-0">
            <UiIconSvg icon={arrowRightIcon} size={36} />
          </button>
        </div>
        <div className="flex justify-center gap-3 mt-7" aria-label="Featured product groups">{[0,3,6].map(start => <button key={start} aria-label={`Show featured products from ${start + 1}`} aria-pressed={productStart === start} onClick={() => setProductStart(start)} className="product-page-dot"><span className={productStart === start ? 'bg-maroon' : 'bg-navy/25'} /></button>)}</div>
      </section>

      {/* Craft Story Spotlight */}
      <section className="home-craft-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="home-stitch-border" aria-hidden="true" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center home-map-frame"
          >
            <IndiaMap
              className="w-full max-w-sm"
              pins={['Rajasthan']}
              activePin="Rajasthan"
              onStateClick={(state) => router.push(`/craft-map/${slugifyState(state)}`)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <SectionLabel index="02" className="text-maroon mb-4">A journey through the craft atlas</SectionLabel>
            <h3 className="font-display text-4xl font-bold text-navy-dark mb-10 relative z-10">Rajasthan</h3>
            <div className="relative">
              <CropMarks className="text-navy-dark -m-4" />
              <DiamondCross className="absolute -top-9 left-2 w-16 h-16 z-10" />
              <div className="bg-gold rounded-3xl p-10 pt-8">
                <div className="flex flex-wrap gap-2 mb-5">
                  <Chip tone="navy">Chittorgarh</Chip>
                  <Chip tone="maroon">400 yrs alive</Chip>
                  <Chip tone="navy">Wood &amp; pigment</Chip>
                </div>
                <div className="space-y-3 text-navy-dark font-semibold">
                  <p>Region: Chittorgarh</p>
                  <p>Craft: KAVAD</p>
                  <p>Alive from 400 yrs</p>
                </div>
                <p className="mt-5 text-navy-dark/85 leading-relaxed">A painted door opens. Then another. Discover the stories held inside the Kavad of Chittorgarh.</p>
                <Link href="/craft-map/rajasthan" className="home-text-link inline-flex mt-8 text-navy-dark">
                  Unfold the story <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
            <Link href="/craft-map" className="home-text-link text-maroon mt-7">Explore every state <span aria-hidden="true">→</span></Link>
          </motion.div>
        </div>
      </section>

      {/* Numbers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative" aria-label="Indie Relic in numbers">
        <StitchDivider className="text-navy mb-10" />
        <SectionLabel index="03" className="text-maroon mb-8">Where we&rsquo;ve been</SectionLabel>
        <div className="stat-grid text-navy-dark">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="stat-cell"
            >
              <CountUp to={stat.value} suffix={stat.suffix} className="stat-value font-display" />
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
        <StitchDivider className="text-navy mt-10" />
      </section>

      <section className="home-values max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-label="Our approach">
        {([
          ['diamond', 'A living heritage', 'Traditional techniques, carried forward into objects for everyday life.'],
          ['flower', 'A human touch', 'Small variations tell the story of the hands behind each piece.'],
          ['checker', 'A place in your home', 'Thoughtful forms that bring craft into the way we live today.'],
        ] as const).map(([kind,title,copy], i) => <motion.div key={title} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}} className="home-value-card"><BrandMotif kind={kind} className="value-motif" /><h2 className="font-display text-xl text-navy-dark mt-5 mb-3">{title}</h2><p className="text-sm leading-relaxed text-navy-dark/75">{copy}</p></motion.div>)}
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="home-section-heading"><div><SectionLabel index="04" className="text-maroon mb-3">A little love, from your homes</SectionLabel><RevealText lines={['Objects become memories.']} className="font-display text-3xl md:text-4xl text-navy-dark" /></div><BrandMotif kind="flower" className="w-16 h-16 text-maroon hidden sm:block" /></div>
        <div className="flex items-center gap-4 md:gap-8">

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 flex-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="home-quote-card rounded-3xl overflow-hidden flex flex-col"
              >
                <div className="home-quote-mark" aria-hidden="true">“</div>
                <div className="flex justify-start py-3 text-maroon">
                  <StarRating size={16} />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-navy-dark text-sm leading-relaxed flex-1">{t.review}</p>
                  <p className="font-bold text-maroon text-xs mt-6">{t.name}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      <Newsletter />
    </div></MotionConfig>
  );
}
