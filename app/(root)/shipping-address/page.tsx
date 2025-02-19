import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { ShippingAddress } from '@/types';
import ShippingAddressForm from './ShippingAddressForm';
import CheckoutSteps from '@/components/shared/CheckoutSteps';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

async function ShippingAddressPage() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect('/cart');

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) redirect('/sign-in'); // throw new Error('No user ID');

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm
        address={user.address as ShippingAddress}
      />
    </>
  );
}

export default ShippingAddressPage;
