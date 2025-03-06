'use client';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { Button } from '../ui/button';

function Pagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const buildPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const goToPage = (pageNumber: number) => {
    const url = buildPageURL(pageNumber);
    router.push(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='flex items-center gap-4'>
      <Button
        size='lg'
        variant='outline'
        className='w-28'
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        Previous
      </Button>
      <span className='text-sm'>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        size='lg'
        variant='outline'
        className='w-28'
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
