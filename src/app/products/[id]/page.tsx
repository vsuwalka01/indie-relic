import { notFound } from 'next/navigation';
import { read } from '@/lib/cms/store';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await read('products');
  const product = products.find((p) => String(p.id) === id);
  if (!product) notFound();

  return <ProductDetailClient product={product} products={products} />;
}
