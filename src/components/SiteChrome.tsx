'use client';

import { usePathname } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ToastHost from '@/components/ToastHost';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import CraftJourney, { referenceForPage, type CraftReference } from '@/components/CraftJourney';
import CraftSurface from '@/components/CraftSurface';
import { getCraftTheme } from '@/lib/craftThemes';

/**
 * The CMS lives under the same root layout as the storefront, but none of the
 * shop chrome belongs there — a nav bar, custom cursor and hijacked scrolling
 * would all get in the way of editing.
 */
export default function SiteChrome({ children, crafts }: { children: React.ReactNode; crafts: CraftReference[] }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return <>{children}</>;
  const pageCraft = referenceForPage(pathname, crafts);

  return (
    <MotionConfig reducedMotion="user">
      <CraftSurface motif={getCraftTheme(pageCraft?.state ?? 'Rajasthan').motif}>
      <ScrollProgress />
      <BackToTop />
      <Header />
      <ToastHost />
      <main className="min-h-screen crafted-content">
        <PageTransition><div className="crafted-page">{children}</div></PageTransition>
        {pathname === '/craft-map' && pageCraft && <CraftJourney key={pathname} crafts={crafts} initialState={pageCraft.state} />}
      </main>
      <Footer />
      </CraftSurface>
    </MotionConfig>
  );
}
