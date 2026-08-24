-- ========================================================
-- ELEGANCE FASHION STORAGE BUCKETS & SECURITY POLICIES
-- ========================================================

-- Insert storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('customization-references', 'customization-references', false),
  ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 1. PRODUCT IMAGES STORAGE POLICIES
CREATE POLICY "Public Read Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin Upload Product Images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin Update Product Images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admin Delete Product Images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());

-- 2. CUSTOMIZATION REFERENCES STORAGE POLICIES
CREATE POLICY "User Read Own Customization Images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'customization-references' AND (
      (auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text) OR
      public.is_admin()
    )
  );

CREATE POLICY "User Upload Own Customization Images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'customization-references' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. SITE ASSETS STORAGE POLICIES
CREATE POLICY "Public Read Site Assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

CREATE POLICY "Admin Write Site Assets"
  ON storage.objects FOR ALL
  USING (bucket_id = 'site-assets' AND public.is_admin());
