'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage, Locale } from '@/context/LanguageContext';

const LOCALE_LABELS: Record<Locale, string> = {
  de: 'DE',
  en: 'EN',
  fr: 'FR',
};

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [branchenOpen, setBranchenOpen] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();

  const branchenLinks = [
    { href: '/branche/bau', label: t('branches.bau') },
    { href: '/branche/it', label: t('branches.it') },
    { href: '/branche/facility', label: t('branches.facility') },
    { href: '/branche/beratung', label: t('branches.beratung') },
  ];

  const locales: Locale[] = ['de', 'en', 'fr'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="TenderWatch" className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <span className="text-lg font-bold text-dark tracking-tight">
              Tender<span className="text-primary">Watch</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm font-medium text-gray-600 hover:text-dark transition-colors">
              {t('nav.features')}
            </a>
            <a href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-dark transition-colors">
              {t('nav.pricing')}
            </a>

            {/* Branchen Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBranchenOpen(true)}
              onMouseLeave={() => setBranchenOpen(false)}
            >
              <button className="text-sm font-medium text-gray-600 hover:text-dark transition-colors flex items-center gap-1">
                {t('nav.branches')}
                <svg className={`w-4 h-4 transition-transform ${branchenOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {branchenOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl border border-gray-100 shadow-lg py-2 animate-fade-up" style={{ animationDelay: '0s' }}>
                  {branchenLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                        pathname === link.href ? 'text-primary font-medium' : 'text-gray-700'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-dark transition-colors">
              {t('nav.dashboard')}
            </Link>
          </div>

          {/* Desktop CTA + Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 mr-2 border-r border-gray-200 pr-3">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocale(loc)}
                  className={`text-xs font-semibold px-2 py-1 rounded-md transition-all ${
                    locale === loc
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {LOCALE_LABELS[loc]}
                </button>
              ))}
            </div>

            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-dark transition-colors px-3 py-2">
              {t('nav.signIn')}
            </Link>
            <Link href="/dashboard" className="btn-primary text-sm !px-5 !py-2.5">
              {t('nav.startTrial')}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-up" style={{ animationDelay: '0s' }}>
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Language Switcher */}
            <div className="flex items-center gap-1 px-4 py-2">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocale(loc)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    locale === loc
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-gray-600 bg-gray-100'
                  }`}
                >
                  {LOCALE_LABELS[loc]}
                </button>
              ))}
            </div>
            <hr className="border-gray-100" />
            <a href="/#features" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              {t('nav.features')}
            </a>
            <a href="/#pricing" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              {t('nav.pricing')}
            </a>
            <div className="px-4 py-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('nav.branches')}</span>
            </div>
            {branchenLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors pl-8"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              {t('nav.dashboard')}
            </Link>
            <hr className="my-2 border-gray-100" />
            <Link href="/dashboard" className="block text-center btn-primary w-full text-sm">
              {t('nav.startTrial')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
