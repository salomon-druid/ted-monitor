import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedPaths = ['/dashboard', '/notices'];
  const isProtected = protectedPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/')
  );

  // Check for auth token cookie
  const accessToken = request.cookies.get('sb-access-token')?.value;

  if (isProtected && !accessToken) {
    const redirectUrl = new URL('/auth', request.url);
    redirectUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect logged-in users away from /auth
  if (request.nextUrl.pathname === '/auth' && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/notices/:path*', '/auth'],
};
