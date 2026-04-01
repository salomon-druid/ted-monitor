import { CompanyProfile } from '@/context/CompanyProfileContext';

const EU_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
]);

export interface BidFitResult {
  score: number;
  recommendation: string;
  breakdown: {
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
  };
}

export function computeBidFit(
  notice: {
    cpv_code?: string | null;
    country?: string | null;
    title?: string | null;
    description?: string | null;
    estimated_value?: number | null;
    deadline?: string | null;
  },
  profile: CompanyProfile
): BidFitResult {
  const breakdown = {
    cpv_score: 0, country_score: 0, keyword_score: 0, value_score: 0, urgency_score: 0,
    cpv_detail: '', country_detail: '', keyword_detail: '', value_detail: '', urgency_detail: '',
  };

  // CPV (30 pts)
  if (notice.cpv_code && profile.cpv_codes.length > 0) {
    const nc = notice.cpv_code.trim().padEnd(8, '0').slice(0, 8);
    let matched = false;
    for (const pc of profile.cpv_codes) {
      const padded = pc.trim().padEnd(8, '0').slice(0, 8);
      if (nc === padded) {
        breakdown.cpv_score = 30;
        breakdown.cpv_detail = `Exact CPV: ${nc}`;
        matched = true;
        break;
      }
      if (nc.slice(0, 2) === padded.slice(0, 2)) {
        breakdown.cpv_score = 15;
        breakdown.cpv_detail = `Kategorie: ${nc.slice(0, 2)}xx`;
        matched = true;
        // don't break — exact match might come later
      }
    }
    if (!matched) breakdown.cpv_detail = 'Kein CPV-Treffer';
  } else {
    breakdown.cpv_detail = 'Kein CPV-Vergleich';
  }

  // Country (20 pts)
  if (notice.country && profile.countries.length > 0) {
    const nc = notice.country.toUpperCase().trim();
    const pcUpper = profile.countries.map(c => c.toUpperCase().trim());
    if (pcUpper.includes(nc)) {
      breakdown.country_score = 20;
      breakdown.country_detail = `Match: ${nc}`;
    } else if (EU_COUNTRIES.has(nc) && pcUpper.some(c => EU_COUNTRIES.has(c))) {
      breakdown.country_score = 10;
      breakdown.country_detail = `EU: ${nc}`;
    } else {
      breakdown.country_detail = `Kein Match: ${nc}`;
    }
  }

  // Keywords (25 pts)
  if (profile.keywords.length > 0) {
    const text = `${notice.title || ''} ${notice.description || ''}`.toLowerCase();
    const matched: string[] = [];
    for (const kw of profile.keywords) {
      if (text.includes(kw.toLowerCase().trim())) matched.push(kw);
    }
    if (matched.length > 0) {
      breakdown.keyword_score = Math.min(Math.round((matched.length / profile.keywords.length) * 25), 25);
      breakdown.keyword_detail = `${matched.length}/${profile.keywords.length} Treffer`;
    } else {
      breakdown.keyword_detail = 'Keine Keyword-Treffer';
    }
  }

  // Value (15 pts)
  if (notice.estimated_value === null || notice.estimated_value === undefined) {
    breakdown.value_score = 8;
    breakdown.value_detail = 'Wert unbekannt';
  } else if (profile.min_value === undefined && profile.max_value === undefined) {
    breakdown.value_score = 15;
  } else {
    const val = notice.estimated_value;
    const lo = profile.min_value ?? 0;
    const hi = profile.max_value ?? Infinity;
    if (val >= lo && val <= hi) {
      breakdown.value_score = 15;
      breakdown.value_detail = 'Im Rahmen';
    } else {
      const diffPct = val < lo ? (lo - val) / (lo || 1) : (val - hi) / (hi || 1);
      if (diffPct <= 0.2) { breakdown.value_score = 10; breakdown.value_detail = 'Nah am Rahmen'; }
      else if (diffPct <= 0.5) { breakdown.value_score = 5; breakdown.value_detail = 'Außerhalb'; }
      else { breakdown.value_score = 0; breakdown.value_detail = 'Weit außerhalb'; }
    }
  }

  // Urgency (10 pts)
  if (!notice.deadline) {
    breakdown.urgency_detail = 'Keine Frist';
  } else {
    const days = Math.ceil((new Date(notice.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) { breakdown.urgency_detail = `Abgelaufen (${Math.abs(days)}d)`; }
    else if (days <= 3) { breakdown.urgency_score = 10; breakdown.urgency_detail = `${days} Tage – Sehr dringend`; }
    else if (days <= 7) { breakdown.urgency_score = 8; breakdown.urgency_detail = `${days} Tage – Dringend`; }
    else if (days <= 14) { breakdown.urgency_score = 6; breakdown.urgency_detail = `${days} Tage`; }
    else if (days <= 30) { breakdown.urgency_score = 3; breakdown.urgency_detail = `${days} Tage`; }
    else { breakdown.urgency_score = 1; breakdown.urgency_detail = `${days} Tage`; }
  }

  const total = Math.min(
    breakdown.cpv_score + breakdown.country_score + breakdown.keyword_score + breakdown.value_score + breakdown.urgency_score,
    100
  );

  let recommendation = 'PASS';
  if (total >= 70) recommendation = 'HIGH';
  else if (total >= 45) recommendation = 'MEDIUM';
  else if (total >= 25) recommendation = 'LOW';

  return { score: total, recommendation, breakdown };
}
