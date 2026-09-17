'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Hairline bar across the top of the viewport tracking read progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[90] h-[3px] w-full origin-left bg-gradient-to-r from-maroon via-gold to-maroon"
    />
  );
}
