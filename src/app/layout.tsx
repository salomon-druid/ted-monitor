import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { CompanyProfileProvider } from '@/context/CompanyProfileContext';

export const metadata: Metadata = {
  title: 'TenderWatch — EU Procurement Intelligence',
  description: 'Find EU tenders that match your business automatically. CPV-matched alerts, bid-fit scoring, and AI-powered summaries.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <CompanyProfileProvider>
            {children}
          </CompanyProfileProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
