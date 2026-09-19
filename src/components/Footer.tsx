'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import BirdMark from './BirdMark';

function PinterestIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345c-.09.375-.293 1.194-.332 1.361-.053.218-.173.265-.4.16-1.492-.694-2.424-2.875-2.424-4.627 0-3.769 2.738-7.229 7.892-7.229 4.144 0 7.365 2.953 7.365 6.899 0 4.117-2.595 7.431-6.199 7.431-1.211 0-2.348-.63-2.738-1.373 0 0-.599 2.281-.744 2.84-.27 1.037-1 2.337-1.488 3.13C9.72 23.812 10.831 24 12 24c6.628 0 12-5.373 12-12 0-6.628-5.372-12-12-12z" />
    </svg>
  );
}

export default function Footer() {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Brand Story', href: '/about' },
    { label: 'Track your Order', href: '/account' },
    { label: 'Exchange', href: '/returns' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Return Policy', href: '/returns' },
    { label: 'Shipping Policy', href: '/returns' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: PinterestIcon, href: '#', label: 'Pinterest' },
  ];

  return (
    <footer className="site-footer relative bg-cream pt-16">
      {/* Hummingbird mark poking above the navy panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative w-40 h-40 md:w-48 md:h-48 -mb-1"
        >
          <BirdMark className="w-full h-full" beat={1.15} />
        </motion.div>
      </div>

      <div className="bg-navy text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <h4 className="font-bold text-sm tracking-wide">GET IN TOUCH</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">Support:</span> support@indierelic.com</li>
                <li><span className="font-semibold">Careers:</span> careers@indierelic.com</li>
                <li><span className="font-semibold">Marketing & Partnership:</span> partners@indierelic.com</li>
                <li className="pt-2"><span className="font-semibold">Whatsapp:</span> +91 00000 00000</li>
                <li className="pt-2"><span className="font-semibold">Gifting & Corporate orders:</span> gifting@indierelic.com</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <h4 className="font-bold text-sm tracking-wide">QUICK LINKS</h4>
              <ul className="space-y-2 text-sm font-semibold">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-gold transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <h4 className="font-bold text-sm tracking-wide">LEGAL</h4>
              <ul className="space-y-2 text-sm font-semibold">
                {legalLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-gold transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mt-14 pt-6 border-t border-cream/20 text-xs text-cream/70"
          >
            <p>&copy; {new Date().getFullYear()} Indie Relic. All rights reserved.</p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.15 }}
                    className="w-8 h-8 flex items-center justify-center border border-cream/60 rounded"
                  >
                    <Icon size={16} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
