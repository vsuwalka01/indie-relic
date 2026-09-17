'use client';

import { motion } from 'framer-motion';
import LegalHero from '@/components/LegalHero';

const sections = [
  {
    title: '1. Introduction',
    content: 'Indie Relic (hereinafter referred to as "we," "us," or "our") is committed to protecting the privacy of our users. This Privacy Policy outlines the information we collect, how we use it, and the choices you have regarding your personal information.',
  },
  {
    title: '2. Information Collection',
    content: 'We may collect personal information, including but not limited to your name, email address, shipping address, and contact number, when you visit our website www.indierelic.com.',
  },
  {
    title: '3. Use of Information',
    content: 'We use the collected information to enhance your experience, fulfill orders, improve our services, and communicate with you. Your information may be used for customer support, updates on products and services, and promotional offers.',
  },
  {
    title: '4. Sharing of Information',
    content: 'We do not sell, trade, or transfer your personal information to third parties. However, we may share your information with trusted service providers who assist us in operating our website, conducting business, or servicing you.',
  },
  {
    title: '5. Security',
    content: 'We employ reasonable security measures to protect your information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the internet or electronic storage is entirely secure, and we cannot guarantee absolute security.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-navy">
      <LegalHero title="Privacy policy" />

      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-20 space-y-10 text-cream">
        {sections.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
          >
            <h2 className="font-bold text-lg mb-2">{s.title}</h2>
            <p className="text-cream/85 leading-relaxed">{s.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
