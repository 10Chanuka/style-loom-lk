"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { store } from "@/lib/supabase/store";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [category, setCategory] = useState(store.getCategoryBySlug(slug));
  const [products, setProducts] = useState(
    store.getProducts().filter((p) => p.category?.slug === slug || p.category_id === category?.id)
  );

  useEffect(() => {
    const cat = store.getCategoryBySlug(slug);
    setCategory(cat);
    if (cat) {
      const catProducts = store.getProducts().filter((p) => p.category_id === cat.id && p.is_active);
      setProducts(catProducts);
    }
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
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Category</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">{category.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Available {category.name} ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            No products available in this category yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
