import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }); },
      },
    }
  );
}

// GET — Fetch current user's alert preferences
export async function GET() {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('alert_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    preferences: data || {
      enabled: false,
      min_score: 70,
      cpv_codes: [],
      countries: [],
      frequency: 'daily',
    },
  });
}

// PUT — Update alert preferences
export async function PUT(request: NextRequest) {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { enabled, min_score, cpv_codes, countries, frequency } = body;

  // Validate
  if (typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'enabled must be boolean' }, { status: 400 });
  }
  if (min_score !== undefined && (typeof min_score !== 'number' || min_score < 0 || min_score > 100)) {
    return NextResponse.json({ error: 'min_score must be 0-100' }, { status: 400 });
  }
  if (frequency && !['daily', 'instant', 'weekly'].includes(frequency)) {
    return NextResponse.json({ error: 'frequency must be daily, instant, or weekly' }, { status: 400 });
  }

  const upsertData = {
    user_id: user.id,
    email: user.email,
    enabled,
    min_score: min_score ?? 70,
    cpv_codes: cpv_codes ?? [],
    countries: countries ?? [],
    frequency: frequency ?? 'daily',
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('alert_preferences')
    .upsert(upsertData, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ preferences: data });
}
