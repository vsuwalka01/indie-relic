import { read } from '@/lib/cms/store';
import AboutClient from './AboutClient';

export default async function AboutPage() {
  const crafts = await read('crafts');
  return <AboutClient crafts={crafts.filter(craft => ['Rajasthan', 'Karnataka', 'Punjab'].includes(craft.state))} />;
}
