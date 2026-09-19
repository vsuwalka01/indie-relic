'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { BrandMotif } from './BrandScene';

interface ButterflyMotifProps {
  className?: string;
  /** Pixel size once it takes flight. */
  size?: number;
  color?: string;
}

const MARGIN = 70;

/** A landing spot anywhere in the viewport, kept clear of the very edges. */
function randomPerch(size: number) {
  const maxX = Math.max(MARGIN, window.innerWidth - size - MARGIN);
  const maxY = Math.max(MARGIN, window.innerHeight - size - MARGIN);
  return {
    x: MARGIN + Math.random() * (maxX - MARGIN),
    y: MARGIN + Math.random() * (maxY - MARGIN),
  };
}

/**
 * The four-lobed brand motif, which reads as a butterfly — so it behaves like
 * one. Disturb it and it flits away on a wandering path to land somewhere else
 * on screen. It sits in the normal layout until first disturbed, then goes
 * fixed-position so it can roam the whole viewport.
 */
export default function ButterflyMotif({ className = '', size = 48, color }: ButterflyMotifProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();

  const [aloft, setAloft] = useState(false);
  const [perch, setPerch] = useState({ x: 0, y: 0 });
  const flying = useRef(false);

  const flee = useCallback(async () => {
    if (flying.current) return;
    flying.current = true;

    // Where it is right now, in viewport coordinates.
    const from = aloft
      ? perch
      : (() => {
          const rect = anchorRef.current?.getBoundingClientRect();
          return rect ? { x: rect.left, y: rect.top } : { x: 0, y: 0 };
        })();

    const to = randomPerch(size);
    setPerch(from);
    setAloft(true);

    if (reduceMotion) {
      setPerch(to);
      flying.current = false;
      return;
    }

    // Butterflies don't travel in straight lines: lift first, wander past the
    // target, then settle back onto it.
    const midX = (from.x + to.x) / 2 + (Math.random() - 0.5) * 220;
    const liftY = Math.min(from.y, to.y) - 60 - Math.random() * 90;
    const overshootX = to.x + (to.x > from.x ? 40 : -40);
    const duration = 1.5 + Math.random() * 0.7;

    try {
      // The animation promise never settles while the tab is backgrounded,
      // since Framer Motion runs on requestAnimationFrame — without the timer
      // alongside it, a visitor who switches tabs mid-flight would come back
      // to a butterfly that can never be disturbed again.
      await Promise.race([
        controls.start({
          x: [from.x, midX, overshootX, to.x],
          y: [from.y, liftY, to.y - 30, to.y],
          rotate: [0, to.x > from.x ? 16 : -16, to.x > from.x ? -9 : 9, 0],
          transition: { duration, ease: [0.22, 0.61, 0.36, 1], times: [0, 0.35, 0.75, 1] },
        }),
        new Promise((resolve) => setTimeout(resolve, duration * 1000 + 400)),
      ]);
    } finally {
      setPerch(to);
      flying.current = false;
    }
  }, [aloft, perch, size, reduceMotion, controls]);

  // Keep it on screen if the window is resized while it's perched.
  useEffect(() => {
    if (!aloft) return;
    const onResize = () => {
      setPerch((p) => ({
        x: Math.min(p.x, Math.max(MARGIN, window.innerWidth - size - MARGIN)),
        y: Math.min(p.y, Math.max(MARGIN, window.innerHeight - size - MARGIN)),
      }));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [aloft, size]);

  // Once flying, the element is positioned by the animation itself.
  useEffect(() => {
    if (aloft && !flying.current) controls.set({ x: perch.x, y: perch.y });
  }, [aloft, perch, controls]);

  const wings = reduceMotion
    ? {}
    : {
        // A slow breathing open/close while resting; the flight animation
        // overrides the pace when it takes off.
        scaleX: [1, 0.72, 1],
        transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const },
      };

  const motif = (
    <motion.span
      animate={wings}
      style={{ display: 'block', transformOrigin: 'center' }}
    >
      <BrandMotif kind="flower" className="w-full h-full" />
    </motion.span>
  );

  // Before the first disturbance it stays in the layout where it was placed.
  if (!aloft) {
    return (
      <span
        ref={anchorRef}
        onPointerEnter={flee}
        onPointerDown={flee}
        className={`butterfly-motif ${className}`}
        style={color ? { color } : undefined}
      >
        {motif}
      </span>
    );
  }

  return (
    <>
      {/* Holds the original gap so the layout doesn't jump when it leaves. */}
      <span ref={anchorRef} className={className} aria-hidden="true" />

      <motion.span
        animate={controls}
        initial={{ x: perch.x, y: perch.y }}
        onPointerEnter={flee}
        onPointerDown={flee}
        className="butterfly-aloft"
        style={{ width: size, height: size, color }}
      >
        {motif}
      </motion.span>
    </>
  );
}
