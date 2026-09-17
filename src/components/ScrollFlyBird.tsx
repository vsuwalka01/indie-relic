'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import FlightBird from './FlightBird';
import { BIRD_WIDTH, BIRD_HEIGHT } from './birdPaths';

const ASPECT = BIRD_HEIGHT / BIRD_WIDTH;
const LANDING_HEIGHT = 42;

type Flight = { x: number; y: number; targetX: number; targetY: number; width: number; distance: number };
export default function ScrollFlyBird({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [phase, setPhase] = useState('rest');
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, y => Math.min(1, Math.max(0, y / (flight?.distance ?? 460))));
  const progress = useSpring(raw, { stiffness: 110, damping: 25, mass: 0.4 });
  useMotionValueEvent(progress, 'change', p => setPhase(p > 0.995 ? 'perched' : p > 0.015 ? 'flying' : 'rest'));
  useEffect(() => {
    if (reduced) return;
    const measure = () => {
      const origin = ref.current?.getBoundingClientRect();
      const logo = document.getElementById('header-logo-target')?.getBoundingClientRect();
      if (!origin || !logo) return;
      const width = Math.min(origin.width, origin.height / ASPECT, 320);
      setFlight({ x: origin.left + (origin.width - width) / 2, y: origin.top + window.scrollY + (origin.height - width * ASPECT) / 2,
        targetX: logo.left + logo.width * 0.36, targetY: logo.top + 40 - LANDING_HEIGHT, width, distance: Math.max(340, Math.min(560, window.innerHeight * 0.65)) });
    };
    const timers = [100, 800, 1600].map(t => window.setTimeout(measure, t));
    const observer = new ResizeObserver(measure);
    if (ref.current) observer.observe(ref.current);
    window.addEventListener('resize', measure);
    return () => { timers.forEach(clearTimeout); observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [reduced]);
  const x = useTransform(progress, p => {
    if (!flight) return 0;
    const t = Math.max(0, Math.min(1, p));
    return flight.x + (flight.targetX - flight.x) * t + Math.sin(Math.PI * t) * Math.min(120, flight.width * 0.4);
  });
  const y = useTransform(progress, p => {
    if (!flight) return 0;
    const t = Math.max(0, Math.min(1, p));
    return flight.y + (flight.targetY - flight.y) * t - Math.sin(Math.PI * t) * 90;
  });
  const scale = useTransform(progress, [0, 0.15, 0.85, 1], [1, 0.92, 0.22, flight ? LANDING_HEIGHT / (flight.width * ASPECT) : 0.2]);
  const rotate = useTransform(progress, [0, 0.15, 0.55, 0.85, 1], [0, -22, -12, 8, 0]);
  return <>
    <div ref={ref} className={`${className} bird-origin`}>
      <div style={{ opacity: flight && !reduced ? 0 : 1 }} className="w-full h-full flex items-center"><FlightBird /></div>
    </div>
    {flight && !reduced && createPortal(<motion.div data-flight-phase={phase} aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, width: flight.width, height: flight.width * ASPECT, x, y, scale, rotate, transformOrigin: '0 0', zIndex: 70, pointerEvents: 'none' }}>
      <FlightBird flying={phase === 'flying'} perched={phase === 'perched'} />
    </motion.div>, document.body)}
  </>;
}
