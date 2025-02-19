import 'next/server';

declare module 'next/server' {
  interface NextRequest {
    auth?: {
      user?: {
        name?: string | null;
        email?: string | null;
        // Add other properties as needed, e.g. id or role.
        // id?: string;
        // role?: string;
      };
      expires?: string;
    } | null;
  }
}
