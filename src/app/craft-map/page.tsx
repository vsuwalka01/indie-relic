import { read } from '@/lib/cms/store';
import CraftMapClient from './CraftMapClient';

export const dynamic = 'force-dynamic';

export default async function CraftMapPage() {
  return <CraftMapClient crafts={await read('crafts')} />;
}
