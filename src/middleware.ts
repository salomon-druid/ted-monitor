import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedPaths = ['/dashboard', '/notices'];
  const path = request.nextUrl.pathname;
  
  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(p + '/')
  );

  // Check for auth cookies
  const hasToken = request.cookies.get('sb-access-token')?.value;
  const hasAuth = request.cookies.get('authenticated')?.value;
  const isAuthenticated = !!(hasToken || hasAuth);

  // Let /auth pass through (it handles its own auth via URL hash)
  if (path === '/auth') {
    return NextResponse.next();
  }

  // Protected routes require auth
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/notices/:path*', '/auth'],
};
