import { notFound } from 'next/navigation';
import { read } from '@/lib/cms/store';
import { unslugifyState } from '@/lib/stateCrafts';
import StateCraftClient from './StateCraftClient';

export const dynamic = 'force-dynamic';

export default async function StateCraftPage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const stateName = unslugifyState(state);
  if (!stateName) notFound();

  const [crafts, products] = await Promise.all([read('crafts'), read('products')]);
  const craft = crafts.find((c) => c.state === stateName);
  if (!craft) notFound();

  return <StateCraftClient craft={craft} crafts={crafts} products={products} stateName={stateName} />;
}
