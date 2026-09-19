'use client';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import type { CSSProperties } from 'react';
interface RevealTextProps { lines: string[]; className?: string; as?: 'h1' | 'h2' | 'h3' | 'p'; delay?: number }
/** SSR-visible primary headings; secondary reveals have stable reduced-motion markup. */
export default function RevealText({ lines, className = '', as: Tag = 'h2', delay = 0 }: RevealTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const visible = useInView(ref, { once: true, margin: '-30px' });
  return <Tag ref={ref} className={`reveal-heading ${className}`} data-revealed={visible || Tag === 'h1'}>
    {lines.map((line, i) => <span key={i} className="block overflow-hidden"><span className="reveal-line block" style={{ '--reveal-delay': `${delay + i * .07}s` } as CSSProperties}>{line}</span></span>)}
  </Tag>;
}
