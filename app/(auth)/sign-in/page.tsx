import { Metadata } from 'next';
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
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign In',
};

async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || '/');
  }

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

export default SignInPage;
