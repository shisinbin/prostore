import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrderSummary } from '@/lib/actions/order.actions';
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
} from '@/lib/utils';
import {
  BadgeDollarSign,
  Barcode,
  CreditCard,
  LucideIcon,
  Users,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import Charts from './Charts';
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

async function AdminOverviewPage() {
  await requireAdmin();

  const summary = await getOrderSummary();

  return (
    <div className='space-y-2'>
      <h1 className='h2-bold'>Dashboard</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <SummaryCard title='Total Revenue' Icon={BadgeDollarSign}>
          {formatCurrency(summary?.totalSales || 0)}
        </SummaryCard>
        <SummaryCard title='Sales' Icon={CreditCard}>
          {formatNumber(summary.ordersCount)}
        </SummaryCard>
        <SummaryCard title='Customers' Icon={Users}>
          {formatNumber(summary.usersCount)}
        </SummaryCard>
        <SummaryCard title='Products' Icon={Barcode}>
          {formatNumber(summary.productsCount)}
        </SummaryCard>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts data={{ salesData: summary.salesData }} />
          </CardContent>
        </Card>

        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BUYER</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary?.latestSales &&
                summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name
                        ? order.user.name
                        : 'Deleted User'}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(order.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>Details</Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {Icon && <Icon />}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{children}</div>
      </CardContent>
    </Card>
  );
}

export default AdminOverviewPage;
