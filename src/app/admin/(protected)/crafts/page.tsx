import { read } from '@/lib/cms/store';
import CraftsEditor from './CraftsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminCraftsPage() {
  const [crafts, products] = await Promise.all([read('crafts'), read('products')]);
  return <CraftsEditor initial={crafts} products={products} />;
}
