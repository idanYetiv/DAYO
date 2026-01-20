-- Diary Enhancements Migration
-- Adds photos, gratitude, and highlights to diary entries

-- Add photos array column (stores Supabase storage URLs)
ALTER TABLE days ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';

-- Add gratitude array column (max 3 items recommended)
ALTER TABLE days ADD COLUMN IF NOT EXISTS gratitude TEXT[] DEFAULT '{}';

-- Add highlights JSONB column (stores array of {emoji, text} objects)
ALTER TABLE days ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]';

-- Create storage bucket for diary photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'diary-photos',
  'diary-photos',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for diary-photos bucket

-- Users can upload their own photos (folder structure: user_id/filename)
CREATE POLICY "Users can upload own diary photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'diary-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own photos
CREATE POLICY "Users can view own diary photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'diary-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own photos
CREATE POLICY "Users can update own diary photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'diary-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own photos
CREATE POLICY "Users can delete own diary photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'diary-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_days_photos ON days USING GIN (photos) WHERE photos != '{}';
CREATE INDEX IF NOT EXISTS idx_days_gratitude ON days USING GIN (gratitude) WHERE gratitude != '{}';
CREATE INDEX IF NOT EXISTS idx_days_highlights ON days USING GIN (highlights) WHERE highlights != '[]';
