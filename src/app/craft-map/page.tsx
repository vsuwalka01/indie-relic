'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import IndiaMap from '@/components/IndiaMap';
import CraftArtwork from '@/components/CraftArtwork';
import ParallaxScene from '@/components/ParallaxScene';
import { STATE_CRAFTS, slugifyState, getStateCraft } from '@/lib/stateCrafts';
import { getCraftTheme } from '@/lib/craftThemes';
import Marquee from '@/components/Marquee';
import { SectionLabel, StitchDivider, DriftMotif, Chip } from '@/components/Ornaments';

const shoppableStates = STATE_CRAFTS.filter(s => s.productId).map(s => s.state);
export default function CraftMapPage() {
  const router = useRouter();
  const [selected, setSelected] = useState('Rajasthan');
  const [query, setQuery] = useState('');
  const craft = getStateCraft(selected)!;
  const theme = getCraftTheme(selected);
  const goToState = (state: string) => router.push('/craft-map/' + slugifyState(state));
  const matches = STATE_CRAFTS.filter(s => (s.state + ' ' + s.craft).toLowerCase().includes(query.toLowerCase()));
  return <div className="min-h-screen bg-cream">
    <ParallaxScene className="atlas-intro">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-8">
        <SectionLabel index="00" className="text-maroon">The Indie Relic craft atlas</SectionLabel>
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 items-end mt-5">
          <h1 className="font-display text-navy-dark text-4xl sm:text-5xl lg:text-6xl leading-[1.15]">Many places.<br />A thousand ways<br /><span className="text-maroon">to make beauty.</span></h1>
          <div className="max-w-sm md:pb-3"><p className="text-navy-dark/75 leading-relaxed">Follow a thread across India. From painted stories to woven memories, discover the hands and traditions behind each craft.</p><p className="mt-5 text-xs tracking-wider uppercase text-maroon">Choose a state to step into its story ↗</p></div>
        </div>
      </div>
    </ParallaxScene>
    <div className="bg-navy text-gold py-3 border-y border-gold/25">
      <Marquee items={STATE_CRAFTS.slice(0, 10).map(s => s.craft)} speed={34} />
    </div>
    <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-16 pt-10 relative">
      <DriftMotif kind="checker" className="w-16 h-16 right-1 top-2 text-gold hidden lg:block" />
      <div className="atlas-layout">
        <div className="atlas-map">
          <label htmlFor="state-select" className="eyebrow block mb-3">Jump to a state</label>
          <select id="state-select" value="" onChange={e => { if (e.target.value) goToState(e.target.value); }} className="state-select">
            <option value="">Choose your next discovery</option>
            {STATE_CRAFTS.map(s => <option key={s.state} value={s.state}>{s.state} — {s.craft}</option>)}
          </select>
          <IndiaMap className="w-full" pins={shoppableStates} onStateClick={goToState} onStateHover={setSelected} />
          <p className="text-xs text-navy-dark/65 text-center mt-2">Gold pins mark crafts in our collection. Every state opens a story.</p>
        </div>
        <aside className="atlas-preview" style={{ backgroundColor: theme.paper, color: theme.ink }}>
          <div className="flex justify-between items-center text-xs uppercase tracking-[0.15em]"><span>In focus</span><span>{craft.region}</span></div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Chip tone="navy">{craft.state}</Chip>
            {craft.productId && <Chip tone="gold">In our collection</Chip>}
          </div>
          <div className="max-w-[220px] mx-auto my-6"><CraftArtwork key={selected} theme={theme} craft={craft.craft} compact /></div>
          <p className="eyebrow">{craft.state}</p>
          <h2 className="font-display text-3xl mt-3">{craft.craft}</h2>
          <p className="mt-3 leading-relaxed">{craft.tagline}</p>
          <Link href={'/craft-map/' + slugifyState(selected)} className="craft-cta mt-7" style={{ background: theme.ink, color: theme.paper }}>Discover the tradition <span>↗</span></Link>
        </aside>
      </div>
      <StitchDivider className="text-navy mt-14" />
      <div className="mt-10 flex flex-col sm:flex-row justify-between gap-5 sm:items-center">
        <div>
          <SectionLabel index="01" className="text-maroon mb-3">Every state, every craft</SectionLabel>
          <h2 className="font-display text-2xl text-navy-dark">Find your next story</h2>
          <Chip tone="navy" className="mt-3">{matches.length} of {STATE_CRAFTS.length} stories</Chip>
        </div>
        <label className="flex gap-3 items-center text-navy-dark"><span className="text-sm">Search</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="State or craft" className="state-search" /></label>
      </div>
      <div className="state-directory mt-6">
        {matches.map(s => <Link key={s.state} href={'/craft-map/' + slugifyState(s.state)} className="state-directory-link"><span><strong>{s.state}</strong><small>{s.craft}</small></span><span aria-hidden="true">↗</span></Link>)}
      </div>
      {matches.length === 0 && <p className="py-8 text-navy-dark">No matching stories. Try another state or craft.</p>}
    </section>
  </div>;
}
