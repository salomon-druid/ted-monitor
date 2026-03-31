import { supabase, Notice } from '@/lib/supabase';
import NoticesClient from '@/components/NoticesClient';

export const dynamic = 'force-dynamic';

async function getNotices(searchParams: { [key: string]: string | undefined }) {
  let query = supabase
    .from('notices')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (searchParams.country) {
    query = query.eq('country', searchParams.country);
  }
  if (searchParams.cpv) {
    query = query.ilike('cpv_description', `%${searchParams.cpv}%`);
  }
  if (searchParams.type) {
    query = query.eq('notice_type', searchParams.type);
  }
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,buyer_name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`);
  }

  const page = parseInt(searchParams.page || '1');
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query.range(from, to);

  return {
    notices: (data || []) as Notice[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

async function getFilterOptions() {
  const { data: countries } = await supabase
    .from('notices')
    .select('country')
    .not('country', 'is', null);

  const { data: types } = await supabase
    .from('notices')
    .select('notice_type')
    .not('notice_type', 'is', null);

  const countrySet = Array.from(new Set((countries || []).map((r: any) => r.country))).sort();
  const typeSet = Array.from(new Set((types || []).map((r: any) => r.notice_type))).sort();

  return { countries: countrySet, types: typeSet };
}

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const [result, filters] = await Promise.all([
    getNotices(searchParams),
    getFilterOptions(),
  ]);

  return (
    <NoticesClient
      notices={result.notices}
      count={result.count}
      page={result.page}
      totalPages={result.totalPages}
      countries={filters.countries}
      types={filters.types}
      searchParams={searchParams}
    />
  );
}
