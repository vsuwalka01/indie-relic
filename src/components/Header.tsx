'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import HeaderIconSvg from './HeaderIcon';
import { personIcon, searchIcon, bagIcon } from './headerIconPaths';
import { useCart } from '@/lib/cartStore';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const count = useCart((s) => s.count());
  const lastAddedAt = useCart((s) => s.lastAddedAt);

  // Zustand's persisted store hydrates after mount; render 0 until then so
  // the badge doesn't flash a mismatched number during SSR/hydration.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const displayCount = hydrated ? count : 0;

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'All Products', href: '/products' },
    { label: 'Craft Stories', href: '/craft-map' },
    { label: 'About Us', href: '/about' },
  ];

  return (
    <header className="relative sticky top-0 z-50 bg-cream overflow-hidden">
      {/* Checkered corner motif */}
      <div className="hidden md:block absolute top-0 right-0 w-16 h-16">
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
          <div className="bg-navy" />
          <div className="bg-cream" />
          <div className="bg-cream" />
          <div className="bg-navy" />
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              id="header-logo-target"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative h-16 w-32"
            >
              <Image
                src="/logo-header.png"
                alt="Indie Relic"
                fill
                sizes="128px"
                className="object-contain object-left"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link href={link.href} className="nav-link">
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-5">
            <Link href="/account">
              <motion.div whileHover={{ scale: 1.15 }} className="text-maroon">
                <HeaderIconSvg icon={personIcon} size={22} />
              </motion.div>
            </Link>
            <Link href="/search">
              <motion.div whileHover={{ scale: 1.15, rotate: -8 }} className="text-maroon">
                <HeaderIconSvg icon={searchIcon} size={22} />
              </motion.div>
            </Link>
            <Link href="/cart">
              <motion.div whileHover={{ scale: 1.15 }} className="relative text-maroon">
                <HeaderIconSvg icon={bagIcon} size={22} />
                <AnimatePresence>
                  {displayCount > 0 && (
                    <motion.span
                      key={lastAddedAt}
                      initial={{ scale: 0 }}
                      animate={{ scale: [1.4, 1] }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-maroon text-cream text-[10px] flex items-center justify-center rounded-full font-bold"
                    >
                      {displayCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="relative text-maroon">
              <HeaderIconSvg icon={bagIcon} size={22} />
              {displayCount > 0 && (
                <motion.span
                  key={lastAddedAt}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1.4, 1] }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-maroon text-cream text-[10px] flex items-center justify-center rounded-full font-bold"
                >
                  {displayCount}
                </motion.span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-navy">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1 border-t border-navy/10">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-3 px-2 text-maroon font-bold uppercase text-sm tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-6 pt-3 px-2">
                  <Link href="/account" className="text-maroon"><HeaderIconSvg icon={personIcon} size={22} /></Link>
                  <Link href="/search" className="text-maroon"><HeaderIconSvg icon={searchIcon} size={22} /></Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
