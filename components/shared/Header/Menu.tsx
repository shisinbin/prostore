import Link from 'next/link';
import { EllipsisVertical, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import DarkLightToggle from './DarkLightToggle';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from './UserButton';

function Menu() {
  return (
    <div>
      <DesktopNav />
      <MobileNav />
    </div>
  );
}

function DesktopNav() {
  return (
    <nav className='hidden md:flex w-full max-w-xs gap-1'>
      {/* <DarkLightToggle /> */}
      <Button asChild variant='ghost'>
        <Link href='/cart'>
          <ShoppingCart /> Cart
        </Link>
      </Button>
      <UserButton />
    </nav>
  );
}

function MobileNav() {
  return (
    <nav className='md:hidden'>
      <Sheet>
        <SheetTrigger className='align-middle'>
          <EllipsisVertical />
        </SheetTrigger>
        <SheetContent className='flex flex-col items-start'>
          <SheetTitle>Menu</SheetTitle>
          {/* <DarkLightToggle /> */}
          <Button asChild variant='ghost'>
            <Link href='/cart'>
              <ShoppingCart /> Cart
            </Link>
          </Button>
          <UserButton />
          <SheetDescription />
        </SheetContent>
      </Sheet>
    </nav>
  );
}

export default Menu;
