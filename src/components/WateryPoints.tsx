'use client';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import type { CSSProperties } from 'react';

export const CRAFT_ICONS = ['◆', '✦', '❖', '✚', '❋'];
interface Props { count?: number; variant?: 'watery' | 'plain'; className?: string }
/** Lightweight compositor animation; no full-surface turbulence or per-particle JS. */
export default function WateryPoints({ count = 12, variant = 'watery', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return <div ref={ref} aria-hidden="true" data-visible={visible} className={`craft-specks absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    {Array.from({ length: Math.min(count, 14) }, (_, i) => <span key={i} className="craft-speck"
      style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 53 + 11) % 100}%`, '--speck-delay': `-${i * .7}s`, '--speck-duration': `${variant === 'plain' ? 12 : 8 + i % 4}s` } as CSSProperties}>{CRAFT_ICONS[i % CRAFT_ICONS.length]}</span>)}
  </div>;
}
