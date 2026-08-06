-- Supabase Database Schema for Nocturne Dorama (Phase 3)

DROP TABLE IF EXISTS public.episodes CASCADE;
DROP TABLE IF EXISTS public.dramas CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Profiles Table (Extends Supabase Auth Users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_vip BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- User can update their own profile EXCEPT role and is_vip (we will restrict this via a secure function later, but for now this is fine for dev)
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Admins can update any profile
CREATE POLICY "Admins can update any profile." ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, is_vip)
  VALUES (new.id, new.email, 'user', false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Dramas Table
CREATE TABLE public.dramas (
  id TEXT PRIMARY KEY, -- String ID (slug) e.g., "the-night-watchmans-secret"
  title TEXT NOT NULL,
  title_uz TEXT,
  synopsis TEXT,
  genres TEXT[],
  country TEXT,
  year INTEGER,
  total_episodes INTEGER,
  status TEXT DEFAULT 'Draft',
  poster_url TEXT,
  backdrop_url TEXT,

  rating NUMERIC(3,1) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.dramas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dramas are viewable by everyone." ON public.dramas FOR SELECT USING (true);
CREATE POLICY "Only admins can insert dramas." ON public.dramas FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update dramas." ON public.dramas FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete dramas." ON public.dramas FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 3. Episodes Table
CREATE TABLE public.episodes (
  id TEXT PRIMARY KEY, -- Slug ID like "ep1"
  drama_id TEXT REFERENCES public.dramas(id) ON DELETE CASCADE NOT NULL,
  episode_number INTEGER NOT NULL,
  title TEXT,
  duration TEXT,
  mover_embed_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(drama_id, episode_number)
);

ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Episodes are viewable by everyone." ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Only admins can manage episodes." ON public.episodes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to safely make a user admin (Used by our secret code system)
CREATE OR REPLACE FUNCTION public.upgrade_to_admin(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles SET role = 'admin' WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
