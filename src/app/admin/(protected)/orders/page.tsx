import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/cms/auth';
import { read } from '@/lib/cms/store';
import { can } from '@/lib/cms/roles';
import { publicUser } from '@/lib/cms/users';
import OrdersEditor from './OrdersEditor';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const user = await currentUser();
  if (!user || !can(user.role, 'orders')) redirect('/admin');

  const [orders, users] = await Promise.all([read('orders'), read('users')]);

  return (
    <OrdersEditor
      initial={orders}
      team={users.filter((u) => u.active).map(publicUser)}
      canAssign={can(user.role, 'orders:assign')}
    />
  );
}
