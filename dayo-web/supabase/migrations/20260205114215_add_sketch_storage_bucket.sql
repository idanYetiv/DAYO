-- Create the diary-sketches storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('diary-sketches', 'diary-sketches', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own sketches
CREATE POLICY "Users can upload their own sketches"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'diary-sketches' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their own sketches
CREATE POLICY "Users can update their own sketches"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'diary-sketches' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to delete their own sketches
CREATE POLICY "Users can delete their own sketches"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'diary-sketches' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read access (since bucket is public)
CREATE POLICY "Public read access for sketches"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'diary-sketches');
