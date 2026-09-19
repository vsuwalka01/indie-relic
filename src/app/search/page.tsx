import { read } from '@/lib/cms/store';
import SearchClient from './SearchClient';

export const dynamic = 'force-dynamic';

export default async function SearchPage() {
  return <SearchClient products={await read('products')} />;
}
