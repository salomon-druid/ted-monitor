'use client';

import { useLanguage } from '@/context/LanguageContext';

interface BidFitBadgeProps {
  score: number;
  recommendation: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function MiniGauge({ score, recommendation, size }: { score: number; recommendation: string; size: number }) {
  const strokeWidth = size >= 36 ? 4 : 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    recommendation === 'HIGH' ? '#10b981' :
    recommendation === 'MEDIUM' ? '#f59e0b' :
    recommendation === 'LOW' ? '#f97316' :
    '#9ca3af';

  return (
    <svg width={size} height={size} className="transform -rotate-90 flex-shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
    </svg>
  );
}

export default function BidFitBadge({ score, recommendation, size = 'md', showLabel = true }: BidFitBadgeProps) {
  const { t } = useLanguage();

  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    HIGH: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
    MEDIUM: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
    LOW: { bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-200' },
    PASS: { bg: 'bg-gray-50', text: 'text-gray-500', ring: 'ring-gray-200' },
  };

  const sizeMap = {
    sm: { container: 'px-2 py-1.5', text: 'text-[11px]', gauge: 28, scoreClass: 'text-xs' },
    md: { container: 'px-3 py-2', text: 'text-xs', gauge: 36, scoreClass: 'text-sm' },
    lg: { container: 'px-4 py-2.5', text: 'text-sm', gauge: 44, scoreClass: 'text-base' },
  };

  const colors = colorMap[recommendation] || colorMap.PASS;
  const sz = sizeMap[size];

  const labelMap: Record<string, string> = {
    HIGH: t('bidfit.high'),
    MEDIUM: t('bidfit.medium'),
    LOW: t('bidfit.low'),
    PASS: t('bidfit.pass'),
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-xl ring-1 ${colors.ring} ${colors.bg} ${sz.container}`}>
      <div className="relative flex items-center justify-center">
        <MiniGauge score={score} recommendation={recommendation} size={sz.gauge} />
        <span className={`absolute font-bold ${colors.text} ${sz.scoreClass}`}>{score}</span>
      </div>
      {showLabel && (
        <span className={`${sz.text} ${colors.text} font-semibold`}>
          {labelMap[recommendation]}
        </span>
      )}
    </div>
  );
}
