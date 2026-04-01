'use client';

import { useLanguage } from '@/context/LanguageContext';

interface BidFitBadgeProps {
  score: number;
  recommendation: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
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
    sm: { container: 'px-1.5 py-0.5', text: 'text-[10px]', bar: 'h-1', barWidth: 'w-10' },
    md: { container: 'px-2.5 py-1', text: 'text-xs', bar: 'h-1.5', barWidth: 'w-14' },
    lg: { container: 'px-3 py-1.5', text: 'text-sm', bar: 'h-2', barWidth: 'w-20' },
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
    <div className={`inline-flex items-center gap-2 rounded-lg ring-1 ${colors.ring} ${colors.bg} ${sz.container}`}>
      <span className={`font-bold ${colors.text} ${sz.text}`}>{score}%</span>
      {showLabel && (
        <span className={`${sz.text} ${colors.text} font-medium`}>
          {labelMap[recommendation]}
        </span>
      )}
      {/* Mini progress bar */}
      <div className={`${sz.bar} ${sz.barWidth} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${sz.bar} rounded-full transition-all duration-500 ${
            recommendation === 'HIGH' ? 'bg-emerald-500' :
            recommendation === 'MEDIUM' ? 'bg-amber-500' :
            recommendation === 'LOW' ? 'bg-orange-500' :
            'bg-gray-400'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
