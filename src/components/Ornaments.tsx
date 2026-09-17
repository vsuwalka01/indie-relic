'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BrandMotif } from './BrandScene';

/** Numbered eyebrow with a drawing rule — marks the start of a section. */
export function SectionLabel({ index, children, className = '' }: { index: string; children: React.ReactNode; className?: string }) {
  return (
    <span className={`section-label ${className}`}>
      <em className="section-label-index">{index}</em>
      <span className="section-label-rule">
        <motion.i
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0, 0, 0.2, 1] }}
        />
      </span>
      {children}
    </span>
  );
}

/** Dashed running-stitch rule, echoing the textile motif in the brand marks. */
export function StitchDivider({ className = '' }: { className?: string }) {
  return <div className={`stitch-divider ${className}`} aria-hidden="true" />;
}

/** Small diamond that rotates gently forever — filler for empty corners. */
export function DriftMotif({
  kind = 'diamond',
  className = '',
  delay = 0,
}: {
  kind?: 'diamond' | 'checker' | 'flower';
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`drift-motif ${className}`}
      animate={reduceMotion ? undefined : { y: [0, -9, 0], rotate: [-4, 5, -4] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <BrandMotif kind={kind} className="w-full h-full" />
    </motion.div>
  );
}

/** Tiny uppercase chip for counts, regions, statuses. */
export function Chip({ children, tone = 'navy', className = '' }: { children: React.ReactNode; tone?: 'navy' | 'gold' | 'maroon'; className?: string }) {
  return <span className={`chip chip-${tone} ${className}`}>{children}</span>;
}

/** Corner tick marks that frame a block like a printer's crop mark. */
export function CropMarks({ className = '' }: { className?: string }) {
  return (
    <span className={`crop-marks ${className}`} aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}
