import { supabase, Notice } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatValue(value: number | null, currency: string | null): string {
  if (!value) return '—';
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'EUR' }).format(value);
}

async function getNotice(id: string): Promise<Notice | null> {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Notice;
}

export default async function NoticeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const notice = await getNotice(params.id);

  if (!notice) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/notices"
        className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6 transition-colors"
      >
        ← Back to notices
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-dark">
            {notice.title || 'Untitled Notice'}
          </h1>
          <div className="flex flex-wrap gap-2 mt-3">
            {notice.notice_type && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                {notice.notice_type}
              </span>
            )}
            {notice.procedure_type && (
              <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded font-medium">
                {notice.procedure_type}
              </span>
            )}
            {notice.country && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                🌍 {notice.country}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField label="Buyer" value={notice.buyer_name} />
            <InfoField label="Country" value={notice.country} />
            <InfoField label="CPV Code" value={notice.cpv_code ? `${notice.cpv_code} — ${notice.cpv_description || ''}` : notice.cpv_description} />
            <InfoField label="Publication Date" value={formatDate(notice.publication_date)} />
            <InfoField label="Deadline" value={formatDate(notice.deadline)} />
            <InfoField label="Estimated Value" value={formatValue(notice.estimated_value, notice.estimated_value_currency)} />
            <InfoField label="Notice Type" value={notice.notice_type} />
            <InfoField label="Procedure Type" value={notice.procedure_type} />
          </div>

          {notice.description && (
            <div className="mt-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">Description</h3>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {notice.description}
              </div>
            </div>
          )}

          {notice.source_url && (
            <div className="mt-6">
              <a
                href={notice.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors"
              >
                View on TED →
              </a>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-400">
            ID: {notice.notice_id || notice.id} · Published: {formatDate(notice.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="text-sm text-dark mt-1 font-medium">{value || '—'}</dd>
    </div>
  );
}
