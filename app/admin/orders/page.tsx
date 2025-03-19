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
import { X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Orders',
};

async function AdminOrdersPage(props: {
  searchParams: Promise<{ page: string; query: string }>;
}) {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const searchText = searchParams?.query || '';

  const { data: orders, totalPages } = await getAllOrders({
    page: currentPage,
    query: searchText,
  });

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-5'>
        <h1 className='h2-bold'>Orders</h1>
        {searchText && (
          <div className='flex items-center gap-2 bg-muted pl-3 py-0 rounded-md'>
            <span className='text-sm'>
              Filtered by <i>&quot;{searchText}&quot;</i>
            </span>

            <Button
              asChild
              size='sm'
              variant='ghost'
              className='hover:text-destructive'
            >
              <Link href='/admin/orders'>
                <X />
              </Link>
            </Button>
          </div>
        )}
      </div>
      {orders && orders?.length > 0 ? (
        <div className='overflow-x-auto space-y-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>BUYER</TableHead>
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
                  <TableCell>{order.user.name}</TableCell>
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
                    <DeleteDialog
                      id={order.id}
                      action={deleteOrder}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {Number(totalPages) > 1 && (
            <Pagination totalPages={Number(totalPages)} />
          )}
        </div>
      ) : (
        <div className='pt-5'>No results.</div>
      )}
    </div>
  );
}

export default AdminOrdersPage;
