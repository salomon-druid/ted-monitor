'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Prüfe Anmeldung...');

  useEffect(() => {
    // Check for auth tokens in URL hash
    const hash = window.location.hash;
    const url = new URL(window.location.href);
    
    // If we have tokens in the URL, extract and store them
    const accessToken = url.searchParams.get('access_token') || 
                       new URLSearchParams(hash.replace('#', '')).get('access_token');
    const refreshToken = url.searchParams.get('refresh_token') ||
                        new URLSearchParams(hash.replace('#', '')).get('refresh_token');

    if (accessToken) {
      // Store tokens
      document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${7*24*60*60}; SameSite=Lax; Secure`;
      document.cookie = `authenticated=true; path=/; max-age=${7*24*60*60}; SameSite=Lax; Secure`;
      
      if (refreshToken) {
        document.cookie = `sb-refresh-token=${refreshToken}; path=/; max-age=${30*24*60*60}; SameSite=Lax; Secure`;
      }

      setStatus('Angemeldet! Weiterleitung...');
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } else {
      setStatus('Kein Anmeldecode gefunden.');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <img src="/logo.png" alt="TenderWatch" className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-dark mb-4">{status}</h1>
          <div className="animate-pulse">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
