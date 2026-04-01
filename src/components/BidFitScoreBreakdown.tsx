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

function RadialGauge({ score, recommendation }: { score: number; recommendation: string }) {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colors: Record<string, { stroke: string; glow: string; text: string }> = {
    HIGH: { stroke: '#10b981', glow: 'rgba(16,185,129,0.15)', text: 'text-emerald-600' },
    MEDIUM: { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.15)', text: 'text-amber-600' },
    LOW: { stroke: '#f97316', glow: 'rgba(249,115,22,0.15)', text: 'text-orange-600' },
    PASS: { stroke: '#9ca3af', glow: 'rgba(156,163,175,0.15)', text: 'text-gray-500' },
  };
  const c = colors[recommendation] || colors.PASS;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow */}
      <div
        className="absolute inset-2 rounded-full"
        style={{ background: c.glow }}
      />
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={c.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-extrabold ${c.text}`}>{score}</span>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

function ScoreBar({ score, max, pct }: { score: number; max: number; pct: number }) {
  const barColor =
    pct >= 70 ? 'bg-emerald-400' :
    pct >= 40 ? 'bg-amber-400' :
    pct > 0 ? 'bg-orange-400' :
    'bg-gray-300';

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function BidFitScoreBreakdown({ score, recommendation, breakdown }: BidFitScoreBreakdownProps) {
  const { t } = useLanguage();

  const dimLabels: Record<string, string> = {
    cpv: t('bidfit.dimCpv'),
    country: t('bidfit.dimCountry'),
    keywords: t('bidfit.dimKeywords'),
    value: t('bidfit.dimValue'),
    urgency: t('bidfit.dimUrgency'),
  };

  const actionText: Record<string, string> = {
    HIGH: t('bidfit.actionHigh'),
    MEDIUM: t('bidfit.actionMedium'),
    LOW: t('bidfit.actionLow'),
    PASS: t('bidfit.actionPass'),
  };

  const matchLabel: Record<string, string> = {
    HIGH: t('bidfit.highMatch'),
    MEDIUM: t('bidfit.mediumMatch'),
    LOW: t('bidfit.lowMatch'),
    PASS: t('bidfit.noMatch'),
  };

  const hintLabel: Record<string, string> = {
    HIGH: t('bidfit.highHint'),
    MEDIUM: t('bidfit.mediumHint'),
    LOW: t('bidfit.lowHint'),
    PASS: t('bidfit.passHint'),
  };

  const borderColor: Record<string, string> = {
    HIGH: 'border-emerald-200',
    MEDIUM: 'border-amber-200',
    LOW: 'border-orange-200',
    PASS: 'border-gray-200',
  };

  const bgColor: Record<string, string> = {
    HIGH: 'bg-emerald-50',
    MEDIUM: 'bg-amber-50',
    LOW: 'bg-orange-50',
    PASS: 'bg-gray-50',
  };

  const textColor: Record<string, string> = {
    HIGH: 'text-emerald-700',
    MEDIUM: 'text-amber-700',
    LOW: 'text-orange-700',
    PASS: 'text-gray-500',
  };

  const btnColor: Record<string, string> = {
    HIGH: 'bg-emerald-600 hover:bg-emerald-700',
    MEDIUM: 'bg-amber-600 hover:bg-amber-700',
    LOW: 'bg-orange-500 hover:bg-orange-600',
    PASS: 'bg-gray-400 hover:bg-gray-500',
  };

  return (
    <div className="mt-8">
      <h3 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-4">
        {t('bidfit.scoreTitle')}
      </h3>

      <div className={`rounded-2xl border ${borderColor[recommendation]} ${bgColor[recommendation]} p-6`}>
        {/* Top section: Gauge + Recommendation */}
        <div className="flex items-center gap-6 mb-6">
          <RadialGauge score={score} recommendation={recommendation} />
          <div className="flex-1">
            <div className={`text-lg font-bold ${textColor[recommendation]} mb-1`}>
              {matchLabel[recommendation]}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {hintLabel[recommendation]}
            </p>
            {recommendation !== 'PASS' && (
              <button className={`text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors ${btnColor[recommendation]}`}>
                {actionText[recommendation]}
              </button>
            )}
          </div>
        </div>

        {/* Breakdown grid */}
        <div className="border-t border-gray-200/60 pt-4">
          <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-3">
            {t('bidfit.breakdown')}
          </div>
          <div className="space-y-3">
            {DIMENSIONS.map((dim) => {
              const dimScore = breakdown[dim.scoreKey];
              const pct = Math.round((dimScore / dim.max) * 100);
              return (
                <div key={dim.key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{dim.icon}</span>
                      <span className="text-xs font-medium text-gray-700">{dimLabels[dim.key]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{dim.max > 0 ? `${dimScore}/${dim.max}` : '—'}</span>
                      {breakdown[dim.detailKey] && (
                        <span className="text-[11px] text-gray-400 hidden sm:inline">· {breakdown[dim.detailKey]}</span>
                      )}
                    </div>
                  </div>
                  <ScoreBar score={dimScore} max={dim.max} pct={pct} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
