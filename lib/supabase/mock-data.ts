export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  product_code: string;
  short_description: string;
  full_description: string;
  base_price: number;
  sale_price: number | null;
  featured: boolean;
  is_active: boolean;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
  care_instructions: string;
  material: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  colour: string;
  stock_quantity: number;
  price_adjustment: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  subtotal: number;
  status: "whatsapp_pending" | "received" | "confirmed" | "preparing" | "completed" | "cancelled";
  whatsapp_opened_at?: string;
  customer_notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name_snapshot: string;
  product_code_snapshot: string;
  variant_snapshot: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
}

export interface CustomizationRequest {
  id: string;
  request_number: string;
  user_id?: string;
  product_type: "Printed T-Shirt" | "Kurta" | "Blouse";
  quantity: number;
  preferred_colour?: string;
  preferred_fabric?: string;
  selected_size?: string;
  measurements?: Record<string, string>;
  print_or_design_type?: string;
  design_placement?: string;
  design_description: string;
  reference_image_url?: string;
  required_date?: string;
  estimated_budget?: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: string;
  status: "whatsapp_pending" | "received" | "discussing" | "quoted" | "confirmed" | "completed" | "cancelled";
  whatsapp_opened_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title?: string;
  comment: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export interface FeedbackItem {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: string;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  logo_url: string | null;
  business_email: string;
  business_phone: string;
  whatsapp_number: string;
  address: string;
  about_content: string;
  delivery_information: string;
  return_policy: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  primary_colour: string;
  updated_at: string;
}

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "11111111-0000-0000-0000-000000000001",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Premium printed cotton unisex T-shirts with modern artistic graphics and soft breathability.",
    image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "22222222-0000-0000-0000-000000000002",
    name: "Kurtas",
    slug: "kurtas",
    description: "Elegant women Kurtas featuring intricate handcrafted embroidery, linen blends, and modern silhouettes.",
    image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "33333333-0000-0000-0000-000000000003",
    name: "Blouses",
    slug: "blouses",
    description: "Tailored women Blouses designed for formal elegance, casual chic, and saree pairing perfection.",
    image_url: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&auto=format&fit=crop&q=80",
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "a1000000-0000-0000-0000-000000000001",
    category_id: "11111111-0000-0000-0000-000000000001",
    name: "Minimalist Tropical Palm Graphic Tee",
    slug: "minimalist-tropical-palm-graphic-tee",
    product_code: "TS-PALM-01",
    short_description: "Soft 100% combed cotton unisex printed T-shirt with signature island palm print.",
    full_description: "Elevate your daily streetwear with our signature Tropical Palm Graphic Tee. Crafted from 180 GSM ring-spun combed cotton for maximum breathability and durability. Designed with screen-printed chest detail that stays vivid wash after wash.",
    base_price: 2850.00,
    sale_price: 2450.00,
    featured: true,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Machine wash cold inside-out with like colours. Tumble dry low or line dry in shade. Do not iron directly on print.",
    material: "100% Ring-Spun Combed Cotton (180 GSM)",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-1", product_id: "a1000000-0000-0000-0000-000000000001", image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80", alt_text: "Minimalist Tropical Palm Graphic Tee Front View", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
      { id: "img-2", product_id: "a1000000-0000-0000-0000-000000000001", image_url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80", alt_text: "Minimalist Tropical Palm Graphic Tee Model Angle", display_order: 2, is_primary: false, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v1-1", product_id: "a1000000-0000-0000-0000-000000000001", sku: "TS-PALM-BLK-S", size: "S", colour: "Black", stock_quantity: 15, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v1-2", product_id: "a1000000-0000-0000-0000-000000000001", sku: "TS-PALM-BLK-M", size: "M", colour: "Black", stock_quantity: 25, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v1-3", product_id: "a1000000-0000-0000-0000-000000000001", sku: "TS-PALM-BLK-L", size: "L", colour: "Black", stock_quantity: 20, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v1-4", product_id: "a1000000-0000-0000-0000-000000000001", sku: "TS-PALM-WHT-M", size: "M", colour: "White", stock_quantity: 12, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  },
  {
    id: "a1000000-0000-0000-0000-000000000002",
    category_id: "11111111-0000-0000-0000-000000000001",
    name: "Colombo Heritage Typographic T-Shirt",
    slug: "colombo-heritage-typographic-t-shirt",
    product_code: "TS-COL-02",
    short_description: "Urban streetwear graphic tee highlighting Colombo coastal coordinates.",
    full_description: "A tribute to urban island culture. Features bold typography and geometric linework printed with eco-friendly water-based ink. Pre-shrunk fit suitable for both men and women.",
    base_price: 3100.00,
    sale_price: null,
    featured: true,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Hand wash or gentle cold machine wash. Do not bleach. Cool iron on reverse side.",
    material: "95% Organic Cotton, 5% Elastane",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-3", product_id: "a1000000-0000-0000-0000-000000000002", image_url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80", alt_text: "Colombo Heritage Typographic T-Shirt Black", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v2-1", product_id: "a1000000-0000-0000-0000-000000000002", sku: "TS-COL-NAV-M", size: "M", colour: "Navy Blue", stock_quantity: 18, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v2-2", product_id: "a1000000-0000-0000-0000-000000000002", sku: "TS-COL-NAV-L", size: "L", colour: "Navy Blue", stock_quantity: 10, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v2-3", product_id: "a1000000-0000-0000-0000-000000000002", sku: "TS-COL-BLK-L", size: "L", colour: "Black", stock_quantity: 5, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  },
  {
    id: "a1000000-0000-0000-0000-000000000003",
    category_id: "11111111-0000-0000-0000-000000000001",
    name: "Abstract Line Art Unisex Tee",
    slug: "abstract-line-art-unisex-tee",
    product_code: "TS-ART-03",
    short_description: "Modern aesthetic line art print on heavyweight premium cotton.",
    full_description: "Clean, sophisticated, and comfortable. Our Abstract Line Art Tee blends contemporary visual design with casual everyday relaxed fit.",
    base_price: 2950.00,
    sale_price: 2600.00,
    featured: false,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Machine wash warm. Tumble dry medium. Warm iron if needed.",
    material: "100% Heavyweight Cotton (210 GSM)",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-4", product_id: "a1000000-0000-0000-0000-000000000003", image_url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=80", alt_text: "Abstract Line Art Unisex Tee White", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v3-1", product_id: "a1000000-0000-0000-0000-000000000003", sku: "TS-ART-WHT-S", size: "S", colour: "White", stock_quantity: 8, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v3-2", product_id: "a1000000-0000-0000-0000-000000000003", sku: "TS-ART-WHT-M", size: "M", colour: "White", stock_quantity: 15, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  },
  {
    id: "a1000000-0000-0000-0000-000000000004",
    category_id: "11111111-0000-0000-0000-000000000001",
    name: "Vintage Sunset Crest Printed T-Shirt",
    slug: "vintage-sunset-crest-printed-t-shirt",
    product_code: "TS-SUN-04",
    short_description: "Retro sunset crest print with relaxed drop-shoulder cut.",
    full_description: "Embrace retro island vibes with our Vintage Sunset Crest tee. Pre-washed for superior softness and a subtle vintage patina from day one.",
    base_price: 3200.00,
    sale_price: 2900.00,
    featured: false,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Cold wash inside out. Line dry in shade.",
    material: "100% Bio-Washed Cotton",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-5", product_id: "a1000000-0000-0000-0000-000000000004", image_url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80", alt_text: "Vintage Sunset Crest Printed T-Shirt Mustard", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v4-1", product_id: "a1000000-0000-0000-0000-000000000004", sku: "TS-SUN-MST-M", size: "M", colour: "Mustard Yellow", stock_quantity: 14, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v4-2", product_id: "a1000000-0000-0000-0000-000000000004", sku: "TS-SUN-MST-L", size: "L", colour: "Mustard Yellow", stock_quantity: 2, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  },
  {
    id: "a2000000-0000-0000-0000-000000000001",
    category_id: "22222222-0000-0000-0000-000000000002",
    name: "Royal Emerald Embroidered Cotton Kurta",
    slug: "royal-emerald-embroidered-cotton-kurta",
    product_code: "KR-EME-01",
    short_description: "Hand-embroidered neckline Kurta in rich emerald green cotton linen blend.",
    full_description: "Designed for elegance and daily comfort. Features delicate zari embroidery along the mandarin neck collar, 3/4 sleeves with side slits, and comfortable straight cut.",
    base_price: 5850.00,
    sale_price: 5200.00,
    featured: true,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Dry clean recommended or gentle hand wash in cold water with mild detergent.",
    material: "Premium Linen Cotton Blend with Metallic Zari Work",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-6", product_id: "a2000000-0000-0000-0000-000000000001", image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80", alt_text: "Royal Emerald Embroidered Cotton Kurta Main", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v5-1", product_id: "a2000000-0000-0000-0000-000000000001", sku: "KR-EME-GRN-S", size: "S", colour: "Emerald Green", stock_quantity: 8, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v5-2", product_id: "a2000000-0000-0000-0000-000000000001", sku: "KR-EME-GRN-M", size: "M", colour: "Emerald Green", stock_quantity: 12, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v5-3", product_id: "a2000000-0000-0000-0000-000000000001", sku: "KR-EME-GRN-XL", size: "XL", colour: "Emerald Green", stock_quantity: 4, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  },
  {
    id: "a2000000-0000-0000-0000-000000000002",
    category_id: "22222222-0000-0000-0000-000000000002",
    name: "Sun Gold Block Printed Straight Kurta",
    slug: "sun-gold-block-printed-straight-kurta",
    product_code: "KR-GLD-02",
    short_description: "Traditional woodblock printed motifs on breathable golden yellow cotton.",
    full_description: "Brighten your festive and casual wardrobe. This straight-cut Kurta offers breathable comfort with traditional floral block print and subtle mirror highlights.",
    base_price: 4900.00,
    sale_price: null,
    featured: true,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Gentle hand wash separately in cold water. Do not soak.",
    material: "100% Handloom Breathable Cotton",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-7", product_id: "a2000000-0000-0000-0000-000000000002", image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80", alt_text: "Sun Gold Block Printed Straight Kurta", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v6-1", product_id: "a2000000-0000-0000-0000-000000000002", sku: "KR-GLD-YEL-M", size: "M", colour: "Sun Gold", stock_quantity: 10, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v6-2", product_id: "a2000000-0000-0000-0000-000000000002", sku: "KR-GLD-YEL-L", size: "L", colour: "Sun Gold", stock_quantity: 6, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  },
  {
    id: "a2000000-0000-0000-0000-000000000003",
    category_id: "22222222-0000-0000-0000-000000000002",
    name: "Blush Pink Floral Anarkali Kurta",
    slug: "blush-pink-floral-anarkali-kurta",
    product_code: "KR-PNK-03",
    short_description: "Flowing flared Anarkali silhouette with botanical floral embroidery.",
    full_description: "Graceful, flattering, and effortless. Features a fitted bodice with quarter sleeves and a flowing flared skirt detail.",
    base_price: 6500.00,
    sale_price: 5900.00,
    featured: false,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Dry clean only.",
    material: "Soft Cotton Silk Blend",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-8", product_id: "a2000000-0000-0000-0000-000000000003", image_url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80", alt_text: "Blush Pink Floral Anarkali Kurta", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v7-1", product_id: "a2000000-0000-0000-0000-000000000003", sku: "KR-PNK-ROS-M", size: "M", colour: "Blush Pink", stock_quantity: 7, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  },
  {
    id: "a2000000-0000-0000-0000-000000000004",
    category_id: "22222222-0000-0000-0000-000000000002",
    name: "Midnight Navy Pintuck Casual Kurta",
    slug: "midnight-navy-pintuck-casual-kurta",
    product_code: "KR-NAV-04",
    short_description: "Classic pintuck textured front with wooden button accents.",
    full_description: "Ideal for office wear and casual outings. Navy blue straight tunic Kurta with subtle pintuck detailing and roll-up sleeve tabs.",
    base_price: 4500.00,
    sale_price: 3990.00,
    featured: false,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Machine wash cold gentle cycle. Warm iron.",
    material: "100% Pure Slub Cotton",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-9", product_id: "a2000000-0000-0000-0000-000000000004", image_url: "https://images.unsplash.com/photo-1583391733975-ac4736f8d3fa?w=800&auto=format&fit=crop&q=80", alt_text: "Midnight Navy Pintuck Casual Kurta", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v8-1", product_id: "a2000000-0000-0000-0000-000000000004", sku: "KR-NAV-BLU-L", size: "L", colour: "Midnight Navy", stock_quantity: 15, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  },
  {
    id: "a3000000-0000-0000-0000-000000000001",
    category_id: "33333333-0000-0000-0000-000000000003",
    name: "Crimson Velvet Sweetheart Saree Blouse",
    slug: "crimson-velvet-sweetheart-saree-blouse",
    product_code: "BL-RED-01",
    short_description: "Tailored sweetheart neck blouse in rich deep crimson stretch velvet.",
    full_description: "A show-stopping blouse designed for weddings and special evening celebrations. Features a sculpted sweetheart neck, elbow sleeves, and padded back hook closure.",
    base_price: 4200.00,
    sale_price: 3800.00,
    featured: true,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Dry clean only. Store on padded hanger.",
    material: "Luxury Micro-Velvet with Cotton Lining",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-10", product_id: "a3000000-0000-0000-0000-000000000001", image_url: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&auto=format&fit=crop&q=80", alt_text: "Crimson Velvet Sweetheart Saree Blouse", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v9-1", product_id: "a3000000-0000-0000-0000-000000000001", sku: "BL-RED-CRM-S", size: "34", colour: "Crimson Red", stock_quantity: 6, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v9-2", product_id: "a3000000-0000-0000-0000-000000000001", sku: "BL-RED-CRM-M", size: "36", colour: "Crimson Red", stock_quantity: 10, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v9-3", product_id: "a3000000-0000-0000-0000-000000000001", sku: "BL-RED-CRM-L", size: "38", colour: "Crimson Red", stock_quantity: 5, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  },
  {
    id: "a3000000-0000-0000-0000-000000000002",
    category_id: "33333333-0000-0000-0000-000000000003",
    name: "Ivory Silk High-Neck Formal Work Blouse",
    slug: "ivory-silk-high-neck-formal-work-blouse",
    product_code: "BL-IVR-02",
    short_description: "Sophisticated high neck buttoned blouse suitable for formal suits and sarees.",
    full_description: "Timeless versatility. Tailored from lustrous ivory faux silk with delicate cuff buttons and a smooth concealed front button placket.",
    base_price: 3600.00,
    sale_price: null,
    featured: true,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Hand wash cold or dry clean. Low iron.",
    material: "Faux Raw Silk",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-11", product_id: "a3000000-0000-0000-0000-000000000002", image_url: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&auto=format&fit=crop&q=80", alt_text: "Ivory Silk High-Neck Formal Work Blouse", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v10-1", product_id: "a3000000-0000-0000-0000-000000000002", sku: "BL-IVR-WHT-S", size: "34", colour: "Ivory White", stock_quantity: 9, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v10-2", product_id: "a3000000-0000-0000-0000-000000000002", sku: "BL-IVR-WHT-M", size: "36", colour: "Ivory White", stock_quantity: 14, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  },
  {
    id: "a3000000-0000-0000-0000-000000000003",
    category_id: "33333333-0000-0000-0000-000000000003",
    name: "Black Brocade Elbow-Length Designer Blouse",
    slug: "black-brocade-elbow-length-designer-blouse",
    product_code: "BL-BLK-03",
    short_description: "Golden woven jacquard brocade with deep V-back cut.",
    full_description: "Rich texture meet precise tailoring. Pair effortlessly with silk sarees or high-waisted festive skirts.",
    base_price: 4500.00,
    sale_price: 3950.00,
    featured: false,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Dry clean recommended.",
    material: "Banarasi Jacquard Brocade",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-12", product_id: "a3000000-0000-0000-0000-000000000003", image_url: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&auto=format&fit=crop&q=80", alt_text: "Black Brocade Elbow-Length Designer Blouse", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v11-1", product_id: "a3000000-0000-0000-0000-000000000003", sku: "BL-BLK-GLD-M", size: "36", colour: "Black Gold", stock_quantity: 11, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  },
  {
    id: "a3000000-0000-0000-0000-000000000004",
    category_id: "33333333-0000-0000-0000-000000000003",
    name: "Pastel Pink Puff Sleeve Linen Blouse",
    slug: "pastel-pink-puff-sleeve-linen-blouse",
    product_code: "BL-PNK-04",
    short_description: "Modern romantic puff sleeves with front waist wrap ties.",
    full_description: "Contemporary feminine design. Puff sleeves with elastic cuffs and adjustable waist wrap ties for an exquisite custom silhouette.",
    base_price: 3800.00,
    sale_price: 3350.00,
    featured: false,
    is_active: true,
    stock_status: "in_stock",
    care_instructions: "Machine wash gentle cold. Iron while damp.",
    material: "100% Washed European Linen",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_images: [
      { id: "img-13", product_id: "a3000000-0000-0000-0000-000000000004", image_url: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=800&auto=format&fit=crop&q=80", alt_text: "Pastel Pink Puff Sleeve Linen Blouse", display_order: 1, is_primary: true, created_at: new Date().toISOString() },
    ],
    product_variants: [
      { id: "v12-1", product_id: "a3000000-0000-0000-0000-000000000004", sku: "BL-PNK-ROSE-S", size: "34", colour: "Soft Pink", stock_quantity: 8, price_adjustment: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ]
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  id: "f1000000-0000-0000-0000-000000000001",
  business_name: "Style Loom",
  logo_url: "/logo.jpg",
  business_email: "info@styleloom.lk",
  business_phone: "+94 71 490 3231",
  whatsapp_number: "94714903231",
  address: "No. 123, High Level Road, Nugegoda, Colombo, Sri Lanka",
  about_content: "Style That Speaks, Quality That Lasts. Welcome to Style Loom, your premier destination for high-quality printed T-shirts, handcrafted women Kurtas, and exquisitely tailored saree and modern Blouses in Sri Lanka.",
  delivery_information: "We offer fast island-wide delivery across Sri Lanka within 3 to 5 business days. A flat shipping rate of LKR 350 applies to all standard orders. Express Colombo delivery is available upon request.",
  return_policy: "We offer a 7-day hassle-free size exchange policy. If your item does not fit perfectly, contact our team via WhatsApp to arrange a replacement. Items must be unworn with original tags attached.",
  social_links: {
    facebook: "https://facebook.com/styleloomlk",
    instagram: "https://instagram.com/styleloomlk",
    tiktok: "https://tiktok.com/@styleloomlk",
  },
  primary_colour: "#e11d48",
  updated_at: new Date().toISOString(),
};
