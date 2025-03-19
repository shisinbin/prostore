'use client';
import React from 'react';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { Input } from '@/components/ui/input';

function AdminSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const formActionUrl = pathname.includes('/admin/orders')
    ? '/admin/orders'
    : pathname.includes('/admin/users')
    ? '/admin/users'
    : '/admin/products';

  const [queryValue, setQueryValue] = React.useState(
    searchParams.get('query') || ''
  );

  React.useEffect(() => {
    setQueryValue(searchParams.get('query') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (queryValue) {
      params.set('query', queryValue);
    } else {
      params.delete('query');
    }
    router.push(`${formActionUrl}?${params}`);
  };

  return (
    // <form action={formActionUrl} method='GET'>
    <form onSubmit={handleSearch}>
      <Input
        type='search'
        placeholder='Search...'
        className='md:w-[100px] lg:w-[300px]'
        name='query'
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
      />
      <button className='sr-only' type='submit'>
        Search
      </button>
    </form>
  );
}

export default AdminSearch;
