-- ========================================================
-- ELEGANCE FASHION REALISTIC SEED DATA (SRI LANKA LKR)
-- Valid Hexadecimal UUID Format (0-9, a-f)
-- ========================================================

-- 1. INSERT CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, is_active, display_order)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'T-Shirts', 't-shirts', 'Premium printed cotton unisex T-shirts with modern artistic graphics and soft breathability.', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', true, 1),
  ('22222222-0000-0000-0000-000000000002', 'Kurtas', 'kurtas', 'Elegant women Kurtas featuring intricate handcrafted embroidery, linen blends, and modern silhouettes.', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80', true, 2),
  ('33333333-0000-0000-0000-000000000003', 'Blouses', 'blouses', 'Tailored women Blouses designed for formal elegance, casual chic, and saree pairing perfection.', 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&auto=format&fit=crop&q=80', true, 3)
ON CONFLICT (slug) DO NOTHING;

-- 2. INSERT PRODUCTS
-- T-SHIRTS
INSERT INTO public.products (id, category_id, name, slug, product_code, short_description, full_description, base_price, sale_price, featured, is_active, stock_status, care_instructions, material)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    '11111111-0000-0000-0000-000000000001',
    'Minimalist Tropical Palm Graphic Tee',
    'minimalist-tropical-palm-graphic-tee',
    'TS-PALM-01',
    'Soft 100% combed cotton unisex printed T-shirt with signature island palm print.',
    'Elevate your daily streetwear with our signature Tropical Palm Graphic Tee. Crafted from 180 GSM ring-spun combed cotton for maximum breathability and durability. Designed with screen-printed chest detail that stays vivid wash after wash.',
    2850.00,
    2450.00,
    true,
    true,
    'in_stock',
    'Machine wash cold inside-out with like colours. Tumble dry low or line dry in shade. Do not iron directly on print.',
    '100% Ring-Spun Combed Cotton (180 GSM)'
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    '11111111-0000-0000-0000-000000000001',
    'Colombo Heritage Typographic T-Shirt',
    'colombo-heritage-typographic-t-shirt',
    'TS-COL-02',
    'Urban streetwear graphic tee highlighting Colombo coastal coordinates.',
    'A tribute to urban island culture. Features bold typography and geometric linework printed with eco-friendly water-based ink. Pre-shrunk fit suitable for both men and women.',
    3100.00,
    NULL,
    true,
    true,
    'in_stock',
    'Hand wash or gentle cold machine wash. Do not bleach. Cool iron on reverse side.',
    '95% Organic Cotton, 5% Elastane'
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    '11111111-0000-0000-0000-000000000001',
    'Abstract Line Art Unisex Tee',
    'abstract-line-art-unisex-tee',
    'TS-ART-03',
    'Modern aesthetic line art print on heavyweight premium cotton.',
    'Clean, sophisticated, and comfortable. Our Abstract Line Art Tee blends contemporary visual design with casual everyday relaxed fit.',
    2950.00,
    2600.00,
    false,
    true,
    'in_stock',
    'Machine wash warm. Tumble dry medium. Warm iron if needed.',
    '100% Heavyweight Cotton (210 GSM)'
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    '11111111-0000-0000-0000-000000000001',
    'Vintage Sunset Crest Printed T-Shirt',
    'vintage-sunset-crest-printed-t-shirt',
    'TS-SUN-04',
    'Retro sunset crest print with relaxed drop-shoulder cut.',
    'Embrace retro island vibes with our Vintage Sunset Crest tee. Pre-washed for superior softness and a subtle vintage patina from day one.',
    3200.00,
    2900.00,
    false,
    true,
    'in_stock',
    'Cold wash inside out. Line dry in shade.',
    '100% Bio-Washed Cotton'
  ),

-- KURTAS
  (
    'a2000000-0000-0000-0000-000000000001',
    '22222222-0000-0000-0000-000000000002',
    'Royal Emerald Embroidered Cotton Kurta',
    'royal-emerald-embroidered-cotton-kurta',
    'KR-EME-01',
    'Hand-embroidered neckline Kurta in rich emerald green cotton linen blend.',
    'Designed for elegance and daily comfort. Features delicate zari embroidery along the mandarin neck collar, 3/4 sleeves with side slits, and comfortable straight cut.',
    5850.00,
    5200.00,
    true,
    true,
    'in_stock',
    'Dry clean recommended or gentle hand wash in cold water with mild detergent.',
    'Premium Linen Cotton Blend with Metallic Zari Work'
  ),
  (
    'a2000000-0000-0000-0000-000000000002',
    '22222222-0000-0000-0000-000000000002',
    'Sun Gold Block Printed Straight Kurta',
    'sun-gold-block-printed-straight-kurta',
    'KR-GLD-02',
    'Traditional woodblock printed motifs on breathable golden yellow cotton.',
    'Brighten your festive and casual wardrobe. This straight-cut Kurta offers breathable comfort with traditional floral block print and subtle mirror highlights.',
    4900.00,
    NULL,
    true,
    true,
    'in_stock',
    'Gentle hand wash separately in cold water. Do not soak.',
    '100% Handloom Breathable Cotton'
  ),
  (
    'a2000000-0000-0000-0000-000000000003',
    '22222222-0000-0000-0000-000000000002',
    'Blush Pink Floral Anarkali Kurta',
    'blush-pink-floral-anarkali-kurta',
    'KR-PNK-03',
    'Flowing flared Anarkali silhouette with botanical floral embroidery.',
    'Graceful, flattering, and effortless. Features a fitted bodice with quarter sleeves and a flowing flared skirt detail.',
    6500.00,
    5900.00,
    false,
    true,
    'in_stock',
    'Dry clean only.',
    'Soft Cotton Silk Blend'
  ),
  (
    'a2000000-0000-0000-0000-000000000004',
    '22222222-0000-0000-0000-000000000002',
    'Midnight Navy Pintuck Casual Kurta',
    'midnight-navy-pintuck-casual-kurta',
    'KR-NAV-04',
    'Classic pintuck textured front with wooden button accents.',
    'Ideal for office wear and casual outings. Navy blue straight tunic Kurta with subtle pintuck detailing and roll-up sleeve tabs.',
    4500.00,
    3990.00,
    false,
    true,
    'in_stock',
    'Machine wash cold gentle cycle. Warm iron.',
    '100% Pure Slub Cotton'
  ),

-- BLOUSES
  (
    'a3000000-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000003',
    'Crimson Velvet Sweetheart Saree Blouse',
    'crimson-velvet-sweetheart-saree-blouse',
    'BL-RED-01',
    'Tailored sweetheart neck blouse in rich deep crimson stretch velvet.',
    'A show-stopping blouse designed for weddings and special evening celebrations. Features a sculpted sweetheart neck, elbow sleeves, and padded back hook closure.',
    4200.00,
    3800.00,
    true,
    true,
    'in_stock',
    'Dry clean only. Store on padded hanger.',
    'Luxury Micro-Velvet with Cotton Lining'
  ),
  (
    'a3000000-0000-0000-0000-000000000002',
    '33333333-0000-0000-0000-000000000003',
    'Ivory Silk High-Neck Formal Work Blouse',
    'ivory-silk-high-neck-formal-work-blouse',
    'BL-IVR-02',
    'Sophisticated high neck buttoned blouse suitable for formal suits and sarees.',
    'Timeless versatility. Tailored from lustrous ivory faux silk with delicate cuff buttons and a smooth concealed front button placket.',
    3600.00,
    NULL,
    true,
    true,
    'in_stock',
    'Hand wash cold or dry clean. Low iron.',
    'Faux Raw Silk'
  ),
  (
    'a3000000-0000-0000-0000-000000000003',
    '33333333-0000-0000-0000-000000000003',
    'Black Brocade Elbow-Length Designer Blouse',
    'black-brocade-elbow-length-designer-blouse',
    'BL-BLK-03',
    'Golden woven jacquard brocade with deep V-back cut.',
    'Rich texture meet precise tailoring. Pair effortlessly with silk sarees or high-waisted festive skirts.',
    4500.00,
    3950.00,
    false,
    true,
    'in_stock',
    'Dry clean recommended.',
    'Banarasi Jacquard Brocade'
  ),
  (
    'a3000000-0000-0000-0000-000000000004',
    '33333333-0000-0000-0000-000000000003',
    'Pastel Pink Puff Sleeve Linen Blouse',
    'pastel-pink-puff-sleeve-linen-blouse',
    'BL-PNK-04',
    'Modern romantic puff sleeves with front waist wrap ties.',
    'Contemporary feminine design. Puff sleeves with elastic cuffs and adjustable waist wrap ties for an exquisite custom silhouette.',
    3800.00,
    3350.00,
    false,
    true,
    'in_stock',
    'Machine wash gentle cold. Iron while damp.',
    '100% Washed European Linen'
  )
ON CONFLICT (slug) DO NOTHING;

-- 3. INSERT PRODUCT IMAGES
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 'Minimalist Tropical Palm Graphic Tee Front View', 1, true),
  ('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', 'Minimalist Tropical Palm Graphic Tee Model Angle', 2, false),
  ('a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80', 'Colombo Heritage Typographic T-Shirt Black', 1, true),
  ('a1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=80', 'Abstract Line Art Unisex Tee White', 1, true),
  ('a1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80', 'Vintage Sunset Crest Printed T-Shirt Mustard', 1, true),
  
  ('a2000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80', 'Royal Emerald Embroidered Cotton Kurta Main', 1, true),
  ('a2000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80', 'Sun Gold Block Printed Straight Kurta', 1, true),
  ('a2000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80', 'Blush Pink Floral Anarkali Kurta', 1, true),
  ('a2000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1583391733975-ac4736f8d3fa?w=800&auto=format&fit=crop&q=80', 'Midnight Navy Pintuck Casual Kurta', 1, true),

  ('a3000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&auto=format&fit=crop&q=80', 'Crimson Velvet Sweetheart Saree Blouse', 1, true),
  ('a3000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&auto=format&fit=crop&q=80', 'Ivory Silk High-Neck Formal Work Blouse', 1, true),
  ('a3000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&auto=format&fit=crop&q=80', 'Black Brocade Elbow-Length Designer Blouse', 1, true),
  ('a3000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80', 'Pastel Pink Puff Sleeve Linen Blouse', 1, true)
ON CONFLICT DO NOTHING;

-- 4. INSERT PRODUCT VARIANTS (Sizes & Colours)
INSERT INTO public.product_variants (product_id, sku, size, colour, stock_quantity, price_adjustment, is_active)
VALUES
  -- TS-PALM-01
  ('a1000000-0000-0000-0000-000000000001', 'TS-PALM-BLK-S', 'S', 'Black', 15, 0.00, true),
  ('a1000000-0000-0000-0000-000000000001', 'TS-PALM-BLK-M', 'M', 'Black', 25, 0.00, true),
  ('a1000000-0000-0000-0000-000000000001', 'TS-PALM-BLK-L', 'L', 'Black', 20, 0.00, true),
  ('a1000000-0000-0000-0000-000000000001', 'TS-PALM-WHT-M', 'M', 'White', 12, 0.00, true),

  -- TS-COL-02
  ('a1000000-0000-0000-0000-000000000002', 'TS-COL-NAV-M', 'M', 'Navy Blue', 18, 0.00, true),
  ('a1000000-0000-0000-0000-000000000002', 'TS-COL-NAV-L', 'L', 'Navy Blue', 10, 0.00, true),
  ('a1000000-0000-0000-0000-000000000002', 'TS-COL-BLK-L', 'L', 'Black', 5, 0.00, true),

  -- TS-ART-03
  ('a1000000-0000-0000-0000-000000000003', 'TS-ART-WHT-S', 'S', 'White', 8, 0.00, true),
  ('a1000000-0000-0000-0000-000000000003', 'TS-ART-WHT-M', 'M', 'White', 15, 0.00, true),

  -- TS-SUN-04
  ('a1000000-0000-0000-0000-000000000004', 'TS-SUN-MST-M', 'M', 'Mustard Yellow', 14, 0.00, true),
  ('a1000000-0000-0000-0000-000000000004', 'TS-SUN-MST-L', 'L', 'Mustard Yellow', 2, 0.00, true),

  -- KR-EME-01
  ('a2000000-0000-0000-0000-000000000001', 'KR-EME-GRN-S', 'S', 'Emerald Green', 8, 0.00, true),
  ('a2000000-0000-0000-0000-000000000001', 'KR-EME-GRN-M', 'M', 'Emerald Green', 12, 0.00, true),
  ('a2000000-0000-0000-0000-000000000001', 'KR-EME-GRN-XL', 'XL', 'Emerald Green', 4, 0.00, true),

  -- KR-GLD-02
  ('a2000000-0000-0000-0000-000000000002', 'KR-GLD-YEL-M', 'M', 'Sun Gold', 10, 0.00, true),
  ('a2000000-0000-0000-0000-000000000002', 'KR-GLD-YEL-L', 'L', 'Sun Gold', 6, 0.00, true),

  -- KR-PNK-03
  ('a2000000-0000-0000-0000-000000000003', 'KR-PNK-ROS-M', 'M', 'Blush Pink', 7, 0.00, true),

  -- KR-NAV-04
  ('a2000000-0000-0000-0000-000000000004', 'KR-NAV-BLU-L', 'L', 'Midnight Navy', 15, 0.00, true),

  -- BL-RED-01
  ('a3000000-0000-0000-0000-000000000001', 'BL-RED-CRM-S', '34', 'Crimson Red', 6, 0.00, true),
  ('a3000000-0000-0000-0000-000000000001', 'BL-RED-CRM-M', '36', 'Crimson Red', 10, 0.00, true),
  ('a3000000-0000-0000-0000-000000000001', 'BL-RED-CRM-L', '38', 'Crimson Red', 5, 0.00, true),

  -- BL-IVR-02
  ('a3000000-0000-0000-0000-000000000002', 'BL-IVR-WHT-S', '34', 'Ivory White', 9, 0.00, true),
  ('a3000000-0000-0000-0000-000000000002', 'BL-IVR-WHT-M', '36', 'Ivory White', 14, 0.00, true),

  -- BL-BLK-03
  ('a3000000-0000-0000-0000-000000000003', 'BL-BLK-GLD-M', '36', 'Black Gold', 11, 0.00, true),

  -- BL-PNK-04
  ('a3000000-0000-0000-0000-000000000004', 'BL-PNK-ROSE-S', '34', 'Soft Pink', 8, 0.00, true)
ON CONFLICT (sku) DO NOTHING;

-- 5. INSERT SITE SETTINGS
INSERT INTO public.site_settings (
  id, business_name, logo_url, business_email, business_phone, whatsapp_number, address, about_content, delivery_information, return_policy, social_links, primary_colour
)
VALUES (
  'f1000000-0000-0000-0000-000000000001',
  'Style Loom',
  '/logo.jpg',
  'info@styleloom.lk',
  '+94 71 490 3231',
  '94714903231',
  'No. 123, High Level Road, Nugegoda, Colombo, Sri Lanka',
  'Style That Speaks, Quality That Lasts. Welcome to Style Loom, your premier destination for high-quality printed T-shirts, handcrafted women Kurtas, and exquisitely tailored saree and modern Blouses in Sri Lanka.',
  'We offer fast island-wide delivery across Sri Lanka within 3 to 5 business days. A flat shipping rate of LKR 350 applies to all standard orders. Express Colombo delivery is available upon request.',
  'We offer a 7-day hassle-free size exchange policy. If your item does not fit perfectly, contact our team via WhatsApp to arrange a replacement. Items must be unworn with original tags attached.',
  '{"facebook": "https://facebook.com/styleloomlk", "instagram": "https://instagram.com/styleloomlk", "tiktok": "https://tiktok.com/@styleloomlk"}'::jsonb,
  '#e11d48'
)
ON CONFLICT (id) DO NOTHING;
