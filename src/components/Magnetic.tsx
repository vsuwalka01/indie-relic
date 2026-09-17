'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  /** How far the element is allowed to drift toward the cursor, in px. */
  strength?: number;
}

/** Pulls its child a little toward the cursor while hovered, then springs back. */
export default function Magnetic({ children, className = '', strength = 14 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });

  useEffect(() => {
    setFinePointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  const active = finePointer && !reduceMotion;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * strength * 2);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * strength * 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
