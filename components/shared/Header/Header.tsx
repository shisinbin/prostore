import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { APP_NAME } from '@/lib/constants';
import Menu from './Menu';
import CategoryDrawer from './CategoryDrawer';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllCategories } from '@/lib/actions/product.actions';
import SearchWrapper from './SearchWrapper';
import SearchSkeleton from './SearchSkeleton';

function Header() {
  const categoriesPromise = getAllCategories();

  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <React.Suspense
            fallback={
              <Button size='icon' variant='outline' disabled={true}>
                <MenuIcon className='!h-5 !w-5' />
              </Button>
            }
          >
            <CategoryDrawer categoriesPromise={categoriesPromise} />
          </React.Suspense>
          <Link href='/' className='flex-start ml-3'>
            <Image
              src='/images/logo.svg'
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority={true}
            />
            <span className='hidden lg:block font-bold text-2xl ml-3 font-robotoSlab'>
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className='hidden md:block'>
          <React.Suspense fallback={<SearchSkeleton />}>
            <SearchWrapper categoriesPromise={categoriesPromise} />
          </React.Suspense>
        </div>

        <Menu />
      </div>
    </header>
  );
}

export default Header;
