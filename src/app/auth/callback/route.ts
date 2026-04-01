import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.session) {
        const response = NextResponse.redirect(`${origin}${next}`);
        
        // Set cookies that Supabase expects
        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;
        
        response.cookies.set('sb-access-token', accessToken, {
          path: '/',
          httpOnly: false, // Allow JS access for Supabase client
          sameSite: 'lax',
          secure: true,
          maxAge: 60 * 60 * 24 * 7,
        });
        
        response.cookies.set('sb-refresh-token', refreshToken, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
          maxAge: 60 * 60 * 24 * 30,
        });

        // Also set in localStorage-compatible format
        response.cookies.set('authenticated', 'true', {
          path: '/',
          sameSite: 'lax',
          secure: true,
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }
    } catch (e) {
      console.error('Auth error:', e);
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
}
