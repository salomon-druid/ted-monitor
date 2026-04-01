'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import de from '@/locales/de.json';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';

export type Locale = 'de' | 'en' | 'fr';

const translations: Record<Locale, Record<string, any>> = { de, en, fr };

const LOCALE_STORAGE_KEY = 'ted-monitor-locale';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'de',
  setLocale: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('de');

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && (stored === 'de' || stored === 'en' || stored === 'fr')) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string): any => {
      const keys = key.split('.');
      let value: any = translations[locale];
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key;
        }
      }
      return value;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
