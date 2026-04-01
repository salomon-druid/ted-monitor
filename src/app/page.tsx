'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useLanguage } from '@/context/LanguageContext';

async function startCheckout(plan: string) {
  try {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else if (data.error) {
      // If not authenticated, redirect to auth
      if (res.status === 401) {
        window.location.href = '/auth';
      } else {
        alert(data.error);
      }
    }
  } catch (err) {
    window.location.href = '/auth';
  }
}

export default function HomePage() {
  const { t } = useLanguage();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  async function handleCheckout(plan: string) {
    setCheckoutLoading(plan);
    await startCheckout(plan);
    setCheckoutLoading(null);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                {t('hero.badge')}
              </span>
            </div>

            <h1 className="animate-fade-up section-heading mb-6" style={{ animationDelay: '0.2s' }}>
              {t('hero.headline')}
              <span className="text-primary">{t('hero.headlineHighlight')}</span>
              {t('hero.headlineEnd')}
            </h1>

            <p className="animate-fade-up section-subheading mb-10" style={{ animationDelay: '0.3s' }}>
              {t('hero.subtitle')}
            </p>

            {/* Search bar / CTA */}
            <div className="animate-fade-up flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto" style={{ animationDelay: '0.4s' }}>
              <div className="relative flex-1 w-full">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-gray-400"
                />
              </div>
              <Link href="/dashboard" className="btn-primary whitespace-nowrap w-full sm:w-auto text-center">
                {t('hero.cta')}
              </Link>
            </div>

            <p className="animate-fade-up text-xs text-gray-400 mt-4" style={{ animationDelay: '0.5s' }}>
              {t('hero.trialNote')}
            </p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y border-gray-200/60 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span><strong className="text-dark">195+</strong> {t('trustBar.activeTenders')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold"></div>
              <span><strong className="text-dark">27</strong> {t('trustBar.euCountries')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span><strong className="text-dark">{t('trustBar.updated')}</strong> {t('trustBar.daily')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold"></div>
              <span><strong className="text-dark">50+</strong> {t('trustBar.smbTrust')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              {t('howItWorks.title')}
              <span className="text-primary">{t('howItWorks.titleHighlight')}</span>
            </h2>
            <p className="section-subheading">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: t('howItWorks.step1Title'),
                desc: t('howItWorks.step1Desc'),
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: t('howItWorks.step2Title'),
                desc: t('howItWorks.step2Desc'),
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: t('howItWorks.step3Title'),
                desc: t('howItWorks.step3Desc'),
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-2.48-.048m2.48.048c-.982.143-1.954.317-2.916.52" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center animate-fade-up" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200"></div>
                )}
                <div className="relative z-10 w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-gold tracking-widest uppercase mb-2 block">{t('howItWorks.step')} {item.step}</span>
                <h3 className="text-xl font-bold text-dark mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              {t('features.title')}
              <span className="text-primary">{t('features.titleHighlight')}</span>
            </h2>
            <p className="section-subheading">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                ),
                title: t('features.cpvAlertsTitle'),
                desc: t('features.cpvAlertsDesc'),
                color: 'primary',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
                title: t('features.bidFitTitle'),
                desc: t('features.bidFitDesc'),
                color: 'gold',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                ),
                title: t('features.aiSummariesTitle'),
                desc: t('features.aiSummariesDesc'),
                color: 'primary',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: t('features.deadlineTitle'),
                desc: t('features.deadlineDesc'),
                color: 'gold',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
                title: t('features.teamTitle'),
                desc: t('features.teamDesc'),
                color: 'primary',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                ),
                title: t('features.exportTitle'),
                desc: t('features.exportDesc'),
                color: 'gold',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card p-8 group hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                  feature.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-gold/10 text-gold'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-4">
              {t('socialProof.title')}
            </h2>
            <p className="section-subheading">
              {t('socialProof.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {(() => {
              let testimonials;
              try {
                const raw = t('socialProof.testimonials');
                testimonials = typeof raw === 'string' ? JSON.parse(raw) : raw;
              } catch {
                testimonials = [];
              }
              return Array.isArray(testimonials) ? testimonials.map((item: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-gray-700 text-sm leading-relaxed mb-6 flex-1">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {item.name?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-dark">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.role} · {item.company}</div>
                      <div className="text-xs text-gray-400">{item.location}</div>
                    </div>
                  </div>
                </div>
              )) : null;
            })()}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              {t('pricing.title')}
              <span className="text-primary">{t('pricing.titleHighlight')}</span>
            </h2>
            <p className="section-subheading">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="card p-8 flex flex-col animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-dark">{t('pricing.starter')}</h3>
                <p className="text-sm text-gray-500 mt-1">{t('pricing.starterDesc')}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-dark">79€</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {(Array.isArray(t('pricing.starterFeatures')) ? t('pricing.starterFeatures') : t('pricing.starterFeatures').split(', ')).map((item: string) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout('starter')} disabled={checkoutLoading === 'starter'} className="btn-secondary w-full text-center">
                {checkoutLoading === 'starter' ? '...' : t('pricing.startTrial')}
              </button>
            </div>

            {/* Professional — Featured */}
            <div className="card p-8 flex flex-col relative border-primary/30 shadow-lg shadow-primary/5 animate-fade-up ring-2 ring-primary/20" style={{ animationDelay: '0.3s' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  {t('pricing.mostPopular')}
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-dark">{t('pricing.professional')}</h3>
                <p className="text-sm text-gray-500 mt-1">{t('pricing.professionalDesc')}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-dark">199€</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {(Array.isArray(t('pricing.professionalFeatures')) ? t('pricing.professionalFeatures') : t('pricing.professionalFeatures').split(', ')).map((item: string) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout('professional')} disabled={checkoutLoading === 'professional'} className="btn-primary w-full text-center">
                {checkoutLoading === 'professional' ? '...' : t('pricing.startTrial')}
              </button>
            </div>

            {/* Enterprise */}
            <div className="card p-8 flex flex-col animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-dark">{t('pricing.enterprise')}</h3>
                <p className="text-sm text-gray-500 mt-1">{t('pricing.enterpriseDesc')}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-dark">499€</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {(Array.isArray(t('pricing.enterpriseFeatures')) ? t('pricing.enterpriseFeatures') : t('pricing.enterpriseFeatures').split(', ')).map((item: string) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout('enterprise')} disabled={checkoutLoading === 'enterprise'} className="btn-gold w-full text-center">
                {checkoutLoading === 'enterprise' ? '...' : t('pricing.contactSales')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              {t('faq.title')}
            </h2>
            <p className="section-subheading">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: t('faq.items.0.q'), a: t('faq.items.0.a') },
              { q: t('faq.items.1.q'), a: t('faq.items.1.a') },
              { q: t('faq.items.2.q'), a: t('faq.items.2.a') },
              { q: t('faq.items.3.q'), a: t('faq.items.3.a') },
              { q: t('faq.items.4.q'), a: t('faq.items.4.a') },
              { q: t('faq.items.5.q'), a: t('faq.items.5.a') },
            ].map((item, i) => (
              <details key={i} className="card group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-base font-semibold text-dark pr-4">{item.q}</h3>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-12 md:p-16 text-center bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="btn-gold !text-dark !px-8 !py-4 text-base">
                {t('cta.button')}
              </Link>
              <a href="#pricing" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                {t('cta.viewPricing')}
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
              <h4 className="text-white font-semibold text-sm mb-4">{t('footer.product')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">{t('footer.features')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t('footer.pricing')}</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">{t('footer.dashboard')}</Link></li>
                <li><Link href="/notices" className="hover:text-white transition-colors">{t('footer.notices')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.about')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.blog')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.careers')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.contact')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t('footer.legal')}</h4>
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
