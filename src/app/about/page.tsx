'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Marquee from '@/components/Marquee';
import CountUp from '@/components/CountUp';
import Newsletter from '@/components/Newsletter';
import RevealText from '@/components/RevealText';
import Magnetic from '@/components/Magnetic';
import { SectionLabel, StitchDivider, DriftMotif, Chip, CropMarks } from '@/components/Ornaments';

const ABOUT_STATS = [
  { value: 15, suffix: ' days', label: 'Lived in each cluster' },
  { value: 31, suffix: '', label: 'States documented' },
  { value: 240, suffix: '+', label: 'Artisan partners' },
  { value: 0, suffix: '%', label: 'Middlemen' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 text-center relative">
        <DriftMotif kind="flower" className="w-16 h-16 left-0 top-10 text-gold hidden md:block" />
        <DriftMotif kind="diamond" className="w-14 h-14 right-0 top-16 text-maroon hidden md:block" delay={1.2} />
        <SectionLabel index="00" className="text-maroon justify-center mb-6">Our story</SectionLabel>
        <RevealText
          as="h1"
          lines={['We design relics', 'for the future.']}
          className="font-display text-4xl md:text-6xl text-navy-dark leading-[1.1] mb-8"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-lg md:text-xl text-navy-dark leading-relaxed"
        >
          Every craft in India carries the heartbeat of our culture, our traditions, and our soil. For generations,
          these stories were not merely told—they were woven into handlooms, carved into hardwood, molded in clay,
          and hammered into brass.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-navy rounded-2xl p-3 relative">
          <CropMarks className="text-gold -m-3" />
          <div className="rounded-xl overflow-hidden aspect-[16/9]">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&h=800&fit=crop"
              alt="An artisan at work"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute left-6 bottom-6 flex flex-wrap gap-2">
            <Chip tone="gold">In the cluster</Chip>
            <Chip tone="gold">Chittorgarh, Rajasthan</Chip>
          </div>
        </div>
      </motion.div>

      <div className="bg-navy text-gold py-3 mt-12 border-y border-gold/25">
        <Marquee items={['Sit beside the master', 'Learn the tools', 'Document the story', 'Share the livelihood']} speed={30} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-navy-dark/80 leading-relaxed"
        >
          Yet, across our cities and modern living rooms, those ancient rhythms are falling quiet. Our ancestral
          heritage is fading from daily life, riskily close to becoming something our children only encounter behind
          glass cases in museums.
        </motion.p>
      </div>

      <div className="bg-navy text-cream py-16 mt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="leading-relaxed"
          >
            INDIE RELIC was born out of a refusal to let these legacies turn into silent memory.
            We believe that preservation cannot happen through nostalgia alone; it happens through evolution.
            To make heritage timeless, we must make it relevant.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="leading-relaxed"
          >
            We immerse ourselves directly into the living spaces of Indian artisans, spending 15 days in a single
            craft cluster at a time. We sit beside the masters, learning the raw geometry of their tools,
            understanding the spirit behind their techniques, and documenting the untold stories of the people
            whose hands shape India&rsquo;s cultural identity.
          </motion.p>
        </div>
      </div>

      {/* How we work, in numbers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14" aria-label="How we work, in numbers">
        <SectionLabel index="02" className="text-maroon mb-8">How we work</SectionLabel>
        <div className="stat-grid text-navy-dark">
          {ABOUT_STATS.map((stat, i) => (
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
        <StitchDivider className="text-navy mt-12" />
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-xl md:text-2xl text-navy-dark leading-relaxed"
        >
          Every piece from INDIE RELIC is more than a product—it is a bridge. It connects the quiet mastery of an
          artisan&rsquo;s workshop to a modern space, generating sustainable livelihoods, dignity, and economic
          incentive for the next generation of craftspeople to keep their heritage alive.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-xl md:text-2xl font-bold text-navy-dark mt-4"
        >
          We do not just preserve relics of the past. We design them for the future.
        </motion.p>

        <Magnetic className="inline-block mt-10">
          <Link href="/products" data-cursor="Shop" className="inline-block btn-primary">
            Shop Our Collections
          </Link>
        </Magnetic>
      </div>

      <Newsletter />
    </div>
  );
}
