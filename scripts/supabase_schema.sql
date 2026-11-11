-- ========================================================
-- HB+ Portal Database Schema & Row Level Security (RLS)
-- Paste this into Supabase Dashboard -> SQL Editor -> Run
-- ========================================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  domain TEXT NOT NULL,
  last_login_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Authenticated users can read all profiles (for directory)
CREATE POLICY "Allow authenticated read profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Policy: Users can update their own profile
CREATE POLICY "Allow users update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id);

-- 5. Policy: Allow insert during OAuth login
CREATE POLICY "Allow insert during auth"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 6. Insert initial seed users
INSERT INTO public.profiles (id, email, full_name, role, domain, last_login_at)
VALUES 
  ('usr_admin_seed', 'admin@hbplus.fit', 'Chief Security Officer', 'admin', 'hbplus.fit', NOW()),
  ('usr_member_seed_1', 'sarah.fitness@hbplus.fit', 'Sarah Jenkins', 'user', 'hbplus.fit', NOW()),
  ('usr_member_seed_2', 'alex.trainer@hbplus.fit', 'Alex Rivera', 'user', 'hbplus.fit', NOW())
ON CONFLICT (email) DO NOTHING;
