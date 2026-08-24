"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/supabase/mock-data";
import { formatLKR } from "@/lib/utils";
import { store } from "@/lib/supabase/store";
import { useToast } from "@/components/ui/toast";
import { AuthModal } from "@/components/layout/AuthModal";
import { ShoppingBag, Eye, MessageCircle, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const { showToast } = useToast();
  const [authOpen, setAuthOpen] = useState(false);
  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.image_url ||
    product.product_images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";

  const activeVariants = product.product_variants?.filter((v) => v.is_active) || [];
  const defaultVariant = activeVariants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = store.getCurrentUser();
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (!defaultVariant) {
      showToast("No active variants available for this product", "error");
      return;
    }
    store.addToCart(user.id, product.id, defaultVariant.id, 1);
    showToast(`Added "${product.name}" (${defaultVariant.size} / ${defaultVariant.colour}) to cart!`, "success");
  };

  const handleWhatsAppDirect = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = store.getCurrentUser();
    if (!user) {
      setAuthOpen(true);
      return;
    }
    window.location.href = `/products/${product.slug}?openCheckout=true`;
  };

  const isOnSale = product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.base_price;
  const currentPrice = isOnSale ? product.sale_price! : product.base_price;

  return (
    <>
      <div className="group relative rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 flex flex-col overflow-hidden">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {isOnSale && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Tag className="h-3 w-3" /> Sale
            </Badge>
          )}
          {product.featured && (
            <Badge variant="default" className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600">
              <Sparkles className="h-3 w-3" /> Featured
            </Badge>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge
            variant={
              product.stock_status === "in_stock"
                ? "success"
                : product.stock_status === "low_stock"
                ? "warning"
                : "destructive"
            }
          >
            {product.stock_status === "in_stock"
              ? "In Stock"
              : product.stock_status === "low_stock"
              ? "Low Stock"
              : "Out of Stock"}
          </Badge>
        </div>

        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="bg-white text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> View Details
            </span>
          </div>
        </Link>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-brand">
              {product.product_code}
            </span>
            <span>{product.material ? product.material.split(" ")[0] : "Premium"}</span>
          </div>

          <Link href={`/products/${product.slug}`} className="font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-brand transition-colors text-base">
            {product.name}
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 mb-3 flex-1">
            {product.short_description}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              {formatLKR(currentPrice)}
            </span>
            {isOnSale && (
              <span className="text-xs text-slate-400 line-through">
                {formatLKR(product.base_price)}
              </span>
            )}
          </div>

          {/* Colours Available */}
          {activeVariants.length > 0 && (
            <div className="flex items-center gap-1 mb-4">
              <span className="text-[11px] text-slate-400 mr-1">Colours:</span>
              {Array.from(new Set(activeVariants.map((v) => v.colour))).slice(0, 3).map((col, idx) => (
                <span
                  key={idx}
                  className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium dark:bg-slate-800 dark:text-slate-300"
                >
                  {col}
                </span>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToCart}
              className="w-full text-xs font-semibold"
              disabled={product.stock_status === "out_of_stock"}
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1 text-brand" /> Add Cart
            </Button>
            <Button
              size="sm"
              onClick={handleWhatsAppDirect}
              className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={product.stock_status === "out_of_stock"}
            >
              <MessageCircle className="h-3.5 w-3.5 mr-1" /> Order WA
            </Button>
          </div>
        </div>
      </div>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => {
          showToast("Authenticated! Now you can proceed with your action.", "success");
        }}
      />
    </>
  );
}
