'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import BidFitBadge from '@/components/BidFitBadge';
import ProfileSetupModal from '@/components/ProfileSetupModal';
import { useLanguage } from '@/context/LanguageContext';
import { useCompanyProfile } from '@/context/CompanyProfileContext';
import { Notice } from '@/lib/supabase';
import { computeBidFit } from '@/lib/bidfit';

function formatDate(dateStr: string | null, locale: string = 'de'): string {
  if (!dateStr) return '—';
  const localeMap: Record<string, string> = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR' };
  return new Date(dateStr).toLocaleDateString(localeMap[locale] || 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatValue(value: number | null, currency: string | null): string {
  if (!value) return '—';
  return `${(value / 1000).toFixed(0)}k ${currency || 'EUR'}`;
}

interface NoticesClientProps {
  notices: Notice[];
  count: number;
  page: number;
  totalPages: number;
  countries: string[];
  types: string[];
  searchParams: { [key: string]: string | undefined };
}

export default function NoticesClient({
  notices,
  count,
  page,
  totalPages,
  countries,
  types,
  searchParams,
}: NoticesClientProps) {
  const { t, locale } = useLanguage();
  const { profile, isConfigured } = useCompanyProfile();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [sortByBidFit, setSortByBidFit] = useState(false);

  function buildExportUrl(format: 'csv' | 'pdf'): string {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.country) params.set('country', searchParams.country);
    if (searchParams.type) params.set('type', searchParams.type);
    if (searchParams.cpv) params.set('cpv', searchParams.cpv);
    return `/api/export/${format}?${params.toString()}`;
  }

  const noticeScores = new Map<number, { score: number; recommendation: string }>();
  if (profile) {
    for (const n of notices) {
      const result = computeBidFit(n, profile);
      noticeScores.set(n.id, { score: result.score, recommendation: result.recommendation });
    }
  }

  // Sort by Bid-Fit if enabled
  const sortedNotices = sortByBidFit && profile
    ? [...notices].sort((a, b) => {
        const sa = noticeScores.get(a.id)?.score ?? 0;
        const sb = noticeScores.get(b.id)?.score ?? 0;
        return sb - sa;
      })
    : notices;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 bg-background min-h-screen">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark">{t('notices.title')}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {count.toLocaleString()} {t('notices.procurementNotices')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isConfigured && (
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                {t('bidfit.setupProfile')}
              </button>
            )}
            {isConfigured && (
              <button
                onClick={() => setSortByBidFit(!sortByBidFit)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  sortByBidFit
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m-9.75 4.5h9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bid-Fit
              </button>
            )}
            <a
              href={buildExportUrl('csv')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              CSV
            </a>
            <a
              href={buildExportUrl('pdf')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m0 0a48.159 48.159 0 018.5 0m-8.5 0V5.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25" />
              </svg>
              PDF
            </a>
          </div>
        </div>

        <form className="card p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">{t('notices.search')}</label>
              <input
                type="text"
                name="search"
                defaultValue={searchParams.search || ''}
                placeholder={t('notices.searchPlaceholder')}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">{t('notices.country')}</label>
              <select
                name="country"
                defaultValue={searchParams.country || ''}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-all"
              >
                <option value="">{t('notices.allCountries')}</option>
                {countries.map((c: string) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">{t('notices.type')}</label>
              <select
                name="type"
                defaultValue={searchParams.type || ''}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white transition-all"
              >
                <option value="">{t('notices.allTypes')}</option>
                {types.map((tp: string) => (
                  <option key={tp} value={tp}>{tp}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="btn-primary !py-2.5 flex-1 text-sm">
                {t('notices.filter')}
              </button>
              <Link href="/notices" className="btn-secondary !py-2.5 text-sm">
                {t('notices.reset')}
              </Link>
            </div>
          </div>
        </form>

        <div className="card">
          {notices.length === 0 ? (
            <div className="p-16 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-gray-500 font-medium">{t('notices.noResults')}</p>
              <p className="text-gray-400 text-sm mt-1">{t('notices.adjustSearch')}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {sortedNotices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="block p-5 hover:bg-gray-50/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-dark group-hover:text-primary transition-colors">
                        {notice.title || t('notices.untitled')}
                      </h3>
                      {notice.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notice.description}</p>
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
                          {formatDate(notice.publication_date, locale)}
                        </span>
                        {notice.deadline && (
                          <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDate(notice.deadline, locale)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                      {isConfigured && profile && (() => {
                        const scoreData = noticeScores.get(notice.id);
                        if (!scoreData) return null;
                        return <BidFitBadge score={scoreData.score} recommendation={scoreData.recommendation} size="sm" />;
                      })()}
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

          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {t('notices.pageOf').replace('{page}', String(page)).replace('{total}', String(totalPages))}
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/notices?${new URLSearchParams({ ...searchParams, page: String(page - 1) }).toString()}`}
                    className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    {t('notices.previous')}
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/notices?${new URLSearchParams({ ...searchParams, page: String(page + 1) }).toString()}`}
                    className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    {t('notices.next')}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      {showProfileModal && <ProfileSetupModal onClose={() => setShowProfileModal(false)} />}
    </div>
  );
}
