'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useLanguage } from '@/context/LanguageContext';
import { getSupabase, Notice } from '@/lib/supabase';

function formatDate(dateStr: string | null, locale: string = 'de'): string {
  if (!dateStr) return '—';
  const localeMap: Record<string, string> = { de: 'de-DE', en: 'en-GB', fr: 'fr-FR' };
  return new Date(dateStr).toLocaleDateString(localeMap[locale] || 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatValue(value: number | null, currency: string | null): string {
  if (!value) return '—';
  return `${(value / 1000).toFixed(0)}k ${currency || 'EUR'}`;
}

function tpl(str: string, vars: Record<string, string>): string {
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

async function getNoticesByCpv(cpvPrefix: string): Promise<Notice[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .ilike('cpv_code', `${cpvPrefix}%`)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Supabase query error:', error);
      return [];
    }
    return (data || []) as Notice[];
  } catch (e) {
    console.error('Supabase connection error:', e);
    return [];
  }
}

interface BranchLandingPageProps {
  slug: string;
  cpvPrefix: string;
}

export default function BranchLandingPage({ slug, cpvPrefix }: BranchLandingPageProps) {
  const { t, locale } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const brancheKey = `branche.${slug}`;
  const industry = t(`${brancheKey}.industryName`) as string;

  useEffect(() => {
    getNoticesByCpv(cpvPrefix).then((data) => {
      setNotices(data);
      setLoading(false);
    });
  }, [cpvPrefix]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                {t(`${brancheKey}.statsLabel`)}
              </span>
            </div>

            <h1 className="animate-fade-up section-heading mb-6" style={{ animationDelay: '0.2s' }}>
              {t(`${brancheKey}.heroHeadline`)}
            </h1>

            <p className="animate-fade-up section-subheading mb-10" style={{ animationDelay: '0.3s' }}>
              {t(`${brancheKey}.heroSubheadline`)}
            </p>

            <div className="animate-fade-up flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto" style={{ animationDelay: '0.4s' }}>
              <Link href="/dashboard" className="btn-primary whitespace-nowrap w-full sm:w-auto text-center">
                {t(`${brancheKey}.trialBtn`)}
              </Link>
              <Link href="/notices" className="btn-secondary whitespace-nowrap w-full sm:w-auto text-center">
                {t(`${brancheKey}.viewNotices`)}
              </Link>
            </div>

            <p className="animate-fade-up text-xs text-gray-400 mt-4" style={{ animationDelay: '0.5s' }}>
              {t(`${brancheKey}.trialNote`)}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="section-heading mb-4"
              dangerouslySetInnerHTML={{
                __html: tpl(t(`${brancheKey}.whyTitle`), { industry }),
              }}
            />
            <p className="section-subheading">
              {tpl(t(`${brancheKey}.whySubtitle`), { industry })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(() => {
              const raw = t(`${brancheKey}.benefits`);
              const benefits: { title: string; desc: string }[] = Array.isArray(raw) ? raw : [];
              return benefits.map((benefit: { title: string; desc: string }, i: number) => (
                <div
                  key={i}
                  className="card p-8 group hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-primary/10 text-primary">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2">{benefit.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Live Notices */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="section-heading mb-4"
              dangerouslySetInnerHTML={{
                __html: tpl(t(`${brancheKey}.recentTitle`), { industry }),
              }}
            />
            <p className="section-subheading">
              {t(`${brancheKey}.recentSubtitle`)}
            </p>
          </div>

          <div className="card">
            {loading ? (
              <div className="p-16 text-center">
                <svg className="animate-spin w-8 h-8 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-gray-500 font-medium">{t('common.loading')}</p>
              </div>
            ) : notices.length === 0 ? (
              <div className="p-16 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-gray-500 font-medium">{t(`${brancheKey}.noNotices`)}</p>
                <p className="text-gray-400 text-sm mt-1">{t(`${brancheKey}.noNoticesSub`)}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notices.map((notice) => (
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
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {notice.description}
                          </p>
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
                              {t(`${brancheKey}.deadlineLabel`)} {formatDate(notice.deadline, locale)}
                            </span>
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
          </div>

          {!loading && notices.length > 0 && (
            <div className="text-center mt-8">
              <Link href={`/notices?cpv=${cpvPrefix}`} className="btn-secondary">
                {tpl(t(`${brancheKey}.viewAll`), { industry })}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-12 md:p-16 text-center bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {tpl(t(`${brancheKey}.ctaTitle`), { industry })}
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
              {t(`${brancheKey}.ctaSubtitle`)}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="btn-gold !text-dark !px-8 !py-4 text-base">
                {t(`${brancheKey}.ctaButton`)}
              </Link>
              <a href="/#pricing" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                {t(`${brancheKey}.ctaPricing`)}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-white font-bold text-lg">
                  Tender<span className="text-primary">Watch</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                {t('footer.tagline')}
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t(`${brancheKey}.footerBranches`)}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/branche/bau" className="hover:text-white transition-colors">{t('branches.bau')}</Link></li>
                <li><Link href="/branche/it" className="hover:text-white transition-colors">{t('branches.it')}</Link></li>
                <li><Link href="/branche/facility" className="hover:text-white transition-colors">{t('branches.facility')}</Link></li>
                <li><Link href="/branche/beratung" className="hover:text-white transition-colors">{t('branches.beratung')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t(`${brancheKey}.footerProduct`)}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/#features" className="hover:text-white transition-colors">{t('nav.features')}</a></li>
                <li><a href="/#pricing" className="hover:text-white transition-colors">{t('nav.pricing')}</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">{t('nav.dashboard')}</Link></li>
                <li><Link href="/notices" className="hover:text-white transition-colors">{t('footer.notices')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t(`${brancheKey}.footerLegal`)}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.cookies')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.gdpr')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} TenderWatch. {t('footer.copyright')}
            </p>
            <p className="text-xs">
              {t('footer.dataSourced')} <a href="https://ted.europa.eu" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light transition-colors">TED (Tenders Electronic Daily)</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
