"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/supabase/store";
import { Product } from "@/lib/supabase/mock-data";
import { formatLKR } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductCard } from "@/components/product/ProductCard";
import { CheckoutModal } from "@/components/cart/CheckoutModal";
import { AuthModal } from "@/components/layout/AuthModal";
import {
  ShoppingBag,
  MessageCircle,
  Sparkles,
  Tag,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string) || "";
  const openCheckoutQuery = searchParams.get("openCheckout") === "true";

  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      const p = store.getProductBySlug(slug);
      setProduct(p);
      if (p && p.product_variants && p.product_variants.length > 0) {
        setSelectedVariantId(p.product_variants[0].id);
      }
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (openCheckoutQuery && product) {
      const user = store.getCurrentUser();
      if (!user) {
        setAuthModalOpen(true);
      } else {
        setCheckoutModalOpen(true);
      }
    }
  }, [openCheckoutQuery, product]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">
        <p className="text-sm font-medium animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-sm text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <Button asChild variant="outline">
          <Link href="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Return to Shop</Link>
        </Button>
      </div>
    );
  }

  const activeVariants = product.product_variants?.filter((v) => v.is_active) || [];
  const selectedVariant = activeVariants.find((v) => v.id === selectedVariantId) || activeVariants[0];

  const isOnSale = product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.base_price;
  const baseUnitPrice = isOnSale ? product.sale_price! : product.base_price;
  const variantAdjustment = selectedVariant?.price_adjustment || 0;
  const finalUnitPrice = baseUnitPrice + variantAdjustment;

  const images = product.product_images || [
    { id: "1", product_id: product.id, image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80", alt_text: product.name, display_order: 1, is_primary: true, created_at: new Date().toISOString() }
  ];

  const category = store.getCategories().find((c) => c.id === product.category_id);
  const relatedProducts = store.getProducts().filter((p) => p.category_id === product.category_id && p.id !== product.id && p.is_active).slice(0, 4);
  const approvedReviews = store.getReviewsForProduct(product.id);

  const availableSizes = Array.from(new Set(activeVariants.map((v) => v.size)));
  const availableColours = Array.from(new Set(activeVariants.map((v) => v.colour)));

  const handleAddToCart = () => {
    const user = store.getCurrentUser();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!selectedVariant) {
      showToast("Please select an available variant", "error");
      return;
    }
    store.addToCart(user.id, product.id, selectedVariant.id, quantity);
    showToast(`Added ${quantity} x "${product.name}" (${selectedVariant.size} / ${selectedVariant.colour}) to cart!`, "success");
  };

  const handleWhatsAppBuyNow = () => {
    const user = store.getCurrentUser();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!selectedVariant) {
      showToast("Please select an available variant", "error");
      return;
    }
    // Add current selection to cart and open checkout modal directly
    store.addToCart(user.id, product.id, selectedVariant.id, quantity);
    setCheckoutModalOpen(true);
  };

  const isOutOfStock = product.stock_status === "out_of_stock" || (selectedVariant && selectedVariant.stock_quantity <= 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand">Shop</Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-brand">{category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900 font-semibold truncate max-w-xs dark:text-white">{product.name}</span>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Gallery */}
        <ImageGallery images={images} productName={product.name} />

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          
          <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Product Code: {product.product_code}
              </span>
              <Badge
                variant={
                  isOutOfStock
                    ? "destructive"
                    : product.stock_status === "low_stock"
                    ? "warning"
                    : "success"
                }
              >
                {isOutOfStock ? "Out of Stock" : `In Stock (${selectedVariant?.stock_quantity || 10} available)`}
              </Badge>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.short_description}
            </p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {formatLKR(finalUnitPrice)}
            </span>
            {isOnSale && (
              <span className="text-base text-slate-400 line-through">
                {formatLKR(product.base_price + variantAdjustment)}
              </span>
            )}
            {isOnSale && (
              <Badge variant="destructive" className="ml-2">
                Sale Price
              </Badge>
            )}
          </div>

          {/* Variant Selectors */}
          <div className="space-y-4 pt-2">
            
            {/* Sizes */}
            {availableSizes.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 block">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {activeVariants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                        selectedVariantId === v.id
                          ? "border-brand bg-brand text-white shadow-md"
                          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {v.size} ({v.colour})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-300"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-300"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  Subtotal: <strong className="text-slate-900 dark:text-white">{formatLKR(finalUnitPrice * quantity)}</strong>
                </span>
              </div>
            </div>

          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              size="lg"
              variant="outline"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full text-sm font-bold h-12"
            >
              <ShoppingBag className="mr-2 h-5 w-5 text-brand" /> Add to Cart
            </Button>
            
            <Button
              size="lg"
              onClick={handleWhatsAppBuyNow}
              disabled={isOutOfStock}
              className="w-full text-sm font-bold h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <MessageCircle className="mr-2 h-5 w-5" /> Order on WhatsApp
            </Button>
          </div>

          {/* Guarantee Highlights */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-emerald-500 shrink-0" /> Fast Islandwide Delivery
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="h-4 w-4 text-amber-500 shrink-0" /> 7-Day Easy Exchange
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" /> Authentic Fabric
            </div>
          </div>

          {/* Full Description, Material & Care */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Product Description</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {product.full_description}
              </p>
            </div>

            {product.material && (
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Material & Fabric Specs</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{product.material}</p>
              </div>
            )}

            {product.care_instructions && (
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Care Instructions</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{product.care_instructions}</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <ProductReviews productId={product.id} initialReviews={approvedReviews} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">You Might Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <CheckoutModal
        open={checkoutModalOpen}
        onOpenChange={setCheckoutModalOpen}
        cartItems={
          selectedVariant
            ? [
                {
                  id: "direct-checkout",
                  user_id: store.getCurrentUser()?.id || "guest",
                  product_id: product.id,
                  variant_id: selectedVariant.id,
                  quantity: quantity,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  product,
                  variant: selectedVariant,
                },
              ]
            : []
        }
        subtotal={finalUnitPrice * quantity}
      />

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onSuccess={() => {
          showToast("Authenticated! Opening WhatsApp order checkout...", "success");
          setCheckoutModalOpen(true);
        }}
      />
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading product details...</div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}
