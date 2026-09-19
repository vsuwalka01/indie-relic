import { read } from '@/lib/cms/store';
import SettingsEditor from './SettingsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  return <SettingsEditor initial={await read('settings')} />;
}
