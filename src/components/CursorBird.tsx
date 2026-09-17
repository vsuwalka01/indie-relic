'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import FlightBird from './FlightBird';
import { BIRD_HEIGHT, BIRD_WIDTH } from './birdPaths';

const ASPECT = BIRD_HEIGHT / BIRD_WIDTH;
const FOLLOW_HEIGHT = 84;

/** The unchanged brand artwork follows the pointer; no flight or wing deformation. */
export default function CursorBird({ className = '' }: { className?: string }) {
  const originRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [following, setFollowing] = useState(false);
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 95, damping: 23, mass: 0.7 });
  const y = useSpring(0, { stiffness: 95, damping: 23, mass: 0.7 });
  const scale = useSpring(1, { stiffness: 100, damping: 25 });
  const rotate = useSpring(0, { stiffness: 75, damping: 20 });

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(media.matches && !reduced);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    let tracking = false;
    let lastPointer: { x: number; y: number } | null = null;
    let birdWidth = 0;
    let settleTimer: ReturnType<typeof setTimeout>;
    const home = (immediate = false) => {
      const box = originRef.current?.getBoundingClientRect();
      if (!box) return;
      birdWidth = Math.min(box.width, box.height / ASPECT, 320);
      setWidth(birdWidth);
      const targetX = box.left + (box.width - birdWidth) / 2;
      const targetY = box.top + (box.height - birdWidth * ASPECT) / 2;
      if (immediate) { x.jump(targetX); y.jump(targetY); scale.jump(1); rotate.jump(0); }
      else { x.set(targetX); y.set(targetY); scale.set(1); rotate.set(0); }
    };
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !birdWidth) return;
      tracking = true;
      setFollowing(true);
      const smallWidth = FOLLOW_HEIGHT / ASPECT;
      // Stay beside the cursor and inside the viewport without obscuring its target.
      const targetX = event.clientX + 26 + smallWidth > window.innerWidth - 12
        ? event.clientX - smallWidth - 26 : event.clientX + 26;
      const targetY = event.clientY + 20 + FOLLOW_HEIGHT > window.innerHeight - 12
        ? event.clientY - FOLLOW_HEIGHT - 20 : event.clientY + 20;
      x.set(Math.max(12, targetX));
      y.set(Math.max(12, targetY));
      scale.set(FOLLOW_HEIGHT / (birdWidth * ASPECT));
      const direction = lastPointer ? event.clientX - lastPointer.x : 0;
      rotate.set(Math.max(-7, Math.min(7, direction * 0.25)));
      lastPointer = { x: event.clientX, y: event.clientY };
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => rotate.set(0), 120);
    };
    const handleLeave = (event: MouseEvent) => {
      if (event.relatedTarget) return;
      tracking = false;
      lastPointer = null;
      setFollowing(false);
      home();
    };
    const handleScroll = () => { if (!tracking) home(true); };
    const handleResize = () => { tracking = false; setFollowing(false); home(true); };
    home(true);
    const timers = [600, 1400].map(delay => setTimeout(() => { if (!tracking) home(true); }, delay));
    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('mouseout', handleLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(settleTimer);
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('mouseout', handleLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled, x, y, scale, rotate]);

  return <>
    <div ref={originRef} className={className} role="img" aria-label="Indie Relic bird">
      <div className="w-full h-full" style={{ opacity: enabled && width ? 0 : 1 }}><FlightBird /></div>
    </div>
    {enabled && width > 0 && createPortal(<motion.div aria-hidden="true" data-cursor-bird={following ? 'following' : 'rest'}
      style={{ position: 'fixed', top: 0, left: 0, width, height: width * ASPECT, x, y, scale, rotate, transformOrigin: '0 0', pointerEvents: 'none', zIndex: 70 }}>
      <FlightBird />
    </motion.div>, document.body)}
  </>;
}
