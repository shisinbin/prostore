import { Metadata } from 'next';
import Link from 'next/link';

import { requireAdmin } from '@/lib/auth-guard';
import {
  deleteProduct,
  getAllProducts,
} from '@/lib/actions/product.actions';
import { formatCurrency, formatId } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/shared/Pagination';
import DeleteDialog from '@/components/shared/Delete-Dialog';
import { X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Products',
};

async function AdminProductsPage(props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) {
  await requireAdmin();

  const searchParams = await props.searchParams;

  const currentPage = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const category = searchParams.category || '';

  const { data: products, totalPages } = await getAllProducts({
    page: currentPage,
    query: searchText,
    category,
  });

  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <div className='flex items-center gap-5'>
          <h1 className='h2-bold'>Products</h1>
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
                <Link href='/admin/products'>
                  <X />
                </Link>
              </Button>
            </div>
          )}
        </div>
        <Button asChild>
          <Link href='/admin/products/create'>Create Product</Link>
        </Button>
      </div>

      <div className='overflow-x-auto space-y-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead className='text-right'>PRICE</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>RATING</TableHead>
              <TableHead className='w-[100px]'>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{formatId(product.id)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell className='text-right'>
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.rating}</TableCell>
                <TableCell className='flex gap-2'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/products/${product.id}`}>
                      Edit
                    </Link>
                  </Button>
                  <DeleteDialog
                    id={product.id}
                    action={deleteProduct}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {Number(totalPages) > 1 && (
          <Pagination totalPages={totalPages} />
        )}
      </div>
    </div>
  );
}

export default AdminProductsPage;
