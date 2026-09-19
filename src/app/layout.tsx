import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import './craft-journey.css';
import './craft-surface.css';
import './product-cards.css';
import './about-and-shopping.css';
import SiteChrome from '@/components/SiteChrome';
import { read } from '@/lib/cms/store';
import { themeToCss } from '@/lib/cms/theme';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display-fallback', display: 'swap' });

// Shared craft references and brand colours must reflect CMS saves on every page.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Indie Relic — Indian Traditions, Reimagined',
  description: 'Indie Relic bridges traditional Indian artistry and contemporary lifestyle needs, working directly with artisan clusters across India.',
  openGraph: {
    title: 'Indie Relic',
    description: 'Indian Traditions, Reimagined for Everyday Living.',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // themeToCss only emits validated hex values, so this cannot inject markup.
  const [theme, crafts] = await Promise.all([read('theme'), read('crafts')]);
  const themeCss = themeToCss(theme);
  const craftReferences = crafts.map(({ state, craft, region, tagline, productId }) => ({ state, craft, region, tagline, productId }));

  return (
    <html lang="en">
      <head>
        <style id="brand-theme" dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className={`${inter.variable} ${fraunces.variable} font-body bg-light text-primary`}>
        <SiteChrome crafts={craftReferences}>{children}</SiteChrome>
      </body>
    </html>
  );
}
