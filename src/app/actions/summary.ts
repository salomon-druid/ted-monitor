'use server';

import { createClient } from '@supabase/supabase-js';

export interface SummaryResult {
  notice_id: string;
  executive_summary: string;
  requirements: string[];
  key_dates: string[];
  next_steps: string[];
  model_used: string;
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'anthropic/claude-3.5-sonnet';

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase credentials not configured');
  return createClient(url, key);
}

function buildPrompt(notice: Record<string, unknown>): string {
  return `You are a procurement analyst. Analyse the following EU public procurement notice and return a JSON object with these exact fields:

- executive_summary: A concise 3-5 sentence overview of this procurement opportunity
- requirements: An array of strings listing key requirements extracted from the notice
- key_dates: An array of strings describing important dates and deadlines
- next_steps: An array of strings with recommended actions for a potential bidder

Return ONLY valid JSON. No markdown, no explanation.

NOTICE:
Title: ${notice.title || 'N/A'}
Buyer: ${notice.buyer_name || 'N/A'}
Country: ${notice.country || 'N/A'}
CPV Codes: ${notice.cpv_code || 'N/A'}
Estimated Value: ${notice.estimated_value || 'N/A'} ${notice.estimated_value_currency || ''}
Publication Date: ${notice.publication_date || 'N/A'}
Deadline: ${notice.deadline || 'N/A'}
Procedure Type: ${notice.procedure_type || 'N/A'}
Description: ${notice.description || 'N/A'}`;
}

function parseResponse(raw: string): Record<string, unknown> {
  let text = raw.trim();
  // Strip markdown code fences
  if (text.startsWith('```')) {
    const lines = text.split('\n');
    text = lines.length > 2 ? lines.slice(1, -1).join('\n') : text;
  }
  try {
    return JSON.parse(text);
  } catch {
    return {
      executive_summary: text.slice(0, 500),
      requirements: [],
      key_dates: [],
      next_steps: [],
    };
  }
}

export async function generateSummary(noticeId: string): Promise<SummaryResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not set');
  }

  // Fetch notice from Supabase
  const supabase = getSupabase();
  const { data: notice, error } = await supabase
    .from('notices')
    .select('*')
    .eq('notice_id', noticeId)
    .single();

  if (error || !notice) {
    throw new Error(`Notice ${noticeId} not found`);
  }

  // Call OpenRouter
  const prompt = buildPrompt(notice);
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '';
  const parsed = parseResponse(raw);

  return {
    notice_id: noticeId,
    executive_summary: (parsed.executive_summary as string) || '',
    requirements: (parsed.requirements as string[]) || [],
    key_dates: (parsed.key_dates as string[]) || [],
    next_steps: (parsed.next_steps as string[]) || [],
    model_used: DEFAULT_MODEL,
  };
}
