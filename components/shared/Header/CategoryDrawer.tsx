import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { getAllCategories } from '@/lib/actions/product.actions';
import { MenuIcon, X } from 'lucide-react';
import Link from 'next/link';

async function CategoryDrawer() {
  const categories = await getAllCategories();

  return (
    <Drawer direction='left'>
      <DrawerTrigger asChild>
        <Button size='icon' variant='outline'>
          <MenuIcon className='!h-5 !w-5' />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-full max-w-sm pt-2 rounded-none rounded-r-[10px] [&>div:first-child]:hidden'>
        <DrawerHeader className='flex-between'>
          <DrawerTitle>Select a category</DrawerTitle>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              <X className='!h-5 !w-5' />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className='space-y-1'>
          {categories.map(({ category, _count }) => (
            <Button
              variant='ghost'
              className='w-full justify-start'
              key={category}
              asChild
            >
              <DrawerClose asChild>
                <Link href={`/search?category=${category}`}>
                  {category} ({_count})
                </Link>
              </DrawerClose>
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default CategoryDrawer;
