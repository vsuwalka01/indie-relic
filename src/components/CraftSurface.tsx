'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { Motif } from '@/lib/craftThemes';

const patterns: Record<Motif, string> = {
  arch: '<path d="M4 42V21Q4 3 24 3Q44 3 44 21V42M11 42V22Q11 10 24 10Q37 10 37 22V42M1 46H47"/><path d="M24 20L29 27 24 34 19 27Z"/>',
  flower: '<path d="M24 24C1 18 7 0 24 10C41 0 47 18 24 24C47 30 41 48 24 38C7 48 1 30 24 24Z"/><path d="M24 9V39M9 24H39"/><circle cx="24" cy="24" r="4"/>',
  weave: '<path d="M0 24 24 0 48 24 24 48ZM9 24 24 9 39 24 24 39ZM18 24 24 18 30 24 24 30Z"/><path d="M0 8 8 0M40 0 48 8M0 40 8 48M40 48 48 40"/>',
  folk: '<circle cx="24" cy="8" r="4"/><path d="M24 13 15 24H33ZM24 25 15 36H33ZM19 36 15 44M29 36 33 44M15 24 5 15M33 24 43 15M2 47H46"/>',
  metal: '<circle cx="24" cy="24" r="19"/><circle cx="24" cy="24" r="15" stroke-dasharray="1 3"/><path d="M24 10Q10 17 24 24Q38 17 24 10ZM24 24Q10 31 24 38Q38 31 24 24ZM10 24Q17 10 24 24Q17 38 10 24ZM24 24Q31 10 38 24Q31 38 24 24Z"/>',
  wave: '<path d="M0 6Q12 -2 24 6T48 6M0 15Q12 7 24 15T48 15M0 24Q12 16 24 24T48 24M0 33Q12 25 24 33T48 33M0 42Q12 34 24 42T48 42"/>',
};

const url = (motif: Motif, color: string) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${patterns[motif]}</g></svg>`)}")`;

/** Craft motifs form the actual page furniture, rather than a separate feature. */
export default function CraftSurface({ children, motif }: { children: ReactNode; motif: Motif }) {
  const style = {
    '--craft-print': url(motif, '#9E2027'),
    '--craft-print-light': url(motif, '#F4F1DC'),
    '--craft-floral': url('flower', '#DAAC54'),
    '--craft-phulkari': url('weave', '#DAAC54'),
    '--craft-warli': url('folk', '#F4F1DC'),
    '--craft-inlay': url('metal', '#DAAC54'),
  } as CSSProperties;
  return <div className="crafted-site" data-craft-motif={motif} style={style}>
    <div className="craft-page-edge edge-left" aria-hidden="true" /><div className="craft-page-edge edge-right" aria-hidden="true" />
    {children}
  </div>;
}

export function CraftFlourish({ className = '' }: { className?: string }) {
  return <svg className={`craft-flourish ${className}`} viewBox="0 0 180 180" fill="none" aria-hidden="true">
    <path d="M90 162V50M90 111Q38 116 28 68Q82 65 90 111ZM90 138Q147 133 153 89Q103 89 90 138ZM90 79Q50 75 53 33Q92 38 90 79ZM90 90Q136 75 132 34Q94 37 90 90Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M90 51Q65 29 90 8Q115 29 90 51ZM36 75 79 104M145 97 101 131M59 41 84 69M125 44 98 79" stroke="currentColor" />
    <circle cx="32" cy="136" r="4" fill="currentColor" /><circle cx="150" cy="51" r="3" fill="currentColor" /><circle cx="60" cy="158" r="3" fill="currentColor" />
  </svg>;
}
