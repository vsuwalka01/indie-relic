'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { products } from '@/lib/products';
import HeaderIconSvg from '@/components/HeaderIcon';
import { searchIcon } from '@/components/headerIconPaths';

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

        {query.trim() && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {results.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="group block">
                    <div className="h-40 rounded-xl overflow-hidden bg-white">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
