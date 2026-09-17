'use client';

import { motion } from 'framer-motion';
import LegalHero from '@/components/LegalHero';

const sections = [
  {
    title: 'NO RETURN',
    lines: [
      'We do not offer returns once the order is placed.',
      'However, exchanges are allowed. Exchange can be initiated in days post the date of delivery.',
    ],
  },
  {
    title: 'REFUND ELIGIBILITY',
    lines: ['Refunds are only applicable for orders that were not successfully delivered from our end due to shipping failure.'],
  },
  {
    title: 'DEFECTIVE OR INCORRECT ITEMS',
    lines: [
      'If you receive any defective or incorrect item, please contact us within 3 days of delivery.',
      'The first opening video is mandatory to process your request.',
      'Replacement will be arranged as per the making time of another piece. The total TAT for closing the complaints can go upto 15-30 days excluding special holidays.',
      'Contact us at: support@indierelic.com',
      'You can alternatively reach out to us at +91 00000 00000',
    ],
  },
  {
    title: 'CANCELLATION POLICY',
    lines: ['No cancellations are allowed once the order is placed.'],
  },
  {
    title: 'REPLACEMENT POLICY',
    lines: ['Complaint must be raised within 2 days of delivery along with the first opening video.'],
  },
  {
    title: 'QUALITY CHECK',
    lines: ['Replacements will only be processed after a quality check by INDIE RELIC Experts.'],
  },
  {
    title: 'INELIGIBLE FOR REPLACEMENT',
    lines: ['Customised or discounted products.', 'Items damaged due to improper handling or installation.'],
  },
  {
    title: 'ELIGIBLE FOR REPLACEMENT IF:',
    lines: [
      'The item is defective',
      'The item was damaged in transit',
      'Product was missing from the package',
      'The wrong item was received',
      'Note: The item must be unused, in its original packaging and include all accessories.',
    ],
  },
  {
    title: 'ADDITIONAL INFORMATION',
    lines: [],
  },
  {
    title: 'UNDELIVERABLE ORDERS',
    lines: ['If your order is marked as delivered but you haven\'t received it, you must raise a complaint within 24 hours.'],
  },
  {
    title: 'OTP VERIFIED DELIVERIES / INCORRECT DETAILS',
    lines: ['If the delivery was OTP-verified or incorrect shipping details were provided, INDIE RELIC will not be held responsible.'],
  },
  {
    title: 'PACKAGE CONDITION',
    lines: ['Do not accept any parcel if the outer packaging appears torn or damaged.'],
  },
  {
    title: 'REQUIRED PROOF',
    lines: [
      'In case of damaged or defective items, customers must provide clear images or videos before any replacement can be processed.',
      'All communication should be directed to: support@indierelic.com',
    ],
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-navy">
      <LegalHero title={'Return\npolicy'} />

      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-20 space-y-8 text-cream">
        {sections.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (idx % 6) * 0.05 }}
          >
            <h2 className="font-bold mb-1">{s.title}</h2>
            {s.lines.map((line, i) => (
              <p key={i} className="text-cream/85 leading-relaxed text-sm">{line}</p>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
