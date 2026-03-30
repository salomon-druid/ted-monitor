'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-dark tracking-tight">
              Tender<span className="text-primary">Watch</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-dark transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-dark transition-colors">
              Pricing
            </a>
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-dark transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-dark transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link href="/dashboard" className="btn-primary text-sm !px-5 !py-2.5">
              Start Free Trial
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
            <a href="#features" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              Features
            </a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              Pricing
            </a>
            <Link href="/dashboard" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              Dashboard
            </Link>
            <hr className="my-2 border-gray-100" />
            <Link href="/dashboard" className="block text-center btn-primary w-full text-sm">
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
