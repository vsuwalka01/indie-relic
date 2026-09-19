import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/cms/auth';
import { read } from '@/lib/cms/store';
import { can } from '@/lib/cms/roles';
import CouponsEditor from './CouponsEditor';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const user = await currentUser();
  if (!user || !can(user.role, 'coupons')) redirect('/admin');

  return <CouponsEditor initial={await read('coupons')} />;
}
