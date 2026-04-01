import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedPaths = ['/dashboard', '/notices'];
  const isProtected = protectedPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/')
  );

  // Check multiple auth indicators
  const hasAccessToken = request.cookies.get('sb-access-token')?.value;
  const hasAuthFlag = request.cookies.get('authenticated')?.value;
  const isAuthenticated = !!(hasAccessToken || hasAuthFlag);

  if (isProtected && !isAuthenticated) {
    const redirectUrl = new URL('/auth', request.url);
    redirectUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect logged-in users from /auth to /dashboard
  if (request.nextUrl.pathname === '/auth' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/notices/:path*', '/auth'],
};
