'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import BirdMark from './BirdMark';

export function BrandMotif({ kind = 'diamond', className = '' }: { kind?: 'diamond' | 'checker' | 'flower'; className?: string }) {
  return <svg viewBox="0 0 80 80" className={className} aria-hidden="true" fill="currentColor">
    {kind === 'diamond' && <><path d="M40 3 77 40 40 77 3 40Z" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M34 18H46V34H62V46H46V62H34V46H18V34H34Z" /></>}
    {kind === 'checker' && <>{Array.from({length: 16}, (_, i) => (Math.floor(i / 4) + i % 4) % 2 === 0 && <rect key={i} x={i % 4 * 20} y={Math.floor(i / 4) * 20} width="20" height="20" />)}</>}
    {kind === 'flower' && <><path d="M40 40C-4 34 9 -5 40 20C71 -5 84 34 40 40C84 46 71 85 40 60C9 85 -4 46 40 40Z" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M40 29 51 40 40 51 29 40Z" /></>}
  </svg>;
}

export default function BrandScene({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 65, damping: 22 });
  const y = useSpring(0, { stiffness: 65, damping: 22 });
  const still = paused || reduced;
  return <div ref={ref} className="brand-scene" data-active={visible && !still} onPointerMove={e => {
    if (still || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * .045);
    y.set((e.clientY - rect.top - rect.height / 2) * .045);
  }} onPointerLeave={() => { x.set(0); y.set(0); }}>
    <div className="brand-arch"><div className="brand-arch-line" /><BirdMark className="static-hero-bird" /></div>
    <motion.div className="brand-scene-ornaments" style={{ x: still ? 0 : x, y: still ? 0 : y }} aria-hidden="true">
      <BrandMotif className="brand-ornament ornament-one" />
      <BrandMotif kind="checker" className="brand-ornament ornament-two" />
      <BrandMotif kind="flower" className="brand-ornament ornament-three" />
      <span className="ornament-dot" />
    </motion.div>
    <span className="brand-scene-label">Rooted in India. Made for today.</span>
  </div>;
}
