import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ToastHost from '@/components/ToastHost';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Indie Relic — Indian Traditions, Reimagined',
  description: 'Indie Relic bridges traditional Indian artistry and contemporary lifestyle needs, working directly with artisan clusters across India.',
  openGraph: {
    title: 'Indie Relic',
    description: 'Indian Traditions, Reimagined for Everyday Living.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-body bg-light text-primary`}>
        <Header />
        <ToastHost />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
