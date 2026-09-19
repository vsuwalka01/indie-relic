import { redirect } from 'next/navigation';
import { isAuthenticated, isAdminConfigured } from '@/lib/cms/auth';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await isAuthenticated()) redirect('/admin');
  return <LoginForm configured={isAdminConfigured()} />;
}
