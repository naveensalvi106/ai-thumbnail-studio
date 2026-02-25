
-- Create storage bucket for thumbnail uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnail-uploads', 'thumbnail-uploads', true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload thumbnail files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thumbnail-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access
CREATE POLICY "Thumbnail uploads are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnail-uploads');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own thumbnail uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'thumbnail-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add face_reaction_url and main_image_url columns to thumbnail_requests
ALTER TABLE public.thumbnail_requests
ADD COLUMN face_reaction_url TEXT,
ADD COLUMN main_image_url TEXT;
