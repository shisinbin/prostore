import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';

import commonAuthConfig from '@/auth.config';

export const authConfig = {
  pages: {
    ...commonAuthConfig.pages,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    ...commonAuthConfig.providers,
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password)
          return null;

        // Find user in database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and has password
        if (!user || !user.password) return null;

        // Check if password matches
        const isMatch = await compare(
          credentials.password as string,
          user.password
        );
        if (!isMatch) return null;

        // Return user data
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...commonAuthConfig.callbacks,
    async session({ session, user, trigger, token }: any) {
      // Set some details from the token to the user
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // If there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user }: any) {
      // Assign user fields to the token
      if (user) {
        token.role = user.role;

        // THIS SHOULD GO IN SIGN-IN ACTION IF NAME NOT NECESSARY
        // If user has no name then use the email
        // if (user.name === 'NO_NAME') {
        //   token.name = user.email!.split('@')[0];

        //   // Update the database to reflect the token name
        //   await prisma.user.update({
        //     where: { id: user.id },
        //     data: { name: token.name },
        //   });
        // }
      }

      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } =
  NextAuth(authConfig);
