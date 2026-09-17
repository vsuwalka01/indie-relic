'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * A cursor that trails the pointer and swells into a labelled disc over
 * anything carrying `data-cursor` — so a product tile can say VIEW and a
 * bag button can say ADD, instead of every target feeling identical.
 * Desktop-only: coarse pointers get the native cursor and nothing else.
 */
export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 480, damping: 40, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 480, damping: 40, mass: 0.4 });

  useEffect(() => {
    setFinePointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  const active = finePointer && !reduceMotion;

  useEffect(() => {
    if (!active) return;

    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);

      const target = (e.target as Element | null)?.closest?.('[data-cursor]');
      setLabel(target ? target.getAttribute('data-cursor') : null);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [active, rawX, rawY]);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
    >
      <motion.div
        animate={{
          width: label ? 76 : 14,
          height: label ? 76 : 14,
          backgroundColor: label ? 'rgba(218,172,84,0.95)' : 'rgba(23,43,83,0.85)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy-dark"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
