'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/lib/toastStore';
import { pressable } from '@/lib/motion';
import RevealText from './RevealText';
import { SectionLabel, DriftMotif, CropMarks } from './Ornaments';

/**
 * Signup block. There's no mailing backend wired up, so this validates the
 * address and acknowledges locally rather than pretending to subscribe.
 */
export default function Newsletter({ heading, body }: { heading?: string; body?: string } = {}) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const showToast = useToast((s) => s.show);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <section className="newsletter-band relative overflow-hidden" aria-labelledby="newsletter-title">
      <DriftMotif kind="flower" className="newsletter-motif-a" />
      <DriftMotif kind="diamond" className="newsletter-motif-b" delay={1.5} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <CropMarks />
        <SectionLabel index="05" className="text-gold justify-center">Stay close to the craft</SectionLabel>

        <RevealText
          as="h2"
          lines={[heading ?? 'A letter from the workshops.']}
          className="font-display text-3xl md:text-4xl text-cream text-center mt-5"
        />
        <p className="text-cream/70 text-center mt-4 max-w-xl mx-auto leading-relaxed">
          {body ?? 'New collections, artisan stories, and the occasional dispatch from the road — once a month, never more.'}
        </p>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.p
              key="done"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gold font-bold text-center mt-8"
            >
              You&rsquo;re on the list. Welcome in. ✦
            </motion.p>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              onSubmit={(e) => {
                e.preventDefault();
                if (!valid) return;
                setDone(true);
                showToast('Subscribed — watch your inbox');
              }}
              className="newsletter-form mt-8"
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="newsletter-input"
              />
              <motion.button
                {...pressable}
                type="submit"
                disabled={!valid}
                data-cursor="Join"
                className="newsletter-submit"
              >
                Join <span aria-hidden="true">→</span>
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
