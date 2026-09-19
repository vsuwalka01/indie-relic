import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/cms/auth';
import { read } from '@/lib/cms/store';
import { can } from '@/lib/cms/roles';
import ThemeEditor from './ThemeEditor';

export const dynamic = 'force-dynamic';

export default async function AdminThemePage() {
  const user = await currentUser();
  if (!user || !can(user.role, 'theme')) redirect('/admin');

  return <ThemeEditor initial={await read('theme')} />;
}
