'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Prüfe Anmeldung...');

  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove #
    const params = new URLSearchParams(hash);
    
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken) {
      // Store tokens as cookies
      document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${7*24*3600}; SameSite=Lax`;
      document.cookie = `authenticated=true; path=/; max-age=${7*24*3600}; SameSite=Lax`;
      
      if (refreshToken) {
        document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=${30*24*3600}; SameSite=Lax`;
      }

      setStatus('Angemeldet! Weiterleitung zum Dashboard...');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } else {
      setStatus('Kein Token gefunden. Bitte neuen Magic Link anfordern.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <img src="/logo.png" alt="TenderWatch" className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-dark mb-4">{status}</h1>
          <div className="animate-pulse">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
