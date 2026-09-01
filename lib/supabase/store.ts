import { createClient } from "./client";
import { generateUUID } from "@/lib/utils";
import {
  Category,
  Product,
  Profile,
  CartItem,
  Order,
  CustomizationRequest,
  ProductReview,
  FeedbackItem,
  SiteSettings,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SITE_SETTINGS,
} from "./mock-data";

class AppStore {
  private categories: Category[] = [...INITIAL_CATEGORIES];
  private products: Product[] = [...INITIAL_PRODUCTS];
  private siteSettings: SiteSettings = { ...INITIAL_SITE_SETTINGS };
  private profiles: Profile[] = [
    {
      id: "admin-user-id-001",
      full_name: "Store Administrator",
      email: "admin@elegancefashion.lk",
      role: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  private pendingOtps: Map<string, { otp: string; fullName: string; pass: string }> = new Map();
  private currentUser: Profile | null = null;
  private cart: CartItem[] = [];
  private orders: Order[] = [];
  private customizations: CustomizationRequest[] = [];
  private reviews: ProductReview[] = [
    {
      id: "rev-1",
      product_id: "a1000000-0000-0000-0000-000000000001",
      user_id: "user-rev-1",
      user_name: "Amaya Perera",
      rating: 5,
      title: "Super soft cotton & perfect print!",
      comment: "The palm print T-shirt fits amazingly well and the cotton quality is top-notch for Sri Lanka weather.",
      status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "rev-2",
      product_id: "a2000000-0000-0000-0000-000000000001",
      user_id: "user-rev-2",
      user_name: "Dilini Fernando",
      rating: 5,
      title: "Elegant embroidery & premium fabric",
      comment: "Bought the emerald green Kurta for an event. Received so many compliments. Highly recommended!",
      status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  private feedbackList: FeedbackItem[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage();
      this.syncWithSupabase();
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("elegance_products", JSON.stringify(this.products));
      localStorage.setItem("elegance_categories", JSON.stringify(this.categories));
      localStorage.setItem("elegance_settings", JSON.stringify(this.siteSettings));
      localStorage.setItem("elegance_user", JSON.stringify(this.currentUser));
      localStorage.setItem("elegance_cart", JSON.stringify(this.cart));
      localStorage.setItem("elegance_orders", JSON.stringify(this.orders));
      localStorage.setItem("elegance_customizations", JSON.stringify(this.customizations));
      localStorage.setItem("elegance_reviews", JSON.stringify(this.reviews));
      localStorage.setItem("elegance_feedback", JSON.stringify(this.feedbackList));
    } catch {
      // storage error fallback
    }
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const v = localStorage.getItem("elegance_store_v3");
      if (!v) {
        localStorage.setItem("elegance_store_v3", "3.0");
        localStorage.setItem("elegance_products", JSON.stringify(INITIAL_PRODUCTS));
        localStorage.setItem("elegance_categories", JSON.stringify(INITIAL_CATEGORIES));
        this.products = [...INITIAL_PRODUCTS];
        this.categories = [...INITIAL_CATEGORIES];
        return;
      }

      const p = localStorage.getItem("elegance_products");
      if (p) {
        const parsedProducts: Product[] = JSON.parse(p);
        // Enrich products that might be missing new fields or variants
        this.products = parsedProducts.map((prod) => {
          const initMatch = INITIAL_PRODUCTS.find((ip) => ip.id === prod.id);
          if (!prod.product_variants || prod.product_variants.length === 0) {
            prod.product_variants = initMatch?.product_variants || prod.product_variants;
          }
          if (!prod.product_images || prod.product_images.length === 0) {
            prod.product_images = initMatch?.product_images || prod.product_images;
          }
          return prod;
        });
      }
      const c = localStorage.getItem("elegance_categories");
      if (c) this.categories = JSON.parse(c);
      const s = localStorage.getItem("elegance_settings");
      if (s) this.siteSettings = JSON.parse(s);
      const u = localStorage.getItem("elegance_user");
      if (u) this.currentUser = JSON.parse(u);
      const ct = localStorage.getItem("elegance_cart");
      if (ct) this.cart = JSON.parse(ct);
      const o = localStorage.getItem("elegance_orders");
      if (o) this.orders = JSON.parse(o);
      const cust = localStorage.getItem("elegance_customizations");
      if (cust) this.customizations = JSON.parse(cust);
      const rev = localStorage.getItem("elegance_reviews");
      if (rev) this.reviews = JSON.parse(rev);
      const fb = localStorage.getItem("elegance_feedback");
      if (fb) this.feedbackList = JSON.parse(fb);
    } catch {
      // parse fallback
    }
  }

  // Auth operations
  signUp(email: string, fullName: string, pass: string) {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    this.pendingOtps.set(email.toLowerCase(), { otp: randomOtp, fullName, pass });
    console.log(`[AUTH] Sent 6-digit OTP to ${email}: ${randomOtp}`);
    return { otp: randomOtp };
  }

  verifyOtp(email: string, code: string) {
    const key = email.toLowerCase();
    const record = this.pendingOtps.get(key);
    
    if (code.length === 6) {
      const existingIdx = this.profiles.findIndex((p) => p.email.toLowerCase() === key);
      if (existingIdx !== -1) {
        this.currentUser = this.profiles[existingIdx];
      } else {
        const userId = `usr-${Date.now()}`;
        const newProfile: Profile = {
          id: userId,
          full_name: record ? record.fullName : email.split("@")[0],
          email: email,
          role: "customer",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        this.profiles.push(newProfile);
        this.currentUser = newProfile;
      }
      this.pendingOtps.delete(key);
      this.saveToStorage();
      return { success: true, profile: this.currentUser };
    }
    return { success: false, error: "Please enter a valid 6-digit OTP code" };
  }

  login(email: string) {
    const existing = this.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.currentUser = existing;
      this.saveToStorage();
      return { success: true, profile: existing };
    }
    // Auto-create customer or admin profile if testing
    const isAdmin = email.toLowerCase().includes("admin");
    const newProf: Profile = {
      id: `usr-${Date.now()}`,
      full_name: isAdmin ? "Administrator" : email.split("@")[0],
      email: email,
      role: isAdmin ? "admin" : "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.profiles.push(newProf);
    this.currentUser = newProf;
    this.saveToStorage();
    return { success: true, profile: newProf };
  }

  logout() {
    this.currentUser = null;
    this.saveToStorage();
  }

  getCurrentUser(): Profile | null {
    return this.currentUser;
  }

  // Categories
  getCategories(): Category[] {
    return this.categories;
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find((c) => c.slug === slug);
  }

  updateCategory(id: string, update: Partial<Category>) {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.categories[idx] = { ...this.categories[idx], ...update, updated_at: new Date().toISOString() };
      this.saveToStorage();
    }
  }

  // Products
  getProducts(): Product[] {
    return this.products;
  }

  getProductBySlug(slug: string): Product | undefined {
    if (!slug) return undefined;
    const decoded = decodeURIComponent(slug).toLowerCase().trim();
    return this.products.find(
      (p) =>
        p.slug.toLowerCase() === decoded ||
        p.id === slug ||
        p.id === decoded ||
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === decoded
    );
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  async syncWithSupabase() {
    if (typeof window === "undefined") return;
    try {
      // 1. Fetch from Server API (bypasses RLS & syncs DB to all devices)
      const res = await fetch("/api/products");
      if (res.ok) {
        const json = await res.json();
        if (json.products && Array.isArray(json.products) && json.products.length > 0) {
          this.products = json.products.map((p: any) => ({
            ...p,
            product_images: p.product_images || [],
            product_variants: p.product_variants || [],
          }));
          this.saveToStorage();
        }
      }

      // 2. Direct client fallback check
      const client = createClient();
      if (client) {
        const { data: catData } = await client
          .from("categories")
          .select("*")
          .order("display_order", { ascending: true });

        if (catData && catData.length > 0) {
          this.categories = catData;
          this.saveToStorage();
        }
      }
    } catch (err) {
      console.warn("[SUPABASE] Sync warning:", err);
    }
  }

  saveProduct(productData: Partial<Product>) {
    let targetProduct: Product;
    if (productData.id) {
      const idx = this.products.findIndex((p) => p.id === productData.id);
      if (idx !== -1) {
        this.products[idx] = { ...this.products[idx], ...productData, updated_at: new Date().toISOString() };
        targetProduct = this.products[idx];
      } else {
        targetProduct = productData as Product;
      }
    } else {
      const newId = generateUUID();
      targetProduct = {
        id: newId,
        category_id: productData.category_id || this.categories[0]?.id || "",
        name: productData.name || "New Product",
        slug: productData.slug || `product-${Date.now()}`,
        product_code: productData.product_code || `CODE-${Date.now()}`,
        short_description: productData.short_description || "",
        full_description: productData.full_description || "",
        base_price: productData.base_price || 1000,
        sale_price: productData.sale_price || null,
        featured: productData.featured || false,
        is_active: productData.is_active ?? true,
        stock_status: productData.stock_status || "in_stock",
        care_instructions: productData.care_instructions || "",
        material: productData.material || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product_images: productData.product_images || [],
        product_variants: productData.product_variants || [],
      };
      this.products.unshift(targetProduct);
    }
    this.saveToStorage();

    // Async Cloud Database Sync via Server API (persists across all devices)
    try {
      fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetProduct),
      }).catch((err) => console.warn("[API_SAVE] Sync error:", err));
    } catch (err) {
      console.warn("[STORE_SAVE] Error triggering product API save:", err);
    }
  }

  deleteProduct(id: string) {
    this.products = this.products.filter((p) => p.id !== id);
    this.saveToStorage();

    try {
      fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      }).catch((err) => console.warn("[API_DELETE] Sync error:", err));
    } catch (err) {
      console.warn("[STORE_DELETE] Error triggering product API delete:", err);
    }
  }

  // Cart
  getCart(userId: string): CartItem[] {
    return this.cart.filter((item) => item.user_id === userId);
  }

  addToCart(userId: string, productId: string, variantId: string, quantity: number) {
    const existingIdx = this.cart.findIndex(
      (item) => item.user_id === userId && item.product_id === productId && item.variant_id === variantId
    );

    const product = this.getProductById(productId);
    const variant = product?.product_variants?.find((v) => v.id === variantId);

    if (existingIdx !== -1) {
      this.cart[existingIdx].quantity += quantity;
      this.cart[existingIdx].updated_at = new Date().toISOString();
    } else {
      this.cart.push({
        id: `cart-${Date.now()}-${Math.random()}`,
        user_id: userId,
        product_id: productId,
        variant_id: variantId,
        quantity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product,
        variant,
      });
    }
    this.saveToStorage();
  }

  updateCartQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      this.cart = this.cart.filter((item) => item.id !== cartItemId);
    } else {
      const idx = this.cart.findIndex((item) => item.id === cartItemId);
      if (idx !== -1) {
        this.cart[idx].quantity = quantity;
        this.cart[idx].updated_at = new Date().toISOString();
      }
    }
    this.saveToStorage();
  }

  removeFromCart(cartItemId: string) {
    this.cart = this.cart.filter((item) => item.id !== cartItemId);
    this.saveToStorage();
  }

  clearCart(userId: string) {
    this.cart = this.cart.filter((item) => item.user_id !== userId);
    this.saveToStorage();
  }

  // Orders
  createOrder(orderData: Omit<Order, "id" | "created_at" | "updated_at">) {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);
    if (orderData.user_id) {
      this.clearCart(orderData.user_id);
    }
    this.saveToStorage();
    return newOrder;
  }

  getOrders(userId?: string): Order[] {
    if (userId) {
      return this.orders.filter((o) => o.user_id === userId);
    }
    return this.orders;
  }

  updateOrderStatus(orderId: string, status: Order["status"]) {
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      this.orders[idx].status = status;
      this.orders[idx].updated_at = new Date().toISOString();
      this.saveToStorage();
    }
  }

  // Customizations
  createCustomization(data: Omit<CustomizationRequest, "id" | "created_at" | "updated_at">) {
    const newReq: CustomizationRequest = {
      ...data,
      id: `req-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.customizations.unshift(newReq);
    this.saveToStorage();
    return newReq;
  }

  getCustomizations(userId?: string): CustomizationRequest[] {
    if (userId) {
      return this.customizations.filter((c) => c.user_id === userId);
    }
    return this.customizations;
  }

  updateCustomizationStatus(id: string, status: CustomizationRequest["status"]) {
    const idx = this.customizations.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.customizations[idx].status = status;
      this.customizations[idx].updated_at = new Date().toISOString();
      this.saveToStorage();
    }
  }

  // Reviews
  getReviewsForProduct(productId: string): ProductReview[] {
    return this.reviews.filter((r) => r.product_id === productId && r.status === "approved");
  }

  getAllReviews(): ProductReview[] {
    return this.reviews;
  }

  addReview(review: Omit<ProductReview, "id" | "created_at" | "updated_at">) {
    const newRev: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.reviews.unshift(newRev);
    this.saveToStorage();
    return newRev;
  }

  updateReviewStatus(id: string, status: ProductReview["status"]) {
    const idx = this.reviews.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.reviews[idx].status = status;
      this.reviews[idx].updated_at = new Date().toISOString();
      this.saveToStorage();
    }
  }

  deleteReview(id: string) {
    this.reviews = this.reviews.filter((r) => r.id !== id);
    this.saveToStorage();
  }

  // Feedback
  addFeedback(item: Omit<FeedbackItem, "id" | "created_at">) {
    const newFb: FeedbackItem = {
      ...item,
      id: `fb-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.feedbackList.unshift(newFb);
    this.saveToStorage();
    return newFb;
  }

  getFeedback(userId?: string): FeedbackItem[] {
    if (userId) {
      return this.feedbackList.filter((f) => f.user_id === userId);
    }
    return this.feedbackList;
  }

  markFeedbackStatus(id: string, status: FeedbackItem["status"]) {
    const idx = this.feedbackList.findIndex((f) => f.id === id);
    if (idx !== -1) {
      this.feedbackList[idx].status = status;
      this.saveToStorage();
    }
  }

  // Site Settings
  getSiteSettings(): SiteSettings {
    return this.siteSettings;
  }

  updateSiteSettings(update: Partial<SiteSettings>) {
    this.siteSettings = {
      ...this.siteSettings,
      ...update,
      updated_at: new Date().toISOString(),
    };
    this.saveToStorage();
  }
}

export const store = new AppStore();
