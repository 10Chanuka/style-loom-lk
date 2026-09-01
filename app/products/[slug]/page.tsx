"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/supabase/store";
import { Product, ProductImage } from "@/lib/supabase/mock-data";
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
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const getColorSwatchBg = (colour: string) => {
  const c = colour.toLowerCase();
  if (c.includes("black")) return "bg-slate-950";
  if (c.includes("white")) return "bg-white border-slate-400";
  if (c.includes("navy") || c.includes("blue")) return "bg-blue-900";
  if (c.includes("emerald") || c.includes("green")) return "bg-emerald-600";
  if (c.includes("gold") || c.includes("yellow") || c.includes("mustard")) return "bg-amber-400";
  if (c.includes("red") || c.includes("crimson")) return "bg-rose-700";
  if (c.includes("pink") || c.includes("rose")) return "bg-pink-300";
  return "bg-slate-400";
};

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

  // Colour & Variant selections
  const [selectedColour, setSelectedColour] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      store.syncWithSupabase().then(() => {
        const p = store.getProductBySlug(slug);
        setProduct(p);
        if (p && p.product_variants && p.product_variants.length > 0) {
          const firstVar = p.product_variants.find((v) => v.is_active) || p.product_variants[0];
          setSelectedVariantId(firstVar.id);
          setSelectedColour(firstVar.colour);
          setSelectedSize(firstVar.size);
        }
        setLoading(false);
      });
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

  const availableColours = Array.from(new Set(activeVariants.map((v) => v.colour)));
  const availableSizes = Array.from(new Set(activeVariants.map((v) => v.size)));

  const handleSelectColour = (colour: string) => {
    setSelectedColour(colour);
    // Select matching variant for this colour (prefer current size)
    const match = activeVariants.find((v) => v.colour === colour && v.size === selectedSize) ||
      activeVariants.find((v) => v.colour === colour);
    if (match) {
      setSelectedVariantId(match.id);
      setSelectedSize(match.size);
    }
  };

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    const match = activeVariants.find((v) => v.size === size && v.colour === selectedColour) ||
      activeVariants.find((v) => v.size === size);
    if (match) {
      setSelectedVariantId(match.id);
      setSelectedColour(match.colour);
    }
  };

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
        
        {/* Left: Gallery with Dynamic Colour Image Switching */}
        <ImageGallery
          images={images}
          productName={product.name}
          activeColour={selectedColour || selectedVariant?.colour}
          onImageSelect={(img) => {
            if (img.colour) {
              handleSelectColour(img.colour);
            }
          }}
        />

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
                    : (selectedVariant?.stock_quantity ?? 10) <= 5
                    ? "warning"
                    : "success"
                }
              >
                {isOutOfStock
                  ? `Out of Stock (${selectedVariant?.colour || ''} ${selectedVariant?.size || ''})`
                  : `In Stock (${selectedVariant?.stock_quantity ?? 0} available in ${selectedVariant?.colour} / ${selectedVariant?.size})`}
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

          {/* DYNAMIC COLOUR & SIZE SELECTORS */}
          <div className="space-y-5 pt-2">
            
            {/* COLOUR SWATCH SELECTOR */}
            {availableColours.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="h-4 w-4 text-brand" /> Select Colour:{" "}
                    <span className="text-brand font-extrabold normal-case ml-1">{selectedColour || selectedVariant?.colour}</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">Click colour to view item photo</span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {availableColours.map((col) => {
                    const isSelected = (selectedColour || selectedVariant?.colour) === col;
                    const imgMatch = images.find(
                      (i) =>
                        (i.colour && i.colour.toLowerCase() === col.toLowerCase()) ||
                        (i.alt_text && i.alt_text.toLowerCase().includes(col.toLowerCase()))
                    );

                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => handleSelectColour(col)}
                        className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-brand bg-rose-50 text-slate-900 shadow-md ring-2 ring-brand/20 dark:bg-slate-800 dark:text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {imgMatch ? (
                          <img src={imgMatch.image_url} alt={col} className="h-5 w-5 rounded-full object-cover border border-slate-300 shadow-sm" />
                        ) : (
                          <span className={`h-3.5 w-3.5 rounded-full border border-slate-300 ${getColorSwatchBg(col)}`} />
                        )}
                        <span>{col}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SIZE SELECTOR */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    const matchingVariant = activeVariants.find(
                      (varItem) => varItem.colour === (selectedColour || selectedVariant?.colour) && varItem.size === size
                    );

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSelectSize(size)}
                        disabled={!matchingVariant}
                        className={`px-4 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-brand bg-brand text-white shadow-md"
                            : matchingVariant
                            ? "border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                            : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed dark:bg-slate-900 dark:border-slate-800"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden dark:border-slate-700 bg-white dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
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

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full font-bold text-sm"
              >
                <ShoppingBag className="mr-2 h-4 w-4 text-brand" /> Add to Cart
              </Button>
              <Button
                size="lg"
                onClick={handleWhatsAppBuyNow}
                disabled={isOutOfStock}
                className="w-full font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30"
              >
                <MessageCircle className="mr-2 h-5 w-5" /> Buy Now via WhatsApp
              </Button>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
              <Truck className="h-4 w-4 text-brand mx-auto" />
              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block">Island Delivery</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
              <RotateCcw className="h-4 w-4 text-emerald-600 mx-auto" />
              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block">7-Day Return</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
              <ShieldCheck className="h-4 w-4 text-blue-600 mx-auto" />
              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block">100% Quality</span>
            </div>
          </div>

          {/* Material & Care */}
          <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            {product.material && (
              <div>
                <strong className="text-slate-900 dark:text-white">Fabric / Material:</strong> {product.material}
              </div>
            )}
            {product.care_instructions && (
              <div>
                <strong className="text-slate-900 dark:text-white">Care Instructions:</strong> {product.care_instructions}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Product Reviews */}
      <ProductReviews
        productId={product.id}
        initialReviews={approvedReviews}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              You May Also Like
            </h3>
            <Link href="/products" className="text-xs font-bold text-brand hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <CheckoutModal
          open={checkoutModalOpen}
          onOpenChange={setCheckoutModalOpen}
          cartItems={store.getCurrentUser() ? store.getCart(store.getCurrentUser()!.id) : []}
          subtotal={
            store.getCurrentUser()
              ? store.getCart(store.getCurrentUser()!.id).reduce((sum, item) => {
                  const price = item.product?.sale_price ?? item.product?.base_price ?? 0;
                  const adj = item.variant?.price_adjustment ?? 0;
                  return sum + (price + adj) * item.quantity;
                }, 0)
              : 0
          }
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
      />
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">Loading product page...</div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}
