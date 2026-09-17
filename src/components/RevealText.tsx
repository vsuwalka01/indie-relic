'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '@/lib/motion';

interface RevealTextProps {
  /** Each entry is rendered as its own masked line. */
  lines: string[];
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  delay?: number;
}

/**
 * Headline reveal in the Lusion idiom: every line sits in its own overflow
 * mask and slides up from below on scroll-in, staggered. Splitting by line
 * (rather than per character) keeps the text selectable and readable to
 * screen readers as one string.
 */
export default function RevealText({ lines, className = '', as = 'h2', delay = 0 }: RevealTextProps) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];

  if (reduceMotion) {
    const Plain = as;
    return <Plain className={className}>{lines.join(' ')}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            variants={{
              hidden: { y: '105%' },
              visible: { y: '0%', transition: { duration: 0.75, ease: EASE.out } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
