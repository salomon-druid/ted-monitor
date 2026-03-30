import { supabase, Notice } from '@/lib/supabase';
import Link from 'next/link';

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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark">Notices</h1>
        <p className="text-gray-500 text-sm mt-1">
          {result.count.toLocaleString()} procurement notices
        </p>
      </div>

      {/* Filters */}
      <form className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Search</label>
            <input
              type="text"
              name="search"
              defaultValue={searchParams.search || ''}
              placeholder="Title, buyer, keyword..."
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Country</label>
            <select
              name="country"
              defaultValue={searchParams.country || ''}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            >
              <option value="">All countries</option>
              {filters.countries.map((c: string) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wide">Type</label>
            <select
              name="type"
              defaultValue={searchParams.type || ''}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
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
              className="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors"
            >
              Filter
            </button>
            <Link
              href="/notices"
              className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200 transition-colors"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {result.notices.length === 0 ? (
          <p className="p-8 text-center text-gray-400">No notices match your filters.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {result.notices.map((notice) => (
              <Link
                key={notice.id}
                href={`/notices/${notice.id}`}
                className="block p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-dark">
                      {notice.title || 'Untitled Notice'}
                    </h3>
                    {notice.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notice.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      {notice.buyer_name && (
                        <span className="text-xs text-gray-600">🏢 {notice.buyer_name}</span>
                      )}
                      {notice.country && (
                        <span className="text-xs text-gray-500">🌍 {notice.country}</span>
                      )}
                      {notice.cpv_description && (
                        <span className="text-xs text-gray-500">📦 {notice.cpv_description}</span>
                      )}
                      <span className="text-xs text-gray-400">📅 {formatDate(notice.publication_date)}</span>
                      {notice.deadline && (
                        <span className="text-xs text-red-500">⏰ {formatDate(notice.deadline)}</span>
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
                      <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
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
                  className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  ← Previous
                </Link>
              )}
              {result.page < result.totalPages && (
                <Link
                  href={`/notices?${new URLSearchParams({ ...searchParams, page: String(result.page + 1) }).toString()}`}
                  className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
