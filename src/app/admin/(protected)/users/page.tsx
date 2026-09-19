import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/cms/auth';
import { read } from '@/lib/cms/store';
import { can } from '@/lib/cms/roles';
import { publicUser } from '@/lib/cms/users';
import UsersEditor from './UsersEditor';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const user = await currentUser();
  if (!user || !can(user.role, 'users')) redirect('/admin');

  const users = await read('users');
  return <UsersEditor initial={users.map(publicUser)} actorId={user.id} />;
}
