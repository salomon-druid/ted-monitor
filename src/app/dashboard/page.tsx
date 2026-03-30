import { supabase, Notice } from '@/lib/supabase';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export const dynamic = 'force-dynamic';

async function getStats() {
  const { count: totalCount } = await supabase
    .from('notices')
    .select('*', { count: 'exact', head: true });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayCount } = await supabase
    .from('notices')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  const { count: recentCount } = await supabase
    .from('notices')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: expiringCount } = await supabase
    .from('notices')
    .select('*', { count: 'exact', head: true })
    .not('deadline', 'is', null)
    .lte('deadline', nextWeek)
    .gte('deadline', new Date().toISOString());

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
    .limit(8);

  const countryMap: Record<string, number> = {};
  (topCountries || []).forEach((r: any) => {
    if (r.country) countryMap[r.country] = (countryMap[r.country] || 0) + 1;
  });
  const countries = Object.entries(countryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const cpvMap: Record<string, number> = {};
  (topCpvs || []).forEach((r: any) => {
    if (r.cpv_description) cpvMap[r.cpv_description] = (cpvMap[r.cpv_description] || 0) + 1;
  });
  const cpvs = Object.entries(cpvMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    totalCount: totalCount || 0,
    todayCount: todayCount || 0,
    recentCount: recentCount || 0,
    expiringCount: expiringCount || 0,
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

  const statCards = [
    {
      label: 'Total Notices',
      value: stats.totalCount.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'New Today',
      value: stats.todayCount.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'This Week',
      value: stats.recentCount.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Expiring Soon',
      value: stats.expiringCount.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 bg-background min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">EU procurement opportunities at a glance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="card p-5 animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-dark">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Quick Filters */}
        <div className="card p-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mr-2">Quick Filters:</span>
            {['All', 'IT Services', 'Construction', 'Medical', 'Consulting', 'High-Fit Only'].map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  filter === 'All'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Countries */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-dark mb-4">Top Countries</h2>
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
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (count / stats.countries[0][1]) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Categories */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-dark mb-4">Top Categories (CPV)</h2>
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
                          className="h-full bg-gold rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (count / stats.cpvs[0][1]) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="card">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-dark">Recent Notices</h2>
            <Link href="/notices" className="text-xs text-primary font-medium hover:underline">
              View all →
            </Link>
          </div>
          {stats.recentNotices.length === 0 ? (
            <p className="p-8 text-center text-gray-400 text-sm">No notices found yet. The collector will populate data shortly.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.recentNotices.map((notice) => (
                <a
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="block p-4 hover:bg-gray-50/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-dark group-hover:text-primary transition-colors truncate">
                        {notice.title || 'Untitled Notice'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {notice.buyer_name || 'Unknown buyer'} · {notice.country || '—'} · {formatDate(notice.publication_date)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg whitespace-nowrap">
                      {formatValue(notice.estimated_value, notice.estimated_value_currency)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
