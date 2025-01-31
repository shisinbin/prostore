import Link from 'next/link';
import {
  EllipsisVertical,
  ShoppingCart,
  UserIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import DarkLightToggle from './DarkLightToggle';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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
      <DarkLightToggle />
      <Button asChild variant='ghost'>
        <Link href='/cart'>
          <ShoppingCart /> Cart
        </Link>
      </Button>
      <Button asChild>
        <Link href='/sign-in'>
          <UserIcon /> Sign-in
        </Link>
      </Button>
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
          <DarkLightToggle />
          <Button asChild variant='ghost'>
            <Link href='/cart'>
              <ShoppingCart /> Cart
            </Link>
          </Button>
          <Button asChild>
            <Link href='/sign-in'>
              <UserIcon /> Sign-in
            </Link>
          </Button>
          <SheetDescription />
        </SheetContent>
      </Sheet>
    </nav>
  );
}

export default Menu;
