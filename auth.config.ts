import type { NextAuthConfig } from 'next-auth';

const commonAuthConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  providers: [],
  callbacks: {
    authorized() {
      return true;
    },
  },
} satisfies NextAuthConfig;

export default commonAuthConfig;
