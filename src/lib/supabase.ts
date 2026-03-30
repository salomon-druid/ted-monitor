import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set');
  }
  
  _supabase = createClient(supabaseUrl, supabaseKey);
  return _supabase;
}

// For backward compatibility
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  }
});

export interface Notice {
  id: number;
  notice_id: string | null;
  title: string | null;
  description: string | null;
  cpv_code: string | null;
  cpv_description: string | null;
  notice_type: string | null;
  buyer_name: string | null;
  publication_date: string | null;
  deadline: string | null;
  country: string | null;
  estimated_value: number | null;
  estimated_value_currency: string | null;
  procedure_type: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}
