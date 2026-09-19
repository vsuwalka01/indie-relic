'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { CraftFlourish } from '@/components/CraftSurface';
import Newsletter from '@/components/Newsletter';

const sortOptions = ['Featured', 'Alphabetically, A-Z', 'Alphabetically, Z-A', 'Price, low to high', 'Price, high to low'];

export default function ProductsClient({ products }: { products: Product[] }) {
  const [sortBy, setSortBy] = useState('Featured');
  const [craftFilter, setCraftFilter] = useState('All crafts');
  const crafts = useMemo(() => ['All crafts', ...Array.from(new Set(products.map(product => product.craft)))], [products]);
  const sorted = useMemo(() => {
    const list = products.filter(product => craftFilter === 'All crafts' || product.craft === craftFilter);
    if (sortBy === 'Price, low to high') list.sort((a,b) => a.price-b.price);
    if (sortBy === 'Price, high to low') list.sort((a,b) => b.price-a.price);
    if (sortBy === 'Alphabetically, A-Z') list.sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === 'Alphabetically, Z-A') list.sort((a,b) => b.name.localeCompare(a.name));
    return list;
  }, [products, craftFilter, sortBy]);

  return <div className="catalog-page min-h-screen bg-cream">
    <div className="catalog-wrap">
      <header className="catalog-intro">
        <div><p className="eyebrow text-maroon">The Indie Relic collection</p><h1 className="font-display">Objects with a story.</h1></div>
        <p className="catalog-intro-copy">Craft, colour, and a little character.<br />Find a piece that feels like you.</p>
        <CraftFlourish />
      </header>
      <nav className="catalog-crafts" aria-label="Filter products by craft">{crafts.map(craft => <button type="button" key={craft} aria-pressed={craftFilter === craft} onClick={() => setCraftFilter(craft)}>{craft === 'All crafts' ? 'All pieces' : craft}</button>)}</nav>
      <div className="catalog-controls">
        <p aria-live="polite"><strong>{sorted.length}</strong> {sorted.length === 1 ? 'piece' : 'pieces'} to discover</p>
        <label htmlFor="catalog-sort">Sort by <select id="catalog-sort" value={sortBy} onChange={event => setSortBy(event.target.value)}>{sortOptions.map(option => <option key={option}>{option}</option>)}</select></label>
      </div>
      {sorted.length ? <div className="catalog-grid">{sorted.map((product, index) => <motion.div key={product.id} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '40px' }} transition={{ duration: .45, delay: Math.min(index % 3 * .07, .14) }}><ProductCard product={product} /></motion.div>)}</div> : <div className="catalog-empty"><p>No pieces in this collection yet.</p>{craftFilter !== 'All crafts' && <button type="button" onClick={() => setCraftFilter('All crafts')}>See all pieces →</button>}</div>}
      <div className="catalog-endnote"><span aria-hidden="true">✧</span><p>A little craft. A little character. A place in your home.</p><span aria-hidden="true">✧</span></div>
    </div>
    <Newsletter />
  </div>;
}
