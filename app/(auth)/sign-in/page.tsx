import { SessionProvider } from 'next-auth/react';
import SignInContent from './SignInContent';

function SignInPage() {
  return (
    <SessionProvider>
      <SignInContent />
    </SessionProvider>
  );
}

export default SignInPage;
