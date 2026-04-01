'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface CompanyProfile {
  company_name: string;
  cpv_codes: string[];
  countries: string[];
  keywords: string[];
  min_value?: number;
  max_value?: number;
}

interface CompanyProfileContextType {
  profile: CompanyProfile | null;
  setProfile: (profile: CompanyProfile) => void;
  isConfigured: boolean;
  clearProfile: () => void;
}

const PROFILE_STORAGE_KEY = 'ted-monitor-company-profile';

const CompanyProfileContext = createContext<CompanyProfileContextType>({
  profile: null,
  setProfile: () => {},
  isConfigured: false,
  clearProfile: () => {},
});

export function CompanyProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<CompanyProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfileState(parsed);
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  const setProfile = useCallback((newProfile: CompanyProfile) => {
    setProfileState(newProfile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
  }, []);

  const clearProfile = useCallback(() => {
    setProfileState(null);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  }, []);

  const isConfigured = !!(profile && (profile.cpv_codes.length > 0 || profile.countries.length > 0 || profile.keywords.length > 0));

  if (!loaded) return null;

  return (
    <CompanyProfileContext.Provider value={{ profile, setProfile, isConfigured, clearProfile }}>
      {children}
    </CompanyProfileContext.Provider>
  );
}

export function useCompanyProfile() {
  return useContext(CompanyProfileContext);
}
