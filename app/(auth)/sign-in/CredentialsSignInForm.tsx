'use client';

import React from 'react';
// import { useFormStatus } from 'react-dom';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signInWithCredentials } from '@/lib/actions/user.actions';
import { signInDefaultValues } from '@/lib/constants';
// import { useSearchParams } from 'next/navigation';

const initialState = {
  success: false,
  message: '',
};

function CredentialsSignInForm() {
  const [state, formAction, pending] = React.useActionState(
    signInWithCredentials,
    initialState
  );

  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl');

  return (
    <form action={formAction} className='space-y-6'>
      {/* {callbackUrl && (
        <input type='hidden' name='redirectTo' value={callbackUrl} />
      )} */}
      <div>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          required
          autoComplete='email'
          defaultValue={signInDefaultValues.email}
          className='min-w-[300px]'
        />
      </div>
      <div>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          name='password'
          type='password'
          required
          autoComplete='password'
          defaultValue={signInDefaultValues.password}
          className='min-w-[300px]'
        />
      </div>

      <Button disabled={pending} className='w-full' variant='default'>
        {pending ? 'Signing in...' : 'Sign In'}
      </Button>

      <p
        aria-live='polite'
        className={`text-center ${
          state?.success ? '' : 'text-destructive'
        }`}
      >
        {state?.message}
      </p>

      <div className='text-sm text-center text-muted-foreground'>
        Don&apos;t have an account?{' '}
        <Link
          href='/sign-up'
          target='_self'
          className='font-medium text-primary hover:text-primary/80 hover:underline transition-colors'
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
}

// function SubmitButton() {
//   const { pending } = useFormStatus();

//   return (
//     <Button disabled={pending} className='w-full' variant='default'>
//       {pending ? 'Signing in...' : 'Sign In'}
//     </Button>
//   );
// }

export default CredentialsSignInForm;
