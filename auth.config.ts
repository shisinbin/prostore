import type { NextAuthConfig } from 'next-auth';

import { PROTECTED_ROUTES } from '@/lib/constants';

const commonAuthConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  providers: [],
  callbacks: {
    authorized({ request, auth }: any) {
      return true;
    },
  },
} satisfies NextAuthConfig;

export default commonAuthConfig;
