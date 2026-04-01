import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface CompanyProfile {
  cpv_codes: string[];
  countries: string[];
  keywords: string[];
  min_value?: number;
  max_value?: number;
}

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

const EU_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
]);

function scoreCPV(noticeCodes: string[], profileCodes: string[]): { score: number; detail: string } {
  if (!profileCodes.length || !noticeCodes.length) {
    return { score: 0, detail: 'No CPV codes to compare' };
  }
  for (const nc of noticeCodes) {
    const paddedNc = nc.trim().padEnd(8, '0').slice(0, 8);
    for (const pc of profileCodes) {
      const paddedPc = pc.trim().padEnd(8, '0').slice(0, 8);
      if (paddedNc === paddedPc) {
        return { score: 30, detail: `Exact CPV match: ${paddedNc}` };
      }
      if (paddedNc.slice(0, 2) === paddedPc.slice(0, 2)) {
        return { score: 15, detail: `CPV category match: ${paddedNc.slice(0, 2)}xx` };
      }
    }
  }
  return { score: 0, detail: 'No CPV overlap' };
}

function scoreCountry(noticeCountry: string | null, profileCountries: string[]): { score: number; detail: string } {
  if (!noticeCountry) return { score: 0, detail: 'Notice has no country' };
  if (!profileCountries.length) return { score: 0, detail: 'Profile has no countries set' };
  const nc = noticeCountry.toUpperCase().trim();
  const pcUpper = profileCountries.map(c => c.toUpperCase().trim());
  if (pcUpper.includes(nc)) {
    return { score: 20, detail: `Exact country match: ${nc}` };
  }
  if (EU_COUNTRIES.has(nc) && pcUpper.some(c => EU_COUNTRIES.has(c))) {
    return { score: 10, detail: `EU country match: ${nc}` };
  }
  return { score: 0, detail: `No country overlap (${nc})` };
}

function scoreKeywords(text: string, keywords: string[]): { score: number; detail: string } {
  if (!keywords.length || !text) return { score: 0, detail: 'No keywords to compare' };
  const textLower = text.toLowerCase();
  const matched: string[] = [];
  for (const kw of keywords) {
    const kwLower = kw.toLowerCase().trim();
    if (textLower.includes(kwLower)) {
      matched.push(kw);
    }
  }
  if (!matched.length) return { score: 0, detail: 'No keyword overlap' };
  const ratio = matched.length / keywords.length;
  const score = Math.min(Math.round(ratio * 25), 25);
  return { score, detail: `${matched.length}/${keywords.length} keywords matched: ${matched.join(', ')}` };
}

function scoreValue(estimatedValue: number | null, minValue?: number, maxValue?: number): { score: number; detail: string } {
  if (estimatedValue === null || estimatedValue === undefined) {
    return { score: 8, detail: 'Value unknown (mid-range default)' };
  }
  if (minValue === undefined && maxValue === undefined) {
    return { score: 15, detail: 'No value constraints in profile' };
  }
  const val = estimatedValue;
  const lo = minValue ?? 0;
  const hi = maxValue ?? Infinity;
  if (val >= lo && val <= hi) {
    return { score: 15, detail: `Value ${val.toLocaleString()} within range` };
  }
  const diffPct = val < lo ? (lo - val) / (lo || 1) : (val - hi) / (hi || 1);
  if (diffPct <= 0.2) return { score: 10, detail: `Value ${val.toLocaleString()} close to range` };
  if (diffPct <= 0.5) return { score: 5, detail: `Value ${val.toLocaleString()} somewhat outside range` };
  return { score: 0, detail: `Value ${val.toLocaleString()} far outside range` };
}

function scoreUrgency(deadline: string | null): { score: number; detail: string } {
  if (!deadline) return { score: 0, detail: 'No deadline set' };
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { score: 0, detail: `Deadline passed (${days}d ago)` };
  if (days <= 3) return { score: 10, detail: `Very urgent – ${days} days left` };
  if (days <= 7) return { score: 8, detail: `Urgent – ${days} days left` };
  if (days <= 14) return { score: 6, detail: `Approaching – ${days} days left` };
  if (days <= 30) return { score: 3, detail: `${days} days left` };
  return { score: 1, detail: `${days} days left (plenty of time)` };
}

function getRecommendation(score: number): string {
  if (score >= 70) return 'HIGH';
  if (score >= 45) return 'MEDIUM';
  if (score >= 25) return 'LOW';
  return 'PASS';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notice, profile } = body as {
      notice: {
        cpv_code?: string | null;
        cpv_codes?: string[];
        country?: string | null;
        title?: string | null;
        description?: string | null;
        estimated_value?: number | null;
        deadline?: string | null;
      };
      profile: CompanyProfile;
    };

    if (!notice || !profile) {
      return NextResponse.json({ error: 'Missing notice or profile' }, { status: 400 });
    }

    const noticeCodes = notice.cpv_codes || (notice.cpv_code ? [notice.cpv_code] : []);
    const text = `${notice.title || ''} ${notice.description || ''}`;

    const cpv = scoreCPV(noticeCodes, profile.cpv_codes);
    const country = scoreCountry(notice.country ?? null, profile.countries);
    const kw = scoreKeywords(text, profile.keywords);
    const val = scoreValue(notice.estimated_value ?? null, profile.min_value, profile.max_value);
    const urgency = scoreUrgency(notice.deadline ?? null);

    const total = Math.min(
      cpv.score + country.score + kw.score + val.score + urgency.score,
      100
    );

    const breakdown: ScoreBreakdown = {
      cpv_score: cpv.score,
      country_score: country.score,
      keyword_score: kw.score,
      value_score: val.score,
      urgency_score: urgency.score,
      cpv_detail: cpv.detail,
      country_detail: country.detail,
      keyword_detail: kw.detail,
      value_detail: val.detail,
      urgency_detail: urgency.detail,
    };

    return NextResponse.json({
      score: total,
      recommendation: getRecommendation(total),
      breakdown,
    });
  } catch (err) {
    console.error('BidFit score error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
