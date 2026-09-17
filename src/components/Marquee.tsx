'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface MarqueeProps {
  items: string[];
  /** Seconds for one full pass. Larger = slower. */
  speed?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Endless ribbon of short phrases. The track holds two identical copies and
 * translates by exactly -50%, so the seam lands where the second copy starts
 * and the loop reads as continuous.
 */
export default function Marquee({ items, speed = 28, reverse = false, className = '' }: MarqueeProps) {
  const reduceMotion = useReducedMotion();
  const run = [...items, ...items];

  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <motion.div
        className="marquee-track"
        animate={reduceMotion ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {run.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
            <i className="marquee-dot" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
