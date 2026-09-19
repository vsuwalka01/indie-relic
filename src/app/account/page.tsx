import { currentCustomer } from '@/lib/cms/customerAuth';
import { publicCustomer } from '@/lib/cms/customers';
import AccountClient from './AccountClient';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  // Resolved on the server, so a signed-in visitor never sees the login form flash.
  const customer = await currentCustomer();
  return <AccountClient initialCustomer={customer ? publicCustomer(customer) : null} />;
}
