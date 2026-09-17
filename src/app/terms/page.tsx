'use client';

import { motion } from 'framer-motion';
import LegalHero from '@/components/LegalHero';

const paragraphs = [
  'Welcome to INDIE RELIC. The following Terms of Service ("TOS") are between you and INDIE RELIC and constitute a legal agreement that governs your use of the product(s) you purchased from INDIE RELIC. By purchasing our products, you are agreeing to these terms.',
  'Orders. All orders placed are subject to acceptance by INDIE RELIC, and we may choose not to accept orders for any reason. All prices are subject to change without notice.',
  'We do not offer returns once the order is placed. However, exchanges are allowed within the same price range or higher. Exchange can be initiated in 2 days post the date of delivery. Approved returns are issued as store credit, minus a 2% restocking fee. To begin the exchange process, visit our returns portal.',
  'Product Descriptions. We try to provide accurate depictions and descriptions of our products. However, we do not warrant that product descriptions are accurate, complete, reliable, current, or error-free. If a product is not as described, your sole remedy is to return it in an unused condition.',
  'Intellectual Property. All content and designs included on this site are owned by INDIE RELIC and/or its suppliers and protected by Indian and international copyright laws.',
  'Limitation of Liability. INDIE RELIC shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if INDIE RELIC has been advised of the possibility of such damages.',
  'Changes to the Terms of Service. You can review the most current version of the TOS at any time on this page. We reserve the right to update, change or replace any part of these TOS by posting updates and/or changes to our website. Your continued use of our website following the posting of any changes constitutes acceptance of those changes.',
  'Contact. If you have any questions about these Terms of Service, please contact us at support@indierelic.com.',
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-navy">
      <LegalHero title="Terms of Service" />

      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-20 space-y-6 text-cream">
        {paragraphs.map((p, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="text-cream/85 leading-relaxed"
          >
            {p}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
