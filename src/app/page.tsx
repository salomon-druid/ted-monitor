import { supabase, Notice } from '@/lib/supabase';

async function getStats() {
  const { count: totalCount } = await supabase
    .from('notices')
    .select('*', { count: 'exact', head: true });

  const { count: recentCount } = await supabase
    .from('notices')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const { data: topCountries } = await supabase
    .from('notices')
    .select('country')
    .not('country', 'is', null);

  const { data: topCpvs } = await supabase
    .from('notices')
    .select('cpv_description')
    .not('cpv_description', 'is', null);

  const { data: recentNotices } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Count countries
  const countryMap: Record<string, number> = {};
  (topCountries || []).forEach((r: any) => {
    if (r.country) countryMap[r.country] = (countryMap[r.country] || 0) + 1;
  });
  const countries = Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Count CPV categories
  const cpvMap: Record<string, number> = {};
  (topCpvs || []).forEach((r: any) => {
    if (r.cpv_description) cpvMap[r.cpv_description] = (cpvMap[r.cpv_description] || 0) + 1;
  });
  const cpvs = Object.entries(cpvMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    totalCount: totalCount || 0,
    recentCount: recentCount || 0,
    countries,
    cpvs,
    recentNotices: (recentNotices || []) as Notice[],
  };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatValue(value: number | null, currency: string | null): string {
  if (!value) return '—';
  return `${(value / 1000).toFixed(0)}k ${currency || 'EUR'}`;
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">EU procurement opportunities at a glance</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-500 uppercase tracking-wide">Total Notices</div>
          <div className="text-3xl font-bold text-dark mt-2">{stats.totalCount.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-500 uppercase tracking-wide">New This Week</div>
          <div className="text-3xl font-bold text-primary mt-2">{stats.recentCount.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-500 uppercase tracking-wide">Countries</div>
          <div className="text-3xl font-bold text-dark mt-2">{stats.countries.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Countries */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-dark mb-4">Top Countries</h2>
          {stats.countries.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.countries.map(([country, count]) => (
                <div key={country} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{country}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(100, (count / stats.countries[0][1]) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-dark mb-4">Top Categories (CPV)</h2>
          {stats.cpvs.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.cpvs.map(([cpv, count]) => (
                <div key={cpv} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate max-w-[180px]" title={cpv}>{cpv}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full"
                        style={{ width: `${Math.min(100, (count / stats.cpvs[0][1]) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent notices */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-dark">Recent Notices</h2>
        </div>
        {stats.recentNotices.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm">No notices found yet. The collector will populate data shortly.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.recentNotices.map((notice) => (
              <a
                key={notice.id}
                href={`/notices/${notice.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-dark truncate">
                      {notice.title || 'Untitled Notice'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {notice.buyer_name || 'Unknown buyer'} · {notice.country || '—'} · {formatDate(notice.publication_date)}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded whitespace-nowrap">
                    {formatValue(notice.estimated_value, notice.estimated_value_currency)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
