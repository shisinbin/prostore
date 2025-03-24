import { Skeleton } from '@/components/ui/skeleton';

function SearchSkeleton() {
  return (
    <div className='flex gap-2'>
      <Skeleton className='w-[180px] h-10 rounded-md' />
      <Skeleton className='md:w-[100px] lg:w-[300px] h-10 rounded-md' />
      <Skeleton className='w-10 h-10 rounded-md' />
    </div>
  );
}

export default SearchSkeleton;
