'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CraftFlourish } from '@/components/CraftSurface';
import { BrandMotif } from '@/components/BrandScene';
import Newsletter from '@/components/Newsletter';
import { SectionLabel } from '@/components/Ornaments';
import { slugifyState, type StateCraft } from '@/lib/stateCrafts';
import { getCraftTheme } from '@/lib/craftThemes';

const steps = [
  { title: 'Begin with the maker.', text: 'Listen to the people behind the craft. Learn the tools, the materials, and the stories that give each technique its character.', motif: 'flower' },
  { title: 'Design for everyday.', text: 'Bring traditional techniques into thoughtful forms that belong in the way we live, give, and gather today.', motif: 'diamond' },
  { title: 'Carry the story forward.', text: 'Connect a piece with its place and its maker, so the craft stays part of everyday life.', motif: 'checker' },
] as const;

export default function AboutClient({ crafts }: { crafts: StateCraft[] }) {
  return <div className="about-page bg-cream">
    <section className="about-hero about-container">
      <div className="about-hero-copy"><SectionLabel index="01" className="text-maroon">The Indie Relic story</SectionLabel><h1 className="font-display">We design relics<br />for the <em>future.</em></h1><p className="about-lead">Rooted in Indian craft.<br />Reimagined for the way we live.</p><p>We bring traditional artistry and contemporary design together, working with artisans to create objects that carry a story into your home.</p><Link href="/products" className="about-button">Explore the collection <span aria-hidden="true">↗</span></Link></div>
      <motion.figure className="about-hero-image" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}}><img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&h=1100&q=80" alt="Gold embroidery decorating a purple sari" width={900} height={1100} fetchPriority="high" /><figcaption>Colour. Detail. A living tradition.</figcaption><CraftFlourish /></motion.figure>
    </section>
    <section className="about-belief"><div className="about-container"><span className="eyebrow">What we believe</span><h2 className="font-display">Heritage belongs<br />in everyday life.</h2><p>A technique passed between generations. A familiar motif in an unexpected place. We want the quiet beauty of Indian craft to become part of the spaces and moments you cherish.</p><BrandMotif kind="flower" className="about-belief-motif" /></div></section>
    <section className="about-process about-container"><div className="about-section-heading"><SectionLabel index="02" className="text-maroon">How we approach design</SectionLabel><h2 className="font-display">From tradition<br />to something personal.</h2></div><div className="about-process-grid">{steps.map((step,index)=><motion.article key={step.title} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.45,delay:index*.08}}><div className="about-step-top"><span>0{index+1}</span><BrandMotif kind={step.motif} /></div><h3 className="font-display">{step.title}</h3><p>{step.text}</p></motion.article>)}</div></section>
    {crafts.length>0 && <section className="about-roots about-container"><div className="about-section-heading"><SectionLabel index="03" className="text-maroon">Places behind the pieces</SectionLabel><h2 className="font-display">Many places.<br />Many ways of making.</h2><Link href="/craft-map">Explore the craft atlas ↗</Link></div><div className="about-roots-grid">{crafts.map(craft=>{const theme=getCraftTheme(craft.state);return <Link key={craft.state} href={`/craft-map/${slugifyState(craft.state)}`} className="about-root-card" style={{background:theme.ink,color:theme.paper}}><span className="eyebrow">{craft.state} · {craft.region}</span><BrandMotif kind={theme.motif==='weave'?'checker':theme.motif==='arch'?'diamond':'flower'} /><h3 className="font-display">{craft.craft}</h3><p>{craft.tagline}</p><span className="about-root-arrow" aria-hidden="true">↗</span></Link>})}</div></section>}
    <section className="about-invitation about-container"><CraftFlourish /><p className="eyebrow text-maroon">Find your connection</p><h2 className="font-display">A little history.<br />A place in your home.</h2><Link href="/products" className="about-button">Find your piece <span aria-hidden="true">↗</span></Link></section>
    <Newsletter />
  </div>;
}
