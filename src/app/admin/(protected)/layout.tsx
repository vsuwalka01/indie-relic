import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/cms/auth';
import { storageMode } from '@/lib/cms/store';
import { publicUser } from '@/lib/cms/users';
import AdminChrome from '../AdminChrome';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect('/admin/login');

  return (
    <AdminChrome storage={storageMode()} user={publicUser(user)}>
      {children}
    </AdminChrome>
  );
}
