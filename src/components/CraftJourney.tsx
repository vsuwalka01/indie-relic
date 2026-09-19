'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties } from 'react';
import type { StateCraft } from '@/lib/stateCrafts';
import { slugifyState } from '@/lib/stateCrafts';
import { getCraftTheme } from '@/lib/craftThemes';
import { BrandMotif } from './BrandScene';
import CraftPlayground from './CraftPlayground';

export type CraftReference = Pick<StateCraft, 'state' | 'craft' | 'region' | 'tagline' | 'productId'>;

export function referenceForPage(pathname: string, crafts: CraftReference[]) {
  const stateSlug = pathname.startsWith('/craft-map/') ? pathname.split('/')[2] : '';
  const state = crafts.find(craft => slugifyState(craft.state) === stateSlug);
  if (state) return state;
  const productId = /^\/products\/(\d+)$/.exec(pathname)?.[1];
  const product = productId ? crafts.find(craft => craft.productId === Number(productId)) : undefined;
  if (product) return product;
  const states: Record<string, string> = { '/': 'Rajasthan', '/products': 'Punjab', '/about': 'Gujarat', '/cart': 'Assam', '/account': 'Uttar Pradesh', '/search': 'Bihar', '/privacy': 'Kerala', '/returns': 'West Bengal', '/terms': 'Tamil Nadu', '/craft-map': 'Madhya Pradesh' };
  return crafts.find(craft => craft.state === states[pathname]) ?? crafts[0];
}

export function CraftPageRibbon({ craft }: { craft?: CraftReference }) {
  if (!craft) return null;
  const theme = getCraftTheme(craft.state);
  return <aside className="craft-page-ribbon" style={{ '--journey-ink': theme.ink, '--journey-paper': theme.paper, '--journey-accent': theme.accent } as CSSProperties} aria-label="This page's craft inspiration">
    <div><span className="ribbon-mini-motif" aria-hidden="true"><BrandMotif kind={theme.motif === 'weave' ? 'checker' : 'flower'} /></span><p>A thread from <strong>{craft.state}</strong><span className="ribbon-craft-name"> · {craft.craft}</span></p><a href="#craft-journey">Play &amp; explore <span aria-hidden="true">↗</span></a></div>
  </aside>;
}

export default function CraftJourney({ crafts, initialState }: { crafts: CraftReference[]; initialState: string }) {
  const [selectedState, setSelectedState] = useState(initialState);
  const reduced = useReducedMotion();
  const craft = crafts.find(item => item.state === selectedState) ?? crafts[0];
  if (!craft) return null;
  const theme = getCraftTheme(craft.state);
  const index = crafts.indexOf(craft);
  const style = { '--journey-ink': theme.ink, '--journey-paper': theme.paper, '--journey-accent': theme.accent } as CSSProperties;
  return <section id="craft-journey" className="craft-journey" style={style} aria-labelledby="craft-journey-title">
    <div className="journey-topline"><span>Crafts across India</span><span>Many places. Many ways of making.</span></div>
    <div className="journey-layout">
      <div className="journey-copy">
        <p className="eyebrow">A little discovery, wherever you wander</p>
        <h2 id="craft-journey-title" className="font-display">Every state.<br /><em>A different story.</em></h2>
        <p className="journey-intro">Open a panel, draw a thread, or let a pattern bloom. Explore a craft, then follow it back to the place it calls home.</p>
        <label className="journey-select-label" htmlFor="journey-state">Choose a state or region</label>
        <div className="journey-select-row"><select id="journey-state" value={craft.state} onChange={event=>setSelectedState(event.target.value)}>{[...crafts].sort((a,b)=>a.state.localeCompare(b.state)).map(item=><option key={item.state} value={item.state}>{item.state} · {item.craft}</option>)}</select><button type="button" aria-label="Explore the next state" onClick={()=>setSelectedState(crafts[(index+1)%crafts.length].state)}>→</button></div>
        <div className="journey-state-detail" aria-live="polite" aria-atomic="true"><span>{craft.region}, {craft.state}</span><h3 className="font-display">{craft.craft}</h3><p>{craft.tagline}</p></div>
        <Link className="journey-story-link" href={`/craft-map/${slugifyState(craft.state)}`}>Read the {craft.state} story <span aria-hidden="true">↗</span></Link>
        <Link className="journey-atlas-link" href="/craft-map">See the whole craft atlas →</Link>
      </div>
      <motion.div key={craft.state} initial={reduced ? false : { opacity: .3, y: 18, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .45 }} className="journey-art"><span className="journey-art-label">{String(index+1).padStart(2,'0')} / {String(crafts.length).padStart(2,'0')} <span>Made to be explored</span></span><CraftPlayground theme={theme} craft={craft.craft} /></motion.div>
    </div>
    <div className="journey-state-index" aria-label="Explore every state">{crafts.map(item=><button type="button" key={item.state} aria-pressed={item.state===craft.state} onClick={()=>setSelectedState(item.state)}>{item.state}<span aria-hidden="true">↗</span></button>)}</div>
  </section>;
}
