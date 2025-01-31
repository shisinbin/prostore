import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function NotFoundPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Image
        src='/images/logo.svg'
        width={48}
        height={48}
        alt={`${APP_NAME} logo`}
        priority={true}
      />
      <div className='p-6 rounded-lg shadow-md text-center w-1/3'>
        <h1 className='text-3xl font-bold mb-4'>Not Found</h1>
        <p className='text-destructive'>
          Sorry, the page you are looking for does not exist.
        </p>
        <Button variant='outline' className='mt-2 ml-2' asChild>
          <Link href='/'>Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
