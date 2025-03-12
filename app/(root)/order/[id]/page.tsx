import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getOrderById } from '@/lib/actions/order.actions';
import OrderDetailsTable from './OrderDetailsTable';
import { ShippingAddress } from '@/types';

export const metadata: Metadata = {
  title: 'Order Details',
};

async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();
  const userOwnsOrder = order.userId === session?.user?.id;
  const userIsAdmin = session?.user?.role === 'admin';

  if (!userOwnsOrder || !userIsAdmin)
    return redirect('/unauthorized');

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={userIsAdmin}
      />
    </>
  );
}

export default OrderDetailsPage;
