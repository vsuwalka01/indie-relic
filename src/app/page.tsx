import { read } from '@/lib/cms/store';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, settings] = await Promise.all([read('products'), read('settings')]);
  return <HomeClient products={products} settings={settings} />;
}
