"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { store } from "@/lib/supabase/store";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowLeft, Sparkles, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [category, setCategory] = useState(store.getCategoryBySlug(slug));
  const [activeKurtaTab, setActiveKurtaTab] = useState<"all" | "long" | "short">(
    slug === "long-kurtas" ? "long" : slug === "short-kurtas" ? "short" : "all"
  );
  const [allProducts, setAllProducts] = useState(store.getProducts());

  useEffect(() => {
    const updateLocalState = () => {
      const cat = store.getCategoryBySlug(slug);
      setCategory(cat);
      setAllProducts(store.getProducts());
    };

    updateLocalState();
    if (slug === "long-kurtas") setActiveKurtaTab("long");
    else if (slug === "short-kurtas") setActiveKurtaTab("short");
    else if (slug === "kurtas") setActiveKurtaTab("all");

    // Non-blocking background sync from cloud database
    store.syncWithSupabase().then(() => {
      updateLocalState();
    });
  }, [slug]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Category Not Found</h2>
        <p className="text-sm text-slate-500">The requested category could not be located.</p>
        <Button asChild variant="outline">
          <Link href="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Products</Link>
        </Button>
      </div>
    );
  }

  const isKurtaCategory = slug === "kurtas" || slug === "long-kurtas" || slug === "short-kurtas";

  const longCat = store.getCategoryBySlug("long-kurtas");
  const shortCat = store.getCategoryBySlug("short-kurtas");

  const displayedProducts = allProducts.filter((p) => {
    if (!p.is_active) return false;
    if (isKurtaCategory) {
      if (activeKurtaTab === "long") return p.category_id === longCat?.id;
      if (activeKurtaTab === "short") return p.category_id === shortCat?.id;
      return p.category_id === longCat?.id || p.category_id === shortCat?.id;
    }
    return p.category_id === category.id;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb / Back Link */}
      <div>
        <Link href="/products" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-brand mb-3">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> All Products
        </Link>
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
          <img
            src={category.image_url}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="relative z-10 space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Category Collection</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">{category.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Kurtas Subcategory Switcher if viewing Kurtas */}
      {isKurtaCategory && (
        <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit">
          <span className="text-xs font-bold text-slate-500 px-3 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-brand" /> Browse Kurtas:
          </span>
          <button
            onClick={() => setActiveKurtaTab("all")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeKurtaTab === "all"
                ? "bg-brand text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            All Kurtas
          </button>
          <button
            onClick={() => setActiveKurtaTab("long")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeKurtaTab === "long"
                ? "bg-brand text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            Long Kurtas
          </button>
          <button
            onClick={() => setActiveKurtaTab("short")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeKurtaTab === "short"
                ? "bg-brand text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            Short Kurtas
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Available {isKurtaCategory && activeKurtaTab === "long" ? "Long Kurtas" : isKurtaCategory && activeKurtaTab === "short" ? "Short Kurtas" : category.name} ({displayedProducts.length})
        </h2>

        {displayedProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            No products available in this section yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
