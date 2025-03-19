import { getUserById } from '@/lib/actions/user.actions';
import { requireAdmin } from '@/lib/auth-guard';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UpdateUserForm from './UpdateUserForm';

export const metadata: Metadata = {
  title: 'Update User',
};

async function AdminUpdateUserPage(props: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className='space-y-8 max-w-lg mx-auto'>
      <h1 className='h2-bold'>Update User</h1>
      <UpdateUserForm user={user} />
    </div>
  );
}

export default AdminUpdateUserPage;
