import { NextRequest, NextResponse } from 'next/server';

// Middleware disabled — no route protection.
// Auth will be handled client-side when Stripe integration is ready.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
