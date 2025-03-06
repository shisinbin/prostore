import { Metadata } from 'next';
import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/shared/Pagination';

import { getMyOrders } from '@/lib/actions/order.actions';
import {
  formatCurrency,
  formatDateTime,
  formatId,
} from '@/lib/utils';

export const metadata: Metadata = {
  title: 'My Orders',
};

async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  const { data: orders, totalPages } = await getMyOrders({
    page: currentPage,
  });

  if (orders.length === 0)
    return <div>You have no previous orders.</div>;

  return (
    <div className='space-y-2'>
      <h2 className='h2-bold'>Orders</h2>
      <div className='overflow-x-auto space-y-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>
                  {formatCurrency(order.totalPrice)}
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'Not paid yet'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'Not delivered yet'}
                </TableCell>
                <TableCell>
                  <Link href={`/order/${order.id}`}>
                    <span className='px-2 hover:text-purple-500 transition-colors hover:underline'>
                      Details
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {Number(totalPages) > 1 && (
          <Pagination totalPages={Number(totalPages)} />
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
