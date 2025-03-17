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

import { requireAdmin } from '@/lib/auth-guard';
import {
  deleteOrder,
  getAllOrders,
} from '@/lib/actions/order.actions';
import {
  formatCurrency,
  formatDateTime,
  formatId,
} from '@/lib/utils';
import { Button } from '@/components/ui/button';
import DeleteDialog from '@/components/shared/Delete-Dialog';

export const metadata: Metadata = {
  title: 'Admin Orders',
};

async function AdminOrdersPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  const { data: orders, totalPages } = await getAllOrders({
    page: currentPage,
  });

  if (orders.length === 0)
    return <div>There are no orders in the system.</div>;

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
                <TableCell className='flex gap-2'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
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

export default AdminOrdersPage;
