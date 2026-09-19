'use client';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import type { CSSProperties } from 'react';
interface MarqueeProps { items: string[]; speed?: number; reverse?: boolean; className?: string; size?: 'sm' | 'display' }
export default function Marquee({ items, speed = 28, reverse = false, className = '', size = 'sm' }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return <div ref={ref} className={`marquee marquee-${size} ${className}`} data-visible={visible} aria-hidden="true">
    <div className="marquee-track marquee-track-css" style={{ '--marquee-duration': `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' } as CSSProperties}>
      {[...items, ...items].map((item, i) => <span key={i} className="marquee-item">{item}<i className="marquee-dot" /></span>)}
    </div>
  </div>;
}
