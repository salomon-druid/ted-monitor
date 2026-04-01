import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendAlertEmail } from '@/lib/email';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// POST — Send alerts for new high-fit notices
// Called by cron job after daily ingestion
// Auth: Bearer token via ALERT_CRON_SECRET env var
export async function POST(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.ALERT_CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // 1. Get all users with alerts enabled
  const { data: preferences, error: prefError } = await supabase
    .from('alert_preferences')
    .select('*')
    .eq('enabled', true);

  if (prefError) {
    return NextResponse.json({ error: `Failed to fetch preferences: ${prefError.message}` }, { status: 500 });
  }

  if (!preferences || preferences.length === 0) {
    return NextResponse.json({ message: 'No active alert subscriptions', sent: 0 });
  }

  // 2. Get notices from last 24 hours that haven't been alerted
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recentNotices, error: noticesError } = await supabase
    .from('notices')
    .select('*')
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  if (noticesError) {
    return NextResponse.json({ error: `Failed to fetch notices: ${noticesError.message}` }, { status: 500 });
  }

  if (!recentNotices || recentNotices.length === 0) {
    return NextResponse.json({ message: 'No new notices in last 24h', sent: 0 });
  }

  // 3. For each user, filter notices and send alerts
  let totalSent = 0;
  const results: { email: string; count: number; status: string }[] = [];

  for (const pref of preferences) {
    if (!pref.email) continue;

    // Filter notices matching user preferences
    const matchedNotices = recentNotices.filter((notice) => {
      // CPV code filter
      if (pref.cpv_codes && pref.cpv_codes.length > 0) {
        const noticeCpv = notice.cpv_code?.toString() || '';
        const matchesCpv = pref.cpv_codes.some((code: string) =>
          noticeCpv.startsWith(code.slice(0, 2))
        );
        if (!matchesCpv) return false;
      }

      // Country filter
      if (pref.countries && pref.countries.length > 0) {
        if (!pref.countries.includes(notice.country)) return false;
      }

      // Min score filter — if we have a bid_fit_score
      // Note: if no score exists, still include (score defaults to 50)
      const score = notice.bid_fit_score ?? 50;
      if (score < (pref.min_score || 70)) return false;

      return true;
    });

    if (matchedNotices.length === 0) continue;

    // Build alert notice objects
    const alertNotices = matchedNotices.map((n) => ({
      id: n.id,
      notice_id: n.notice_id,
      title: n.title,
      buyer_name: n.buyer_name,
      country: n.country,
      cpv_code: n.cpv_code,
      deadline: n.deadline,
      estimated_value: n.estimated_value,
      estimated_value_currency: n.estimated_value_currency,
      bid_fit_score: n.bid_fit_score ?? 50,
    }));

    // Send email
    const result = await sendAlertEmail(pref.email, alertNotices);

    if (result.success) {
      totalSent++;
      results.push({ email: pref.email, count: alertNotices.length, status: 'sent' });

      // Log sent alert
      await supabase.from('alert_logs').insert({
        user_id: pref.user_id,
        email: pref.email,
        notice_count: alertNotices.length,
        notice_ids: alertNotices.map((n) => n.notice_id),
        sent_at: new Date().toISOString(),
      });
    } else {
      results.push({ email: pref.email, count: alertNotices.length, status: `error: ${result.error}` });
    }
  }

  return NextResponse.json({
    message: `Alerts sent to ${totalSent} of ${preferences.length} subscribers`,
    totalNotices: recentNotices.length,
    sent: totalSent,
    results,
  });
}
