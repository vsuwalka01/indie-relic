import { read } from '@/lib/cms/store';
import ProductsEditor from './ProductsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  return <ProductsEditor initial={await read('products')} />;
}
