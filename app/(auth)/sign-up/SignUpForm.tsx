'use client';

import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signUpUser } from '@/lib/actions/user.actions';
import { signUpDefaultValues } from '@/lib/constants';
// import { useSearchParams } from 'next/navigation';

const initialState = {
  success: false,
  message: '',
};

function SignUpForm() {
  const [state, formAction, pending] = React.useActionState(
    signUpUser,
    initialState
  );

  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl');

  return (
    <form action={formAction} className='space-y-4'>
      {/* {callbackUrl && (
        <input type='hidden' name='redirectTo' value={callbackUrl} />
      )} */}
      <div>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          type='text'
          autoComplete='name'
          defaultValue={signUpDefaultValues.name}
          className='min-w-[300px]'
        />
      </div>
      <div>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          autoComplete='email'
          defaultValue={signUpDefaultValues.email}
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
          defaultValue={signUpDefaultValues.password}
          className='min-w-[300px]'
        />
      </div>
      <div>
        <Label htmlFor='confirmPassword'>Confirm Password</Label>
        <Input
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          required
          autoComplete='confirmPassword'
          defaultValue={signUpDefaultValues.confirmPassword}
          className='min-w-[300px]'
        />
      </div>

      <Button disabled={pending} className='w-full' variant='default'>
        {pending ? 'Submitting...' : 'Sign Up'}
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
        Already have an account?{' '}
        <Link
          href='/sign-in'
          target='_self'
          className='font-medium text-primary hover:text-primary/80 hover:underline transition-colors'
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}

export default SignUpForm;
