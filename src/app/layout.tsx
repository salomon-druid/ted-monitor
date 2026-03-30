import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'TED Procurement Monitor',
  description: 'EU Procurement Opportunity Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-dark text-white flex-shrink-0 fixed h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-primary">TED</span> Monitor
            </h1>
            <p className="text-xs text-gray-400 mt-1">EU Procurement Intelligence</p>
          </div>
          <nav className="mt-4">
            <Link
              href="/"
              className="block px-6 py-3 text-sm hover:bg-gray-700 transition-colors border-l-2 border-transparent hover:border-primary"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/notices"
              className="block px-6 py-3 text-sm hover:bg-gray-700 transition-colors border-l-2 border-transparent hover:border-primary"
            >
              📋 Notices
            </Link>
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                Live data from TED
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-64 p-8 bg-background min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
