import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
