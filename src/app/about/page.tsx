'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
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
        <div className="bg-navy rounded-2xl p-3">
          <div className="rounded-xl overflow-hidden aspect-[16/9]">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&h=800&fit=crop"
              alt="An artisan at work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>

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

        <Link href="/products" className="inline-block mt-10 btn-primary">
          Shop Our Collections
        </Link>
      </div>
    </div>
  );
}
