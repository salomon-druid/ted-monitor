import { supabase, Notice } from '@/lib/supabase';
import DashboardClient from '@/components/DashboardClient';

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

export default async function DashboardPage() {
  const stats = await getStats();
  return <DashboardClient stats={stats} />;
}
