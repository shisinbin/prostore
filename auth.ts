import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';

import commonAuthConfig from '@/auth.config';
import { cookies } from 'next/headers';

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
    async session({ session, token }: any) {
      // Set some details from the token to the user
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to the token
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.name = user.name;

        // Persist cart between signed out and signed in
        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId =
            cookiesObject.get('sessionCartId')?.value;

          if (sessionCartId) {
            // Get the cart from database
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart && sessionCart.userId !== user.id) {
              // Delete the user's old cart, if they had one
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              // Assign new cart to current user
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }

        /*
         * Below is redundant due to zod validation on name field
         * If we change zod validation to make name optional, then
         * this code should go in the sign-in action instead,
         * as it is only necessary to run this once and not
         * every time jwt callback is invoked
         */
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

      // Update the name value on token when session is updated -
      // this currently only happens when profile form is updated
      if (trigger === 'update' && session?.user?.name) {
        token.name = session.user.name;
      }

      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } =
  NextAuth(authConfig);
