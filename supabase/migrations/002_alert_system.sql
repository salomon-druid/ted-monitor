-- Alert system tables for Ted Monitor
-- Run in Supabase SQL Editor

-- User alert preferences
CREATE TABLE IF NOT EXISTS alert_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  enabled BOOLEAN DEFAULT false,
  min_score INTEGER DEFAULT 70 CHECK (min_score >= 0 AND min_score <= 100),
  cpv_codes TEXT[] DEFAULT '{}',
  countries TEXT[] DEFAULT '{}',
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'instant', 'weekly')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Alert delivery log (dedup + analytics)
CREATE TABLE IF NOT EXISTS alert_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  notice_count INTEGER DEFAULT 0,
  notice_ids TEXT[],
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_alert_prefs_enabled ON alert_preferences(enabled) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS idx_alert_logs_user ON alert_logs(user_id, sent_at DESC);

-- RLS policies
ALTER TABLE alert_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own preferences
CREATE POLICY "Users can manage own alert preferences"
  ON alert_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own alert logs
CREATE POLICY "Users can read own alert logs"
  ON alert_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert alert logs (for the send endpoint)
CREATE POLICY "Service can insert alert logs"
  ON alert_logs FOR INSERT
  WITH CHECK (true);
