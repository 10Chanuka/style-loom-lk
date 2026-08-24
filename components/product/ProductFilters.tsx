"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface FilterState {
  search: string;
  category: string;
  size: string;
  colour: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  featuredOnly: boolean;
  sortBy: "newest" | "price_asc" | "price_desc";
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  categories,
}: ProductFiltersProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Filter className="h-4 w-4 text-brand" /> Filter & Sort Products
        </h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-xs text-slate-500 hover:text-brand">
          <RotateCcw className="h-3.5 w-3.5 mr-1" /> Clear Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
            Search
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="pl-9 text-xs"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
            Category
          </label>
          <Select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="text-xs"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Size Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
            Size
          </label>
          <Select
            value={filters.size}
            onChange={(e) => onFilterChange({ size: e.target.value })}
            className="text-xs"
          >
            <option value="">All Sizes</option>
            <option value="S">Small (S / 34)</option>
            <option value="M">Medium (M / 36)</option>
            <option value="L">Large (L / 38)</option>
            <option value="XL">Extra Large (XL / 40)</option>
          </Select>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
            Sort By
          </label>
          <Select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="text-xs"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </Select>
        </div>
      </div>

      {/* Checkbox Toggles */}
      <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="rounded border-slate-300 text-brand focus:ring-brand"
          />
          <span>In-Stock Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={filters.featuredOnly}
            onChange={(e) => onFilterChange({ featuredOnly: e.target.checked })}
            className="rounded border-slate-300 text-brand focus:ring-brand"
          />
          <span>Featured Only</span>
        </label>
      </div>
    </div>
  );
}
