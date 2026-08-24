-- ========================================================
-- ELEGANCE FASHION E-COMMERCE DATABASE SCHEMA & MIGRATIONS
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  product_code TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  sale_price NUMERIC(10, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
  care_instructions TEXT,
  material TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  size TEXT NOT NULL,
  colour TEXT NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  price_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cart_items_user_product_variant_unique UNIQUE (user_id, product_id, variant_id)
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  status TEXT NOT NULL DEFAULT 'whatsapp_pending' CHECK (status IN ('whatsapp_pending', 'received', 'confirmed', 'preparing', 'completed', 'cancelled')),
  whatsapp_opened_at TIMESTAMPTZ,
  customer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  product_code_snapshot TEXT NOT NULL,
  variant_snapshot TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. CUSTOMIZATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.customization_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('Printed T-Shirt', 'Kurta', 'Blouse')),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  preferred_colour TEXT,
  preferred_fabric TEXT,
  selected_size TEXT,
  measurements JSONB DEFAULT '{}'::jsonb,
  print_or_design_type TEXT,
  design_placement TEXT,
  design_description TEXT,
  reference_image_url TEXT,
  required_date DATE,
  estimated_budget NUMERIC(10, 2),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'whatsapp_pending' CHECK (status IN ('whatsapp_pending', 'received', 'discussing', 'quoted', 'confirmed', 'completed', 'cancelled')),
  whatsapp_opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PRODUCT REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT product_reviews_user_product_unique UNIQUE (user_id, product_id)
);

-- 11. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL DEFAULT 'Elegance Fashion Sri Lanka',
  logo_url TEXT,
  business_email TEXT NOT NULL DEFAULT 'info@elegancefashion.lk',
  business_phone TEXT NOT NULL DEFAULT '+94 71 490 3231',
  whatsapp_number TEXT NOT NULL DEFAULT '94714903231',
  address TEXT NOT NULL DEFAULT 'No. 123, High Level Road, Colombo, Sri Lanka',
  about_content TEXT NOT NULL DEFAULT 'At Elegance Fashion, we craft premium printed T-shirts, elegant women Kurtas, and beautifully structured Blouses tailored with love and precision.',
  delivery_information TEXT NOT NULL DEFAULT 'Island-wide delivery within 3-5 working days. Flat rate shipping fee LKR 350 across Sri Lanka.',
  return_policy TEXT NOT NULL DEFAULT '7-day easy exchange policy for size exchanges or manufacturing defects. Returned items must be unworn and in original condition.',
  social_links JSONB DEFAULT '{"facebook": "https://facebook.com", "instagram": "https://instagram.com", "tiktok": "https://tiktok.com"}'::jsonb,
  primary_colour TEXT NOT NULL DEFAULT '#E11D48',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_images_product ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_customizations_user ON public.customization_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.product_reviews(product_id);

-- UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- APPLY UPDATED_AT TRIGGERS
CREATE TRIGGER trigger_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trigger_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trigger_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trigger_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trigger_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trigger_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trigger_customization_requests_updated_at BEFORE UPDATE ON public.customization_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trigger_product_reviews_updated_at BEFORE UPDATE ON public.product_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- NEW USER AUTH TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Customer'),
    NEW.email,
    'customer'
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- IS_ADMIN HELPER FUNCTION FOR RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ROW-LEVEL SECURITY (RLS) SETUP
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profile view" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id AND role = 'customer') WITH CHECK (auth.uid() = id AND role = 'customer');
CREATE POLICY "Admins full access profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- 2. CATEGORIES POLICIES
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (public.is_admin());

-- 3. PRODUCTS POLICIES
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (public.is_admin());

-- 4. PRODUCT IMAGES POLICIES
CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admin write product images" ON public.product_images FOR ALL USING (public.is_admin());

-- 5. PRODUCT VARIANTS POLICIES
CREATE POLICY "Public read variants" ON public.product_variants FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin write variants" ON public.product_variants FOR ALL USING (public.is_admin());

-- 6. CART ITEMS POLICIES
CREATE POLICY "Users read own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins full access cart" ON public.cart_items FOR ALL USING (public.is_admin());

-- 7. ORDERS POLICIES
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin write orders" ON public.orders FOR ALL USING (public.is_admin());

-- 8. ORDER ITEMS POLICIES
CREATE POLICY "Users read own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Users insert order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admin write order items" ON public.order_items FOR ALL USING (public.is_admin());

-- 9. CUSTOMIZATION REQUESTS POLICIES
CREATE POLICY "Users read own customizations" ON public.customization_requests FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert customizations" ON public.customization_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin write customizations" ON public.customization_requests FOR ALL USING (public.is_admin());

-- 10. PRODUCT REVIEWS POLICIES
CREATE POLICY "Public read approved reviews" ON public.product_reviews FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert own reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admin write reviews" ON public.product_reviews FOR ALL USING (public.is_admin());

-- 11. FEEDBACK POLICIES
CREATE POLICY "Users read own feedback" ON public.feedback FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin write feedback" ON public.feedback FOR ALL USING (public.is_admin());

-- 12. SITE SETTINGS POLICIES
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin write site settings" ON public.site_settings FOR ALL USING (public.is_admin());
