'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';

const links = [
  {
    title: 'Profile',
    href: '/user/profile',
  },
  {
    title: 'Orders',
    href: '/user/orders',
  },
];

function MainNav({
  className,
  ...delegated
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn('space-x-4 lg:space-x-6', className)}
      {...delegated}
    >
      {links.map(({ title, href }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname.includes(href) ? '' : 'text-muted-foreground'
          )}
        >
          {title}
        </Link>
      ))}
    </nav>
  );
}

export default MainNav;
