-- ==============================================================================
-- ELEMEN 2 COHORT WEIGHT TRACKER — SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this entire script in your Supabase SQL Editor:
-- Dashboard -> Your Project -> SQL Editor -> New Query -> Paste & Run (Ctrl+Enter)

-- 1. Create Members Table
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  color TEXT NOT NULL,
  height_cm NUMERIC NOT NULL DEFAULT 0,
  starting_weight_kg NUMERIC NOT NULL,
  target_weight_kg NUMERIC NOT NULL,
  join_date TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create Weight Logs Table
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  weight_kg NUMERIC NOT NULL,
  note TEXT,
  mood TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_members_name ON public.members(name);
CREATE INDEX IF NOT EXISTS idx_weight_logs_member_id ON public.weight_logs(member_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_date ON public.weight_logs(date);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

-- 5. Create Permissive Policies for the Cohort
-- Access is gated at the application layer via Cohort Password Gate + Maintainer PIN.
DROP POLICY IF EXISTS "Allow anon read/write on members" ON public.members;
CREATE POLICY "Allow anon read/write on members"
  ON public.members
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read/write on weight_logs" ON public.weight_logs;
CREATE POLICY "Allow anon read/write on weight_logs"
  ON public.weight_logs
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Enable Realtime Replication for Live Multi-Device Sync
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime FOR TABLE public.members, public.weight_logs;
  ELSE
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;

    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.weight_logs;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;
