'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface AlertPrefs {
  enabled: boolean;
  min_score: number;
  cpv_codes: string[];
  countries: string[];
  frequency: string;
}

const CPV_OPTIONS = [
  { code: '45', label: 'Bau & Construction' },
  { code: '72', label: 'IT & Software' },
  { code: '50', label: 'Facility Management' },
  { code: '73', label: 'Beratung & Consulting' },
  { code: '33', label: 'Medizintechnik' },
  { code: '09', label: 'Energie' },
  { code: '60', label: 'Transport' },
  { code: '35', label: 'Sicherheit' },
];

const COUNTRY_OPTIONS = [
  { code: 'DE', label: 'Deutschland' },
  { code: 'FR', label: 'Frankreich' },
  { code: 'NL', label: 'Niederlande' },
  { code: 'AT', label: 'Österreich' },
  { code: 'BE', label: 'Belgien' },
  { code: 'IT', label: 'Italien' },
  { code: 'ES', label: 'Spanien' },
  { code: 'PL', label: 'Polen' },
];

export default function AlertPreferences() {
  const { t } = useLanguage();
  const [prefs, setPrefs] = useState<AlertPrefs>({
    enabled: false,
    min_score: 70,
    cpv_codes: [],
    countries: [],
    frequency: 'daily',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPrefs = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts/preferences');
      if (res.ok) {
        const data = await res.json();
        setPrefs(data.preferences);
      }
    } catch (err) {
      console.error('Failed to load alert preferences:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrefs();
  }, [fetchPrefs]);

  const savePrefs = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/alerts/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: t('alerts.saved') });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || t('alerts.saveError') });
      }
    } catch {
      setMessage({ type: 'error', text: t('alerts.saveError') });
    } finally {
      setSaving(false);
    }
  };

  const sendTest = async () => {
    setTesting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/alerts/test', { method: 'POST' });
      if (res.ok) {
        setMessage({ type: 'success', text: t('alerts.testSent') });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || t('alerts.testError') });
      }
    } catch {
      setMessage({ type: 'error', text: t('alerts.testError') });
    } finally {
      setTesting(false);
    }
  };

  const toggleCpv = (code: string) => {
    setPrefs((prev) => ({
      ...prev,
      cpv_codes: prev.cpv_codes.includes(code)
        ? prev.cpv_codes.filter((c) => c !== code)
        : [...prev.cpv_codes, code],
    }));
  };

  const toggleCountry = (code: string) => {
    setPrefs((prev) => ({
      ...prev,
      countries: prev.countries.includes(code)
        ? prev.countries.filter((c) => c !== code)
        : [...prev.countries, code],
    }));
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-64 mb-6" />
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-dark flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {t('alerts.title')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{t('alerts.subtitle')}</p>
        </div>
        <button
          onClick={() => setPrefs((prev) => ({ ...prev, enabled: !prev.enabled }))}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            prefs.enabled ? 'bg-primary' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
              prefs.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {prefs.enabled && (
        <div className="space-y-6">
          {/* Min Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('alerts.minScore')}: <span className="text-primary font-semibold">{prefs.min_score}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={prefs.min_score}
              onChange={(e) => setPrefs((prev) => ({ ...prev, min_score: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* CPV Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('alerts.cpvCategories')}
            </label>
            <div className="flex flex-wrap gap-2">
              {CPV_OPTIONS.map((cpv) => (
                <button
                  key={cpv.code}
                  onClick={() => toggleCpv(cpv.code)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    prefs.cpv_codes.includes(cpv.code)
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cpv.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">{t('alerts.cpvHint')}</p>
          </div>

          {/* Countries */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('alerts.countries')}
            </label>
            <div className="flex flex-wrap gap-2">
              {COUNTRY_OPTIONS.map((country) => (
                <button
                  key={country.code}
                  onClick={() => toggleCountry(country.code)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    prefs.countries.includes(country.code)
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {country.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">{t('alerts.countryHint')}</p>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('alerts.frequency')}
            </label>
            <div className="flex gap-2">
              {['daily', 'instant', 'weekly'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setPrefs((prev) => ({ ...prev, frequency: freq }))}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                    prefs.frequency === freq
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {t(`alerts.freq_${freq}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={savePrefs}
              disabled={saving}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? t('alerts.saving') : t('alerts.save')}
            </button>
            <button
              onClick={sendTest}
              disabled={testing}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {testing ? t('alerts.sending') : t('alerts.sendTest')}
            </button>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      )}

      {!prefs.enabled && (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">{t('alerts.disabled')}</p>
        </div>
      )}
    </div>
  );
}
