import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function escapeCsv(value: string | null): string {
  if (!value) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
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

    const limit = Math.min(parseInt(searchParams.get('limit') || '500'), 5000);
    const { data: notices, error } = await query.limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = [
      ['Title', 'Buyer', 'Country', 'CPV Code', 'CPV Description', 'Notice Type', 'Publication Date', 'Deadline', 'Estimated Value', 'Currency', 'Source URL'].join(','),
      ...(notices || []).map((n: any) => [
        escapeCsv(n.title),
        escapeCsv(n.buyer_name),
        escapeCsv(n.country),
        escapeCsv(n.cpv_code),
        escapeCsv(n.cpv_description),
        escapeCsv(n.notice_type),
        escapeCsv(n.publication_date),
        escapeCsv(n.deadline),
        n.estimated_value || '',
        escapeCsv(n.estimated_value_currency),
        escapeCsv(n.source_url),
      ].join(',')),
    ];

    const csv = rows.join('\n');
    const timestamp = new Date().toISOString().split('T')[0];

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="tenderwatch-export-${timestamp}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('CSV export error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
