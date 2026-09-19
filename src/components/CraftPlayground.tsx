'use client';

import { useId, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import type { CSSProperties } from 'react';
import type { CraftTheme } from '@/lib/craftThemes';

const actions = {
  arch: ['Open the painted panels', 'Open the panels'],
  weave: ['Draw a thread through the pattern', 'Draw the thread'],
  flower: ['Bring the petals into bloom', 'Bloom the pattern'],
  folk: ['Build a rhythm of dots and lines', 'Add the marks'],
  metal: ['Move across the surface to catch the light', 'Reveal the inlay'],
  wave: ['Explore the hand-shaped contours', 'Shape the contours'],
} as const;

export default function CraftPlayground({ theme, craft, compact = false }: { theme: CraftTheme; craft: string; compact?: boolean }) {
  const [progress, setProgress] = useState(35);
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  const reduced = useReducedMotion();
  const unique = useId().replace(/:/g, '');
  const rotateX = useSpring(0, { stiffness: 150, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 22 });
  const gleamX = useSpring(0, { stiffness: 100, damping: 24 });
  const gleamY = useSpring(0, { stiffness: 100, damping: 24 });
  const fraction = progress / 100;
  const isBandhani = /bandhani/i.test(craft);
  const isThangka = /thangka/i.test(craft);
  const isMirror = /kannadi/i.test(craft);
  const isDhokra = /dhokra/i.test(craft);
  const action: readonly [string, string] = isBandhani ? ['Build a rhythm of tied dots', 'Reveal the tied-dot pattern']
    : isThangka ? ['Bring the painted geometry into view', 'Reveal the painted geometry']
    : isMirror ? ['Move across the surface to catch the light', 'Reveal the reflection']
    : isDhokra ? ['Trace the rhythm of the cast pattern', 'Reveal the cast pattern']
    : actions[theme.motif];
  const active = (index: number, total: number) => index < Math.ceil(total * fraction);
  const style = { '--play-ink': theme.ink, '--play-paper': theme.paper, '--play-accent': theme.accent } as CSSProperties;
  return <div ref={ref} className={`craft-playground ${compact ? 'playground-compact' : ''}`} style={style} data-running={visible && !reduced}>
    <div className="playground-stage" onPointerMove={event => {
      if (reduced || event.pointerType !== 'mouse') return;
      const box = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      rotateX.set(-y * 12); rotateY.set(x * 12);
      gleamX.set(x * 230); gleamY.set(y * 230);
    }} onPointerLeave={() => { rotateX.set(0); rotateY.set(0); gleamX.set(0); gleamY.set(0); }}>
      <motion.button type="button" className="playground-art" aria-label={`${action[1]} — inspired by ${craft}`} onClick={() => setProgress(value => value >= 100 ? 0 : Math.min(100, value + 25))} style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformPerspective: 900 }}>
        <svg viewBox="0 0 400 400" aria-hidden="true" fill="none">
          <defs><pattern id={`play-${unique}`} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1" fill={theme.paper} opacity=".2" /></pattern></defs>
          <rect width="400" height="400" rx="26" fill={theme.ink} />
          <rect x="15" y="15" width="370" height="370" rx="16" fill={`url(#play-${unique})`} stroke={theme.accent} strokeWidth="1" />
          <path className="playground-running-stitch" d="M35 95V35H95M305 35H365V95M365 305V365H305M95 365H35V305" stroke={theme.paper} strokeWidth="2" strokeDasharray="3 6" />
          {theme.motif === 'arch' && <g>
            <path d="M82 330V164Q82 61 200 55Q318 61 318 164V330Z" fill={theme.accent} />
            <path d="M105 330V168Q105 87 200 79Q295 87 295 168V330Z" fill={theme.ink} stroke={theme.paper} />
            <g className="playground-reveal" style={{ opacity: .2 + fraction * .8 }}>
              {[0,1,2,3,4,5,6,7].map(i => <path key={i} transform={`rotate(${i * 45} 200 216)`} d="M200 209Q163 176 200 137Q237 176 200 209Z" stroke={theme.paper} strokeWidth="2" />)}
              <circle cx="200" cy="216" r="16" fill={theme.accent} />
            </g>
            <g className="playground-panels" style={{ transform: `translateX(${-fraction * 22}px) scaleX(${1 - fraction * .88})`, transformOrigin: '106px 250px' }}><path d="M106 328V168Q106 91 198 81V328Z" fill={theme.accent} stroke={theme.paper} /><path d="M124 155H180V195H124ZM124 218H180V258H124ZM124 281H180V311H124Z" stroke={theme.ink} strokeWidth="3" /><circle cx="182" cy="209" r="4" fill={theme.ink} /></g>
            <g className="playground-panels" style={{ transform: `translateX(${fraction * 22}px) scaleX(${1 - fraction * .88})`, transformOrigin: '294px 250px' }}><path d="M202 328V81Q294 91 294 168V328Z" fill={theme.accent} stroke={theme.paper} /><path d="M220 155H276V195H220ZM220 218H276V258H220ZM220 281H276V311H220Z" stroke={theme.ink} strokeWidth="3" /><circle cx="218" cy="209" r="4" fill={theme.ink} /></g>
          </g>}
          {isBandhani && <g>
            {Array.from({length:49},(_,i)=>{const column=i%7;const row=Math.floor(i/7);return <g key={i} className="playground-mark" opacity={active(i,49)?1:.1} transform={`translate(${80+column*40} ${80+row*40})`}><circle r={Math.abs(column-3)+Math.abs(row-3)<=3?10:5} stroke={theme.paper} strokeWidth="3" /><circle r="2" fill={theme.accent} /></g>})}
            <path d="M200 51 349 200 200 349 51 200Z" stroke={theme.accent} strokeDasharray="2 8" strokeWidth="2" />
          </g>}
          {theme.motif === 'weave' && !isBandhani && <g>
            {Array.from({ length: 17 }, (_, i) => <path key={i} d={`M${72+i*16} 65V335`} stroke={theme.paper} opacity=".23" />)}
            {Array.from({ length: 11 }, (_, i) => <g key={i} className="playground-mark" opacity={active(i,11) ? 1 : .1} transform={`translate(0 ${83+i*23})`}><path d="M65 0 88 -8 112 0 136 -8 160 0 184 -8 208 0 232 -8 256 0 280 -8 304 0 335 -8" stroke={i%2 ? theme.paper : theme.accent} strokeWidth="8" /><path d="M65 6H335" stroke={theme.paper} strokeWidth="1" /></g>)}
            <g className="playground-panels" style={{ transform: `translate(${70+fraction*260}px, ${90+fraction*225}px)` }}><path d="M-23 0 0 -9 23 0 0 9Z" fill={theme.paper} /><path d="M-10 0H10" stroke={theme.ink} strokeWidth="2" /></g>
          </g>}
          {(theme.motif === 'flower' || theme.motif === 'metal') && <g>
            {[68,122,151].map(r=><circle key={r} cx="200" cy="200" r={r} stroke={theme.accent} opacity=".5" strokeDasharray={r===151?'2 8':undefined} />)}
            {Array.from({length:12},(_,i)=><g key={i} transform={`rotate(${i*30} 200 200)`} className="playground-mark" opacity={active(i,12)?1:.12}><path d="M200 163Q144 110 200 59Q256 110 200 163Z" stroke={theme.paper} strokeWidth="2" fill={theme.motif==='flower'?theme.accent:'none'} fillOpacity=".5" /><path d="M200 144V80" stroke={theme.paper} /><circle cx="200" cy="39" r="4" fill={theme.accent} /></g>)}
            <circle cx="200" cy="200" r="27" fill={theme.accent} /><circle cx="200" cy="200" r="12" fill={theme.paper} />
          </g>}
          {theme.motif === 'folk' && <g stroke={theme.paper}>
            <path d="M200 325V145M200 200 130 148M200 238 278 166M200 277 119 224M200 303 290 236" strokeWidth="3" />
            {Array.from({length:24},(_,i)=>{const a=i*2.4;const radius=45+Math.sqrt(i)*22;return <g key={i} className="playground-mark" opacity={active(i,24)?1:.12} transform={`translate(${200+Math.cos(a)*radius} ${188+Math.sin(a)*radius*.8}) rotate(${i*35})`}><path d="M0 -12Q20 0 0 12Q-20 0 0 -12Z" fill={i%2?theme.accent:'none'} /><circle r="2" fill={theme.paper} /></g>})}
            <path d="M90 340H310" stroke={theme.accent} strokeWidth="3" />
          </g>}
          {theme.motif === 'wave' && <g>
            {Array.from({length:12},(_,i)=><path key={i} className="playground-mark" opacity={active(i,12)?1:.12} d={`M${128-Math.sin(i/11*Math.PI)*57} ${74+i*23}Q200 ${102+i*23+fraction*12} ${272+Math.sin(i/11*Math.PI)*57} ${74+i*23}`} stroke={i%3===0?theme.accent:theme.paper} strokeWidth={i%3===0?5:2} />)}
            <ellipse cx="200" cy="67" rx="72" ry="17" stroke={theme.paper} strokeWidth="2" /><path d="M130 340Q200 360 270 340" stroke={theme.accent} strokeWidth="4" />
          </g>}
        </svg>
        <motion.span className="playground-gleam" style={{ x: gleamX, y: gleamY }} />
        <span className="playground-tap">Tap to {progress >= 100 ? 'start again' : 'bring it to life'} <span aria-hidden="true">✦</span></span>
      </motion.button>
    </div>
    <div className="playground-controls">
      <label htmlFor={`craft-control-${unique}`}>{action[0]}</label>
      <div><input id={`craft-control-${unique}`} aria-label={action[1]} type="range" min="0" max="100" value={progress} onChange={event=>setProgress(Number(event.target.value))} /><button type="button" onClick={()=>setProgress(0)} aria-label="Reset craft pattern">Reset ↺</button></div>
    </div>
    <p className="playground-caption">A playful interpretation inspired by {craft.toLowerCase()}.</p>
  </div>;
}
