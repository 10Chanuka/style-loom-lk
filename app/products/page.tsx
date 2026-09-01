"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { store } from "@/lib/supabase/store";
import { ProductFilters, FilterState } from "@/components/product/ProductFilters";
import { ProductCard } from "@/components/product/ProductCard";
import { ShoppingBag, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";
  const initialFeatured = searchParams.get("featured") === "true";

  const [categories, setCategories] = useState(store.getCategories());
  const [products, setProducts] = useState(store.getProducts());

  const [filters, setFilters] = useState<FilterState>({
    search: initialQuery,
    category: initialCategory,
    size: "",
    colour: "",
    minPrice: "",
    maxPrice: "",
    inStockOnly: false,
    featuredOnly: initialFeatured,
    sortBy: "newest",
  });

  useEffect(() => {
    store.syncWithSupabase().then(() => {
      setCategories(store.getCategories());
      setProducts(store.getProducts());
    });
  }, []);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "",
      size: "",
      colour: "",
      minPrice: "",
      maxPrice: "",
      inStockOnly: false,
      featuredOnly: false,
      sortBy: "newest",
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.is_active) return false;

      // Category filter
      if (filters.category) {
        const cat = categories.find((c) => c.slug === filters.category);
        if (cat && product.category_id !== cat.id) return false;
      }

      // Search query
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCode = product.product_code.toLowerCase().includes(q);
        const matchesDesc = product.short_description.toLowerCase().includes(q);
        const matchesMat = product.material.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesDesc && !matchesMat) return false;
      }

      // Size filter
      if (filters.size) {
        const hasSize = product.product_variants?.some(
          (v) => v.size.toLowerCase() === filters.size.toLowerCase() && v.is_active
        );
        if (!hasSize) return false;
      }

      // In stock filter
      if (filters.inStockOnly && product.stock_status === "out_of_stock") {
        return false;
      }

      // Featured filter
      if (filters.featuredOnly && !product.featured) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.sale_price ?? a.base_price;
      const priceB = b.sale_price ?? b.base_price;

      if (filters.sortBy === "price_asc") return priceA - priceB;
      if (filters.sortBy === "price_desc") return priceB - priceA;
      // default newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [products, categories, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Clothing Collection
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse our full range of printed T-shirts, Kurtas, and tailored Blouses.
        </p>
      </div>

      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        categories={categories}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 pb-2">
        <span>Showing {filteredProducts.length} Products</span>
        {filters.search && <span>Query: &ldquo;{filters.search}&rdquo;</span>}
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <SearchX className="h-12 w-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No products found matching your filters
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, size filter, or clear filters to see more results.
            </p>
          </div>
          <Button onClick={handleResetFilters} variant="outline" size="sm">
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading products catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
