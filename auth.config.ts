import type { NextAuthConfig } from 'next-auth';

const commonAuthConfig = {
  debug: true,
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
