'use client';

import { useId } from 'react';
import type { CraftTheme } from '@/lib/craftThemes';
import TiltCard from './TiltCard';

export default function CraftArtwork({ theme, craft, compact = false }: { theme: CraftTheme; craft: string; compact?: boolean }) {
  const id = useId().replace(/:/g, '');
  return <TiltCard maxTilt={5} className={`craft-artwork ${compact ? 'is-compact' : ''}`}>
    <svg viewBox="0 0 480 540" role="img" aria-label={`Decorative interpretation inspired by ${craft}`}>
      <defs>
        <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M24 5 43 24 24 43 5 24Z" fill="none" stroke={theme.accent} strokeWidth="1" />
          <circle cx="24" cy="24" r="3" fill={theme.accent} />
        </pattern>
      </defs>
      <rect width="480" height="540" rx="220" fill={theme.ink} />
      <rect x="16" y="16" width="448" height="508" rx="207" fill={`url(#${id})`} opacity="0.28" />
      <rect x="38" y="38" width="404" height="464" rx="188" fill="none" stroke={theme.accent} />
      <g className="craft-art-inner" fill="none" stroke={theme.paper} strokeWidth="2">
        {theme.motif === 'arch' && <>
          {[0, 1, 2, 3].map(i => <path key={i} d={`M${105 + i * 23} 401 V235 Q${105 + i * 23} ${112 + i * 28} 240 ${85 + i * 32} Q${375 - i * 23} ${112 + i * 28} ${375 - i * 23} 235 V401Z`} opacity={1 - i * 0.14} />)}
          <path d="M225 362V245Q225 215 240 200Q255 215 255 245V362Z" fill={theme.accent} stroke="none" />
          <path d="M92 418H388M112 434H368" stroke={theme.accent} />
        </>}
        {theme.motif === 'flower' && <g transform="translate(240 266)">
          {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`rotate(${i * 30})`}><path d="M0 -14 Q-65 -82 0 -153 Q65 -82 0 -14Z" /><path d="M0 -44V-126" stroke={theme.accent} /><circle cy="-171" r="4" fill={theme.accent} /></g>)}
          <circle r="38" fill={theme.ink} /><circle r="23" stroke={theme.accent} /><circle r="9" fill={theme.accent} stroke="none" />
        </g>}
        {theme.motif === 'weave' && <>
          {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(0 ${128 + i * 45})`}><path d="M91 0 126 -22 164 0 202 -22 240 0 278 -22 316 0 354 -22 389 0" stroke={i % 2 ? theme.paper : theme.accent} strokeWidth="6" /><path d="M91 12 126 -10 164 12 202 -10 240 12 278 -10 316 12 354 -10 389 12" opacity="0.5" /></g>)}
          <path d="M118 102V443M362 102V443" strokeDasharray="3 8" />
        </>}
        {theme.motif === 'folk' && <>
          <circle cx="240" cy="155" r="37" stroke={theme.accent} /><path d="M240 195V360M240 264 172 221M240 303 311 249M240 240 291 205M240 333 176 285" strokeWidth="5" />
          {[0, 1, 2, 3, 4].map(i => <g key={i} transform={`translate(${116 + i * 62} 380)`}><circle cy="-18" r="8" /><path d="M0 -7 -16 15H16ZM0 16 -16 39H16ZM-8 39 -14 55M8 39 14 55M-16 15 -27 4M16 15 27 4" /></g>)}
          <path d="M121 238Q130 192 166 215Q170 247 121 238ZM285 211Q288 169 324 178Q333 209 285 211ZM292 264Q330 218 350 249Q341 279 292 264Z" fill={theme.accent} stroke="none" />
        </>}
        {theme.motif === 'metal' && <g transform="translate(240 270)">
          {[65, 85, 125, 152].map(r => <circle key={r} r={r} stroke={r === 85 ? theme.accent : theme.paper} strokeDasharray={r === 125 ? '2 9' : undefined} />)}
          {Array.from({ length: 16 }, (_, i) => <path key={i} transform={`rotate(${i * 22.5})`} d="M0 -30Q-30 -65 0 -108Q30 -65 0 -30Z" stroke={theme.accent} />)}
          <circle r="28" fill={theme.accent} stroke="none" />
        </g>}
        {theme.motif === 'wave' && <>
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M105 ${140 + i * 28} Q170 ${90 + i * 28} 240 ${140 + i * 28} T375 ${140 + i * 28}`} stroke={i % 3 === 0 ? theme.accent : theme.paper} strokeWidth={i % 3 === 0 ? 4 : 1.5} />)}
        </>}
      </g>
    </svg>
    {!compact && <span className="artwork-caption">An exploration of {craft.toLowerCase()}</span>}
  </TiltCard>;
}
