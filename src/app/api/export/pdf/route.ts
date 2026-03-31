import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function escapeHtml(str: string | null): string {
  if (!str) return '—';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatValue(value: number | null, currency: string | null): string {
  if (!value) return '—';
  return `${(value / 1000).toFixed(0)}k ${currency || 'EUR'}`;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    
    let query = supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (searchParams.get('country')) {
      query = query.eq('country', searchParams.get('country'));
    }
    if (searchParams.get('cpv')) {
      query = query.ilike('cpv_description', `%${searchParams.get('cpv')}%`);
    }
    if (searchParams.get('type')) {
      query = query.eq('notice_type', searchParams.get('type'));
    }
    if (searchParams.get('search')) {
      const s = searchParams.get('search')!;
      query = query.or(`title.ilike.%${s}%,buyer_name.ilike.%${s}%,description.ilike.%${s}%`);
    }

    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);
    const { data: notices, error } = await query.limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const timestamp = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
    const noticeRows = (notices || []).map((n: any, i: number) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:11px;">${i + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
          <div style="font-weight:600;font-size:12px;color:#111827;">${escapeHtml(n.title)}</div>
          ${n.description ? `<div style="font-size:10px;color:#6b7280;margin-top:2px;max-height:40px;overflow:hidden;">${escapeHtml(n.description).substring(0, 200)}</div>` : ''}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:11px;">${escapeHtml(n.buyer_name)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:11px;">${escapeHtml(n.country)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:11px;">${escapeHtml(n.cpv_description)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:11px;white-space:nowrap;">${formatDate(n.publication_date)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:11px;white-space:nowrap;color:${n.deadline && new Date(n.deadline) < new Date() ? '#dc2626' : '#111827'};">${formatDate(n.deadline)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:11px;text-align:right;font-weight:600;color:#1e40af;">${formatValue(n.estimated_value, n.estimated_value_currency)}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>TenderWatch Export — ${timestamp}</title>
  <style>
    @page { margin: 2cm; size: A4 landscape; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827; }
  </style>
</head>
<body>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #1e40af;">
    <div>
      <h1 style="font-size:24px;font-weight:700;margin:0;color:#111827;">TenderWatch <span style="color:#1e40af;">Export</span></h1>
      <p style="font-size:12px;color:#6b7280;margin:4px 0 0 0;">EU Procurement Intelligence — Generated ${timestamp}</p>
    </div>
    <div style="text-align:right;">
      <div style="font-size:12px;color:#6b7280;">Total: <strong style="color:#111827;">${(notices || []).length}</strong> notices</div>
    </div>
  </div>

  <table style="width:100%;border-collapse:collapse;font-size:11px;">
    <thead>
      <tr style="background:#f9fafb;">
        <th style="padding:8px 12px;text-align:left;font-weight:600;font-size:10px;text-transform:uppercase;color:#6b7280;border-bottom:2px solid #e5e7eb;">#</th>
        <th style="padding:8px 12px;text-align:left;font-weight:600;font-size:10px;text-transform:uppercase;color:#6b7280;border-bottom:2px solid #e5e7eb;">Title</th>
        <th style="padding:8px 12px;text-align:left;font-weight:600;font-size:10px;text-transform:uppercase;color:#6b7280;border-bottom:2px solid #e5e7eb;">Buyer</th>
        <th style="padding:8px 12px;text-align:left;font-weight:600;font-size:10px;text-transform:uppercase;color:#6b7280;border-bottom:2px solid #e5e7eb;">Country</th>
        <th style="padding:8px 12px;text-align:left;font-weight:600;font-size:10px;text-transform:uppercase;color:#6b7280;border-bottom:2px solid #e5e7eb;">Category</th>
        <th style="padding:8px 12px;text-align:left;font-weight:600;font-size:10px;text-transform:uppercase;color:#6b7280;border-bottom:2px solid #e5e7eb;">Published</th>
        <th style="padding:8px 12px;text-align:left;font-weight:600;font-size:10px;text-transform:uppercase;color:#6b7280;border-bottom:2px solid #e5e7eb;">Deadline</th>
        <th style="padding:8px 12px;text-align:right;font-weight:600;font-size:10px;text-transform:uppercase;color:#6b7280;border-bottom:2px solid #e5e7eb;">Value</th>
      </tr>
    </thead>
    <tbody>
      ${noticeRows}
    </tbody>
  </table>

  <div style="margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:10px;color:#9ca3af;text-align:center;">
    TenderWatch — tenderwatch.eu — Data sourced from TED (Tenders Electronic Daily)
  </div>

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('PDF export error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
