'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

type AuthState = 'form' | 'check-email' | 'processing';

export default function AuthPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [authState, setAuthState] = useState<AuthState>('form');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  // Handle magic link callback (hash-based tokens)
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      setAuthState('processing');
      document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`;
      document.cookie = `authenticated=true; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`;

      const refreshToken = params.get('refresh_token');
      if (refreshToken) {
        document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax`;
      }

      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('auth.errorGeneric'));
        setLoading(false);
        return;
      }

      setSubmittedEmail(email);
      setAuthState('check-email');
    } catch {
      setError(t('auth.errorGeneric'));
    } finally {
      setLoading(false);
    }
  }

  // Processing state (magic link token detected)
  if (authState === 'processing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
            <img src="/logo.png" alt="TenderWatch" className="w-12 h-12" />
            <span className="text-xl font-bold tracking-tight text-dark">
              Tender<span className="text-primary">Watch</span>
            </span>
          </Link>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-dark mb-2">
              {t('nav.signIn')}...
            </h1>
            <p className="text-gray-500 text-sm">
              {t('hero.cta')}
            </p>
            <div className="mt-6">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check email state
  if (authState === 'check-email') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
            <img src="/logo.png" alt="TenderWatch" className="w-12 h-12" />
            <span className="text-xl font-bold tracking-tight text-dark">
              Tender<span className="text-primary">Watch</span>
            </span>
          </Link>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-dark mb-3">
              {t('auth.checkEmail')}
            </h2>
            <p
              className="text-gray-500 text-sm mb-8 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: t('auth.magicLinkSent').replace('{email}', submittedEmail),
              }}
            />
            <button
              onClick={() => {
                setAuthState('form');
                setEmail('');
                setSubmittedEmail('');
              }}
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              {t('auth.useDifferentEmail')}
            </button>
          </div>
          <Link
            href="/"
            className="inline-block mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            {t('auth.backToWebsite')}
          </Link>
        </div>
      </div>
    );
  }

  // Default: login form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10">
          <img src="/logo.png" alt="TenderWatch" className="w-14 h-14" />
          <span className="text-2xl font-bold tracking-tight text-dark">
            Tender<span className="text-primary">Watch</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-dark mb-2">
              {t('auth.welcomeBack')}
            </h1>
            <p className="text-gray-500 text-sm">
              {t('auth.signInOrCreate')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">
                {t('auth.emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-primary text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('auth.sending')}
                </span>
              ) : (
                t('auth.sendMagicLink')
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
            {t('auth.noPassword')}
          </p>
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="block text-center mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          {t('auth.backToWebsite')}
        </Link>
      </div>
    </div>
  );
}
