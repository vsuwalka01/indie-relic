'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt angle in degrees at the card's edge. */
  maxTilt?: number;
  disabled?: boolean;
}

/**
 * Wraps a card so it tilts in 3D toward the cursor while hovered — the
 * rotation follows pointer position continuously, not just an on/off hover
 * state. Kept as its own inner layer (not mixed with whileHover/variants on
 * the same element) since Framer Motion's gesture-driven transform and a
 * separately-set style MotionValue both target `transform` and fight for it
 * on one element. Disabled for prefers-reduced-motion and coarse (touch)
 * pointers, where a hover-tracked tilt doesn't mean anything.
 */
export default function TiltCard({ children, className = '', maxTilt = 8, disabled = false }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    setFinePointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  const rotateX = useSpring(0, { stiffness: 300, damping: 25, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 25, mass: 0.5 });
  const scale = useSpring(1, { stiffness: 300, damping: 25 });
  const y = useSpring(0, { stiffness: 300, damping: 25 });

  const active = finePointer && !reduceMotion && !disabled;
  useEffect(() => {
    if (!active) { rotateX.set(0); rotateY.set(0); scale.set(1); y.set(0); }
  }, [active, rotateX, rotateY, scale, y]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 (left) .. 0.5 (right)
    const py = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 (top) .. 0.5 (bottom)
    rotateY.set(px * maxTilt * 2);
    rotateX.set(-py * maxTilt * 2);
  };

  const handleMouseEnter = () => {
    if (!active) return;
    scale.set(1.03);
    y.set(-6);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, scale, y, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
