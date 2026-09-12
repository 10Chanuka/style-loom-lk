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
  colour?: string;
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
    image_url: "https://6aa04bc544e10f718926e38b.imgix.net/sandbox/WhatsApp%20Image%202026-09-08%20at%2011.08.00%20PM.jpeg?w=800&auto=format&fit=crop&q=80",
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "22222222-0000-0000-0000-000000000002",
    name: "Long Kurtas",
    slug: "long-kurtas",
    description: "Graceful floor-length and calf-length traditional Kurtas featuring handcrafted embroidery and silk linen blends.",
    image_url: "https://6aa04bc544e10f718926e38b.imgix.net/sandbox/WhatsApp%20Image%202026-09-12%20at%2012.40.23%20PM.jpeg?w=800&auto=format&fit=crop&q=80",
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "33333333-0000-0000-0000-000000000003",
    name: "Short Kurtas",
    slug: "short-kurtas",
    description: "Contemporary waist-length and hip-length Short Kurtas designed for everyday comfort and modern style.",
    image_url: "https://6aa04bc544e10f718926e38b.imgix.net/sandbox/WhatsApp%20Image%202026-09-12%20at%2012.40.21%20PM.jpeg?w=800&auto=format&fit=crop&q=80",
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  id: "f1000000-0000-0000-0000-000000000001",
  business_name: "Style Loom",
  logo_url: "/logo.jpg",
  business_email: "Styleloom2050@gmail.com",
  business_phone: "+94 74 188 0953",
  whatsapp_number: "94741880953",
  address: "No 432/1B, Sri Vijaya Road, Palanwaththa, Pannipitiya.",
  about_content: "At Style Loom, we believe clothing is more than something you wear — it is a way to express who you are. We are a Sri Lankan fashion brand bringing together modern style, comfort, and individuality through thoughtfully designed T-shirts and Kurtas. Our collection is created for people who appreciate effortless fashion while still wanting their clothing to feel unique and personal. From everyday favourites to statement pieces, we focus on offering designs that are comfortable, stylish, and made to fit into your lifestyle. At Style Loom, we are committed to continuously bringing you fresh designs and quality products while making your shopping experience simple and enjoyable. Style Loom, your style, your way.",
  delivery_information: "We offer fast island-wide delivery across Sri Lanka within 3 to 5 business days. A flat shipping rate of LKR 350 applies to all standard orders. Express Colombo delivery is available upon request.",
  return_policy: "We offer a 7-day hassle-free size exchange policy. If your item does not fit perfectly, contact our team via WhatsApp to arrange a replacement. Items must be unworn with original tags attached.",
  social_links: {
    facebook: "https://www.facebook.com/share/1EbZ7FjzoQ/",
    instagram: "https://www.instagram.com/style__loom__",
    tiktok: "https://www.tiktok.com/@styleloom2050",
  },
  primary_colour: "#D4AF37",
  updated_at: new Date().toISOString(),
};
