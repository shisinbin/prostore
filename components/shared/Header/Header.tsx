import Link from 'next/link';
import Image from 'next/image';

import { APP_NAME } from '@/lib/constants';
import Menu from './Menu';
import CategoryDrawer from './CategoryDrawer';

function Header() {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <CategoryDrawer />
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

        <Menu />
      </div>
    </header>
  );
}

export default Header;
