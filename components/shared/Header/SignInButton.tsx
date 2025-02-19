'use client';

import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

function SignInButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  const callbackUrl =
    pathname !== '/'
      ? encodeURIComponent(
          queryString ? `${pathname}?${queryString}` : pathname
        )
      : '';
  const href = callbackUrl
    ? `/sign-in?callbackUrl=${callbackUrl}`
    : '/sign-in';

  return (
    <Button asChild>
      <Link href={href}>
        <UserIcon /> Sign-in
      </Link>
    </Button>
  );
}

export default SignInButton;
