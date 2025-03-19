import { Metadata } from 'next';
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions';
import { requireAdmin } from '@/lib/auth-guard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DeleteDialog from '@/components/shared/Delete-Dialog';
import Pagination from '@/components/shared/Pagination';
import { capitaliseWord, formatId } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Users',
};

async function AdminUsersPage(props: {
  searchParams: Promise<{ page: string; query: string }>;
}) {
  await requireAdmin();

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const searchText = searchParams?.query || '';

  const { data: users, totalPages } = await getAllUsers({
    page: currentPage,
    query: searchText,
  });

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-5'>
        <h1 className='h2-bold'>Users</h1>
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
              <Link href='/admin/users'>
                <X />
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className='overflow-x-auto space-y-4'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'admin' ? (
                    <Badge variant='default'>
                      {capitaliseWord(user.role)}
                    </Badge>
                  ) : (
                    <Badge variant='secondary'>
                      {capitaliseWord(user.role)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className='flex gap-2'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
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

export default AdminUsersPage;
