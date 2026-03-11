-- Email Campaign System Schema
-- Run this in Supabase SQL Editor

CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  unsubscribe_token UUID DEFAULT gen_random_uuid() UNIQUE
);

CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  preview_text TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  recipient_count INT DEFAULT 0
);

-- Index for fast subscriber lookups
CREATE INDEX idx_subscribers_status ON subscribers(status);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Conversion tracking for booking clicks and other lead actions
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('booking_click')),
  path TEXT NOT NULL,
  label TEXT,
  referrer TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversion_events_type_created_at
  ON conversion_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversion_events_path
  ON conversion_events(path);

-- Editable public schedule data for courses and events
CREATE TABLE IF NOT EXISTS schedule_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('course', 'event')),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  title TEXT NOT NULL,
  icon TEXT,
  schedule_type TEXT CHECK (schedule_type IN ('free', 'paid')),
  price_label TEXT,
  duration TEXT,
  format TEXT,
  date_label TEXT NOT NULL,
  time_label TEXT,
  description TEXT NOT NULL,
  location TEXT,
  highlights TEXT[],
  sponsor TEXT,
  contact_label TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schedule_items_kind_status_sort
  ON schedule_items(kind, status, sort_order);
