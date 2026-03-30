'use client';

import { useState } from 'react';
import { generateSummary, type SummaryResult } from '@/app/actions/summary';

export default function SummaryButton({ noticeId }: { noticeId: string }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const result = await generateSummary(noticeId);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      {!summary && !loading && (
        <button
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
          KI-Zusammenfassung generieren
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <svg className="animate-spin w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          KI-Zusammenfassung wird generiert...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
          <strong>Fehler:</strong> {error}
        </div>
      )}

      {summary && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-gray-500 uppercase tracking-wider font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              KI-Zusammenfassung
            </h3>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Neu generieren
            </button>
          </div>

          {/* Executive Summary */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 rounded-xl p-5">
            <h4 className="text-xs text-primary uppercase tracking-wider font-bold mb-2">Executive Summary</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{summary.executive_summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Requirements */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Anforderungen</h4>
              {summary.requirements.length > 0 ? (
                <ul className="space-y-2">
                  {summary.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">Keine Anforderungen extrahiert</p>
              )}
            </div>

            {/* Key Dates */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Wichtige Termine</h4>
              {summary.key_dates.length > 0 ? (
                <ul className="space-y-2">
                  {summary.key_dates.map((date, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      {date}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">Keine Termine extrahiert</p>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Nächste Schritte</h4>
              {summary.next_steps.length > 0 ? (
                <ul className="space-y-2">
                  {summary.next_steps.map((step, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">Keine Schritte empfohlen</p>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Generiert mit {summary.model_used}
          </p>
        </div>
      )}
    </div>
  );
}
