"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { store } from "@/lib/supabase/store";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SITE_SETTINGS, Category, Product, ProductReview, SiteSettings } from "@/lib/supabase/mock-data";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
  ArrowRight,
  Star,
  Quote,
} from "lucide-react";

import { HeroSlider } from "@/components/home/HeroSlider";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);

  useEffect(() => {
    const updateLocalState = () => {
      setCategories(store.getCategories());
      setProducts(store.getProducts());
      setReviews(store.getAllReviews().filter((r) => r.status === "approved"));
      setSettings(store.getSiteSettings());
    };

    // Instant 0ms load from memory
    updateLocalState();

    // Non-blocking background sync
    store.syncWithSupabase().then(() => {
      updateLocalState();
    });
  }, []);

  const explicitFeatured = products.filter((p) => p.featured && p.is_active);
  const featuredProducts = explicitFeatured.length > 0 ? explicitFeatured : products.filter((p) => p.is_active);
  const newArrivals = [...products].filter((p) => p.is_active).sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      
      {/* Interactive 4-Banner Image Slider */}
      <HeroSlider />

      {/* Main Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Our Signature Collections
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Carefully curated unisex printed T-shirts, elegant Long Kurtas, and chic Short Kurtas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300"
            >
              <div className="h-72 overflow-hidden">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 inset-x-0 p-6 text-white space-y-2">
                <div className="inline-block bg-[#B8860B] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Category
                </div>
                <h3 className="text-xl font-bold">{cat.name}</h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] group-hover:text-white transition-colors">
                  View Collection <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] uppercase tracking-wider mb-1">
              <Sparkles className="h-3.5 w-3.5" /> Handpicked Bestsellers
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Products
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/products?featured=true">View All Bestsellers</Link>
          </Button>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-xs">
            No featured products available yet. Add your new products from the Administrator Portal!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              New Arrivals
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Fresh printed graphic tees, elegant Long Kurtas, and contemporary Short Kurtas.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/products?sort=newest">Browse All New Arrivals</Link>
          </Button>
        </div>

        {newArrivals.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-xs">
            New collection drops arriving soon! Add products via Admin Panel.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="p-3 bg-brand/10 text-brand rounded-xl w-fit">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Island-Wide Shipping</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Fast delivery across Sri Lanka within 3–5 business days. Flat rate LKR 350.
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl w-fit">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Instant WhatsApp Orders</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Direct order placement via WhatsApp with unique order tracking numbers.
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl w-fit">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Premium Fabric Quality</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Crafted from 100% bio-washed cotton and pure linen for all-day breathability.
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl w-fit">
              <RotateCcw className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">7-Day Size Exchange</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Easy size exchanges within 7 days for complete peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Verified Reviews Section */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-500" />
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Customer Love & Feedback
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.slice(0, 4).map((rev) => (
              <div key={rev.id} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm relative">
                <Quote className="h-8 w-8 text-slate-200 dark:text-slate-800 absolute top-4 right-4" />
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rev.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="pt-2 text-xs font-semibold text-slate-400">
                  — {rev.user_name || "Verified Customer"}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
