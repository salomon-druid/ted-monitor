'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import SummaryButton from '@/components/SummaryButton';
import BidFitScoreBreakdown from '@/components/BidFitScoreBreakdown';
import ProfileSetupModal from '@/components/ProfileSetupModal';
import { useLanguage } from '@/context/LanguageContext';
import { useCompanyProfile } from '@/context/CompanyProfileContext';
import { Notice } from '@/lib/supabase';
import { computeBidFit } from '@/lib/bidfit';

function formatDate(dateStr: string | null, locale: string = 'de'): string {
  if (!dateStr) return '—';
  const localeMap: Record<string, string> = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR' };
  return new Date(dateStr).toLocaleDateString(localeMap[locale] || 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatValue(value: number | null, currency: string | null, locale: string = 'de'): string {
  if (!value) return '—';
  const localeMap: Record<string, string> = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR' };
  return new Intl.NumberFormat(localeMap[locale] || 'en-GB', { style: 'currency', currency: currency || 'EUR' }).format(value);
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

interface NoticeDetailClientProps {
  notice: Notice;
}

export default function NoticeDetailClient({ notice }: NoticeDetailClientProps) {
  const { t, locale } = useLanguage();
  const { profile, isConfigured } = useCompanyProfile();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const deadlineDays = daysUntil(notice.deadline);

  const bidFitResult = profile ? computeBidFit(notice, profile) : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 bg-background min-h-screen">
        <Link
          href="/notices"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6 transition-colors font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {t('notices.backToNotices')}
        </Link>

        <div className="card">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-dark">
                  {notice.title || t('notices.untitled')}
                </h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  {notice.notice_type && (
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-semibold">
                      {notice.notice_type}
                    </span>
                  )}
                  {notice.procedure_type && (
                    <span className="text-xs bg-gold/20 text-amber-700 px-2.5 py-1 rounded-lg font-semibold">
                      {notice.procedure_type}
                    </span>
                  )}
                  {notice.country && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                      {notice.country}
                    </span>
                  )}
                </div>
              </div>
              {deadlineDays !== null && deadlineDays <= 14 && (
                <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold ${
                  deadlineDays <= 3 ? 'bg-red-50 text-red-600' :
                  deadlineDays <= 7 ? 'bg-amber-50 text-amber-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {deadlineDays <= 0 ? t('notices.deadlinePassed') :
                   deadlineDays === 1 ? t('notices.oneDayLeft') :
                   t('notices.daysLeft').replace('{days}', String(deadlineDays))}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoField label={t('notices.buyer')} value={notice.buyer_name} />
              <InfoField label={t('notices.country')} value={notice.country} />
              <InfoField label={t('notices.cpvCode')} value={notice.cpv_code ? `${notice.cpv_code} — ${notice.cpv_description || ''}` : notice.cpv_description} />
              <InfoField label={t('notices.publicationDate')} value={formatDate(notice.publication_date, locale)} />
              <InfoField label={t('notices.deadline')} value={formatDate(notice.deadline, locale)} />
              <InfoField label={t('notices.estimatedValue')} value={formatValue(notice.estimated_value, notice.estimated_value_currency, locale)} />
              <InfoField label={t('notices.noticeType')} value={notice.notice_type} />
              <InfoField label={t('notices.procedureType')} value={notice.procedure_type} />
            </div>

            {notice.description && (
              <div className="mt-8">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">{t('notices.description')}</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-5 rounded-xl border border-gray-100">
                  {notice.description}
                </div>
              </div>
            )}

            {notice.source_url && (
              <div className="mt-8 flex items-center gap-3">
                <a
                  href={notice.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  {t('notices.viewOnTed')}
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
                {isConfigured && profile && (
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="text-xs text-gray-500 hover:text-primary transition-colors underline"
                  >
                    {t('bidfit.editProfile') || 'Profil bearbeiten'}
                  </button>
                )}
              </div>
            )}

            {/* Bid-Fit Score */}
            {bidFitResult ? (
              <BidFitScoreBreakdown
                score={bidFitResult.score}
                recommendation={bidFitResult.recommendation}
                breakdown={bidFitResult.breakdown}
              />
            ) : (
              <div className="mt-8">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
                  {t('bidfit.scoreTitle') || 'Bid-Fit Score'}
                </h3>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {t('bidfit.setupHint') || 'Richten Sie Ihr Unternehmensprofil ein, um Bid-Fit-Scores für jede Ausschreibung zu sehen.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
                    >
                      {t('bidfit.setupProfile') || 'Profil einrichten'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* KI Summary */}
            <SummaryButton noticeId={notice.notice_id || String(notice.id)} />
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
            <p className="text-xs text-gray-400">
              ID: {notice.notice_id || notice.id} · {formatDate(notice.created_at, locale)}
            </p>
          </div>
        </div>
      </main>
      {showProfileModal && <ProfileSetupModal onClose={() => setShowProfileModal(false)} />}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</dt>
      <dd className="text-sm text-dark mt-1.5 font-medium">{value || '—'}</dd>
    </div>
  );
}
