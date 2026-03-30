import { supabase, Notice } from '@/lib/supabase';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatValue(value: number | null, currency: string | null): string {
  if (!value) return '—';
  return `${(value / 1000).toFixed(0)}k ${currency || 'EUR'}`;
}

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
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 bg-background min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark">Notices</h1>
          <p className="text-gray-500 text-sm mt-1">
            {result.count.toLocaleString()} procurement notices
          </p>
        </div>

        {/* Filters */}
        <form className="card p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Search</label>
              <input
                type="text"
                name="search"
                defaultValue={searchParams.search || ''}
                placeholder="Title, buyer, keyword..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Country</label>
              <select
                name="country"
                defaultValue={searchParams.country || ''}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-all"
              >
                <option value="">All countries</option>
                {filters.countries.map((c: string) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Type</label>
              <select
                name="type"
                defaultValue={searchParams.type || ''}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-all"
              >
                <option value="">All types</option>
                {filters.types.map((t: string) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="btn-primary !py-2.5 flex-1 text-sm"
              >
                Filter
              </button>
              <Link
                href="/notices"
                className="btn-secondary !py-2.5 text-sm"
              >
                Reset
              </Link>
            </div>
          </div>
        </form>

        {/* Results */}
        <div className="card">
          {result.notices.length === 0 ? (
            <div className="p-16 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-gray-500 font-medium">No notices match your filters</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {result.notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="block p-5 hover:bg-gray-50/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-dark group-hover:text-primary transition-colors">
                        {notice.title || 'Untitled Notice'}
                      </h3>
                      {notice.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {notice.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5">
                        {notice.buyer_name && (
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                            </svg>
                            {notice.buyer_name}
                          </span>
                        )}
                        {notice.country && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                            {notice.country}
                          </span>
                        )}
                        {notice.cpv_description && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            </svg>
                            {notice.cpv_description}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {formatDate(notice.publication_date)}
                        </span>
                        {notice.deadline && (
                          <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDate(notice.deadline)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {notice.estimated_value && (
                        <div className="text-sm font-semibold text-primary">
                          {formatValue(notice.estimated_value, notice.estimated_value_currency)}
                        </div>
                      )}
                      {notice.notice_type && (
                        <span className="inline-block mt-1.5 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">
                          {notice.notice_type}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Page {result.page} of {result.totalPages}
              </span>
              <div className="flex gap-2">
                {result.page > 1 && (
                  <Link
                    href={`/notices?${new URLSearchParams({ ...searchParams, page: String(result.page - 1) }).toString()}`}
                    className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    ← Previous
                  </Link>
                )}
                {result.page < result.totalPages && (
                  <Link
                    href={`/notices?${new URLSearchParams({ ...searchParams, page: String(result.page + 1) }).toString()}`}
                    className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
