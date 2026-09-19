import { read } from '@/lib/cms/store';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  return <ProductsClient products={await read('products')} />;
}
