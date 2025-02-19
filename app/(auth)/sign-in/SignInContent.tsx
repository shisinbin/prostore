'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import CredentialsSignInForm from './CredentialsSignInForm';
import { APP_NAME } from '@/lib/constants';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      window.location.href = callbackUrl;
    }
  }, [status, session, callbackUrl]);

  return (
    <>
      <Card className='max-w-md'>
        <CardHeader className='space-y-4'>
          <Link href='/' className='flex-center'>
            <Image
              src='/images/logo.svg'
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
          </Link>
          <CardTitle className='text-center'>Sign In</CardTitle>
          <CardDescription className='text-center'>
            Sign-in to your account.
          </CardDescription>
          <CardContent className='p-0'>
            <CredentialsSignInForm />
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
}

export default SignInContent;
