// export { auth as middleware } from '@/auth';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@/auth';

export default auth(async function middleware(request: NextRequest) {
  // Check for session cart cookie
  if (!request.cookies.has('sessionCartId')) {
    // Generate new session cart id cookie
    const sessionCartId = crypto.randomUUID();

    // Clone request headers
    const newRequestHeaders = new Headers(request.headers);

    // Create new response and add the new headers
    const response = NextResponse.next({
      request: {
        headers: newRequestHeaders,
      },
    });

    // Set newly generated sessionCartId in the response cookies
    response.cookies.set('sessionCartId', sessionCartId);

    return response;
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
