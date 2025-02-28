import { Metadata } from 'next';

import CheckoutSteps from '@/components/shared/CheckoutSteps';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.actions';
import PaymentMethodForm from './PaymentMethodForm';

export const metadata: Metadata = {
  title: 'Payment Method',
};

async function PaymentMethodPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect('/sign-in'); // throw new Error('No user ID');

  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  if (!user.address) redirect('/shipping-address');

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm
        preferredPaymentMethod={user.paymentMethod}
      />
    </>
  );
}

export default PaymentMethodPage;
