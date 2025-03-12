import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';

  if (!isAdmin) redirect('/unauthorized');

  return session;
}
