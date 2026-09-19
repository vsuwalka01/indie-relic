'use client';

import { motion } from 'framer-motion';

export default function LegalHero({ title }: { title: string }) {
  const steps = [0, 1, 2, 3, 4];
  return (
    <div className="craft-legal-hero relative h-[420px] overflow-hidden">
      {steps.map((i) => (
        <div
          key={i}
          className={`absolute ${i % 2 === 0 ? 'bg-navy-dark' : 'bg-navy-light'}`}
          style={{
            left: 0,
            top: `${i * 84}px`,
            width: `${170 - i * 34}px`,
            height: '84px',
          }}
        />
      ))}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-6 md:left-10 bottom-16 font-display text-5xl md:text-6xl font-black text-cream leading-none max-w-xs whitespace-pre-line"
      >
        {title}
      </motion.h1>
    </div>
  );
}
