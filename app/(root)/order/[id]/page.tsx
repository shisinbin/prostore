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

  // Redirect the user if they don't own the order
  if (!userOwnsOrder) return redirect('/'); // redirects to homepage for now

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      />
    </>
  );
}

export default OrderDetailsPage;
