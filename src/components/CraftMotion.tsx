'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BrandMotif } from './BrandScene';

/** Large, readable motion made from the brand's own geometry. */
export function HeroMotion({ paused = false }: { paused?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return <div ref={ref} className="hero-motion" data-running={visible && !paused} aria-hidden="true">
    <div className="motion-orbit orbit-outer"><span /><span /><span /></div>
    <div className="motion-orbit orbit-inner"><BrandMotif kind="flower" /><BrandMotif kind="diamond" /></div>
    <svg className="motion-thread" viewBox="0 0 1200 760" preserveAspectRatio="none"><path d="M-80 620C190 820 40 30 330 90S410 830 750 650 960 220 1300 350" /></svg>
    <div className="motion-checker checker-top" /><div className="motion-checker checker-bottom" />
    <span className="motion-sun"><BrandMotif kind="flower" /></span>
  </div>;
}

export function CraftInterlude({ paused = false }: { paused?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const left = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const right = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);
  const still = paused || reduced;
  return <section ref={ref} className="craft-interlude" data-running={visible && !still} aria-label="Made by hand. Moved by stories.">
    <p className="eyebrow">Every piece carries a little India</p>
    <div className="interlude-type" aria-hidden="true">
      <motion.div style={{ x: still ? 0 : left }}><span>Made by hand.</span><BrandMotif kind="flower" /></motion.div>
      <motion.div style={{ x: still ? 0 : right }}><BrandMotif kind="diamond" /><span>Moved by stories.</span></motion.div>
    </div>
    <div className="interlude-stitch" aria-hidden="true" />
    <p className="interlude-note">Traditions in motion. Treasures for everyday.</p>
  </section>;
}

/** Eight reusable stamps; no React renders on pointer movement. */
export function CraftCursorTrail({ paused = false }: { paused?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (paused || reduced || !matchMedia('(pointer: fine)').matches) return;
    let last = 0;
    let index = 0;
    let lastX = -100;
    let lastY = -100;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || performance.now() - last < 85 || Math.hypot(event.clientX - lastX, event.clientY - lastY) < 22) return;
      last = performance.now(); lastX = event.clientX; lastY = event.clientY;
      const stamp = ref.current?.children[index++ % 8] as HTMLElement | undefined;
      if (!stamp) return;
      stamp.getAnimations().forEach(animation => animation.cancel());
      stamp.style.left = `${event.clientX}px`;
      stamp.style.top = `${event.clientY}px`;
      stamp.animate([
        { opacity: .65, transform: 'translate(-50%, -50%) scale(.5) rotate(0deg)' },
        { opacity: .45, transform: 'translate(-50%, -85%) scale(1) rotate(35deg)', offset: .3 },
        { opacity: 0, transform: 'translate(-50%, -170%) scale(.35) rotate(100deg)' },
      ], { duration: 850, easing: 'ease-out' });
    };
    window.addEventListener('pointermove', move, { passive: true });
    const root = ref.current;
    return () => {
      window.removeEventListener('pointermove', move);
      root?.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    };
  }, [paused, reduced]);
  return <div ref={ref} className="craft-cursor-trail" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <span key={i}><BrandMotif kind={i % 2 ? 'flower' : 'diamond'} /></span>)}</div>;
}
