// export { auth as middleware } from '@/auth';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  if (!request.cookies.has('sessionCartId')) {
    const response = NextResponse.next();
    const sessionCartId = crypto.randomUUID();

    response.cookies.set('sessionCartId', sessionCartId);

    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
