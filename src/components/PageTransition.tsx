'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { EASE, DURATION } from '@/lib/motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const still = mounted && reduceMotion;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={still ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: still ? 0 : DURATION.slow, ease: EASE.out } }}
        exit={{ opacity: 0, y: still ? 0 : -6, transition: { duration: still ? 0 : DURATION.base, ease: EASE.in } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
