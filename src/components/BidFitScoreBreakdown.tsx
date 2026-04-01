'use client';

import { useLanguage } from '@/context/LanguageContext';

interface ScoreBreakdown {
  cpv_score: number;
  country_score: number;
  keyword_score: number;
  value_score: number;
  urgency_score: number;
  cpv_detail: string;
  country_detail: string;
  keyword_detail: string;
  value_detail: string;
  urgency_detail: string;
}

interface BidFitScoreBreakdownProps {
  score: number;
  recommendation: string;
  breakdown: ScoreBreakdown;
}

const DIMENSIONS = [
  { key: 'cpv', max: 30, scoreKey: 'cpv_score' as const, detailKey: 'cpv_detail' as const, icon: '🏷️' },
  { key: 'country', max: 20, scoreKey: 'country_score' as const, detailKey: 'country_detail' as const, icon: '🌍' },
  { key: 'keywords', max: 25, scoreKey: 'keyword_score' as const, detailKey: 'keyword_detail' as const, icon: '🔍' },
  { key: 'value', max: 15, scoreKey: 'value_score' as const, detailKey: 'value_detail' as const, icon: '💰' },
  { key: 'urgency', max: 10, scoreKey: 'urgency_score' as const, detailKey: 'urgency_detail' as const, icon: '⏰' },
];

export default function BidFitScoreBreakdown({ score, recommendation, breakdown }: BidFitScoreBreakdownProps) {
  const { t } = useLanguage();

  const colorClass = (rec: string) => {
    switch (rec) {
      case 'HIGH': return 'text-emerald-600';
      case 'MEDIUM': return 'text-amber-600';
      case 'LOW': return 'text-orange-600';
      default: return 'text-gray-500';
    }
  };

  const barColor = (rec: string) => {
    switch (rec) {
      case 'HIGH': return 'bg-emerald-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'LOW': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

  const dimLabels: Record<string, string> = {
    cpv: t('bidfit.dimCpv'),
    country: t('bidfit.dimCountry'),
    keywords: t('bidfit.dimKeywords'),
    value: t('bidfit.dimValue'),
    urgency: t('bidfit.dimUrgency'),
  };

  return (
    <div className="mt-8">
      <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
        {t('bidfit.scoreTitle')}
      </h3>

      {/* Main score display */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
        <div className="flex items-center gap-4 mb-5">
          <div className={`text-4xl font-extrabold ${colorClass(recommendation)}`}>
            {score}%
          </div>
          <div>
            <div className={`text-sm font-bold ${colorClass(recommendation)}`}>
              {recommendation === 'HIGH' && t('bidfit.highMatch')}
              {recommendation === 'MEDIUM' && t('bidfit.mediumMatch')}
              {recommendation === 'LOW' && t('bidfit.lowMatch')}
              {recommendation === 'PASS' && t('bidfit.noMatch')}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {recommendation === 'HIGH' && t('bidfit.highHint')}
              {recommendation === 'MEDIUM' && t('bidfit.mediumHint')}
              {recommendation === 'LOW' && t('bidfit.lowHint')}
              {recommendation === 'PASS' && t('bidfit.passHint')}
            </div>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-3">
          {DIMENSIONS.map((dim) => {
            const dimScore = breakdown[dim.scoreKey];
            const pct = Math.round((dimScore / dim.max) * 100);
            return (
              <div key={dim.key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{dim.icon}</span>
                    <span className="text-xs font-medium text-gray-700">{dimLabels[dim.key]}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-600">{dimScore}/{dim.max}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      pct >= 70 ? 'bg-emerald-400' :
                      pct >= 40 ? 'bg-amber-400' :
                      pct > 0 ? 'bg-orange-400' :
                      'bg-gray-300'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {breakdown[dim.detailKey] && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{breakdown[dim.detailKey]}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
