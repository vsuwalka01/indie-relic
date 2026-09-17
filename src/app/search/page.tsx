'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { products } from '@/lib/products';
import HeaderIconSvg from '@/components/HeaderIcon';
import { searchIcon } from '@/components/headerIconPaths';
import { SectionLabel, StitchDivider, Chip } from '@/components/Ornaments';

const SUGGESTIONS = ['Kavad', 'Bidriware', 'Pottery', 'Dhokra', 'Warli'];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.craft.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <HeaderIconSvg icon={searchIcon} size={22} className="text-maroon flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH FOR..."
            className="flex-1 bg-transparent text-maroon text-xl font-semibold placeholder:text-maroon placeholder:opacity-90 focus:outline-none uppercase tracking-wide"
          />
        </motion.div>

        <StitchDivider className="text-navy mt-6" />

        {!query.trim() && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
            <SectionLabel index="01" className="text-maroon mb-4">Try a craft</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => setQuery(s)} data-cursor="Search">
                  <Chip tone="navy">{s}</Chip>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {query.trim() && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
            <SectionLabel index="01" className="text-maroon mb-5">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </SectionLabel>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {results.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} data-cursor="View" className="group block">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-white">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="product-craft-label">{p.craft}</span>
                    </div>
                    <p className="mt-2 font-bold text-navy-dark text-sm">{p.name}</p>
                    <p className="text-navy-dark/60 text-xs">₹ {p.price.toLocaleString('en-IN')}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-navy-dark/50">No products found for &ldquo;{query}&rdquo;.</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
