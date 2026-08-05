-- Run this in your Supabase SQL Editor to add the new columns!

ALTER TABLE public.dramas 
ADD COLUMN IF NOT EXISTS release_days TEXT[],
ADD COLUMN IF NOT EXISTS release_time TEXT;
