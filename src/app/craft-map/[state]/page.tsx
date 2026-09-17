'use client';
import { useParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import IndiaMap from '@/components/IndiaMap';
import CraftArtwork from '@/components/CraftArtwork';
import ParallaxScene from '@/components/ParallaxScene';
import TiltCard from '@/components/TiltCard';
import { STATE_CRAFTS, unslugifyState, slugifyState } from '@/lib/stateCrafts';
import { getCraftTheme } from '@/lib/craftThemes';
import { getProduct } from '@/lib/products';

export default function StateCraftPage() {
  const params = useParams();
  const router = useRouter();
  const stateName = unslugifyState(params.state as string);
  if (!stateName) notFound();
  const craft = STATE_CRAFTS.find(s => s.state === stateName)!;
  const theme = getCraftTheme(stateName);
  const product = craft.productId ? getProduct(craft.productId) : undefined;
  const index = STATE_CRAFTS.indexOf(craft);
  const more = [1, 2, 3].map(n => STATE_CRAFTS[(index + n) % STATE_CRAFTS.length]);
  const style = { '--craft-ink': theme.ink, '--craft-paper': theme.paper, '--craft-accent': theme.accent } as CSSProperties;
  return <article className="craft-story" style={style} key={stateName}>
    <ParallaxScene>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-16">
        <Link href="/craft-map" className="story-back">← Back to the craft atlas</Link>
        <div className="story-hero">
          <div>
            <p className="eyebrow mb-6">Stories from {stateName} / {String(index + 1).padStart(2, '0')}</p>
            <h1 className="font-display story-title">{craft.craft}</h1>
            <p className="story-tagline">{craft.tagline}.</p>
            <div className="story-rule" />
            <p className="text-sm leading-relaxed max-w-sm opacity-80">{theme.note}. A tradition rooted in {craft.region}, carried forward by hand.</p>
            <a href="#the-story" className="story-back mt-8 inline-flex">Unfold the story <span aria-hidden="true">↓</span></a>
          </div>
          <div className="story-art"><CraftArtwork theme={theme} craft={craft.craft} /></div>
        </div>
        <div className="story-facts">
          <div><span>From the heart of</span><strong>{craft.region}</strong></div>
          <div><span>A tradition that endures</span><strong>{craft.age.replace('Alive from ', '').replace(' yrs', ' years')}</strong></div>
          <div><span>A language of making</span><strong>{theme.note.split(' · ')[0]}</strong></div>
        </div>
      </div>
    </ParallaxScene>
    <section id="the-story" className="story-body max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <div>
        <p className="eyebrow mb-5">The tradition</p>
        <h2 className="font-display text-3xl md:text-4xl leading-snug">Made by hand.<br />Held in memory.</h2>
        <p className="mt-8 text-base md:text-lg leading-[1.9] opacity-85">{craft.description}</p>
        <Link href={product ? '/products/' + product.id : '/products'} className="craft-cta mt-9">{product ? 'Explore ' + product.name : 'Explore our craft collection'} <span>↗</span></Link>
      </div>
      <div className="story-map-panel">
        <p className="eyebrow">Find the roots</p>
        <IndiaMap className="w-full max-w-[330px] mx-auto" highlightState={stateName} onStateClick={state => router.push('/craft-map/' + slugifyState(state))} />
        <p className="text-center text-sm">{craft.region}, {stateName}</p>
      </div>
    </section>
    <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
      <div className="flex justify-between items-end gap-4 mb-8"><div><p className="eyebrow mb-3">The journey continues</p><h2 className="font-display text-3xl">Another place. Another story.</h2></div><Link href="/craft-map" className="story-back hidden sm:inline-flex">See all stories ↗</Link></div>
      <div className="grid sm:grid-cols-3 gap-6">{more.map(m => {
        const next = getCraftTheme(m.state);
        return <TiltCard key={m.state} maxTilt={4}><Link href={'/craft-map/' + slugifyState(m.state)} className="next-story" style={{ background: next.ink, color: next.paper }}>
          <p className="eyebrow opacity-80">{m.state}</p><h3 className="font-display text-2xl mt-5 mb-4">{m.craft}</h3><p className="text-sm leading-relaxed opacity-85">{m.tagline}</p><span className="block mt-6 text-2xl" aria-hidden="true">↗</span>
        </Link></TiltCard>;
      })}</div>
    </section>
  </article>;
}
