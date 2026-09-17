'use client';

import { motion, useReducedMotion, useSpring } from 'framer-motion';
import type { ReactNode } from 'react';

export default function ParallaxScene({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 70, damping: 22 });
  const y = useSpring(0, { stiffness: 70, damping: 22 });
  return <div className={`parallax-scene ${className}`} onPointerMove={e => {
    if (reduced || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.025);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.035);
  }} onPointerLeave={() => { x.set(0); y.set(0); }}>
    <motion.div aria-hidden="true" className="scene-decoration" style={{ x: reduced ? 0 : x, y: reduced ? 0 : y }}><span /><span /><span /></motion.div>
    <div className="relative z-[1]">{children}</div>
  </div>;
}
