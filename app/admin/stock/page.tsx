"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/supabase/store";
import { Product, ProductVariant } from "@/lib/supabase/mock-data";
import { useToast } from "@/components/ui/toast";
import { Layers, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminStockPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(store.getProducts());

  const loadData = () => {
    setProducts(store.getProducts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockQuantityChange = (productId: string, variantId: string, quantity: number) => {
    const p = store.getProductById(productId);
    if (!p || !p.product_variants) return;

    const newVariants = p.product_variants.map((v) => {
      if (v.id === variantId) {
        return { ...v, stock_quantity: quantity, updated_at: new Date().toISOString() };
      }
      return v;
    });

    const totalStock = newVariants.reduce((sum, v) => sum + v.stock_quantity, 0);
    const newStatus = totalStock <= 0 ? "out_of_stock" : totalStock <= 5 ? "low_stock" : "in_stock";

    store.saveProduct({
      id: p.id,
      product_variants: newVariants,
      stock_status: newStatus,
    });

    showToast(`Stock updated for ${p.name}`, "success");
    loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Layers className="h-6 w-6 text-brand" /> Variants & Stock Quantity Control
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage individual size/colour SKUs, update stock quantities, and view low-stock indicators.
        </p>
      </div>

      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-brand">{p.product_code}</span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{p.name}</h3>
              </div>

              <Badge
                variant={
                  p.stock_status === "in_stock"
                    ? "success"
                    : p.stock_status === "low_stock"
                    ? "warning"
                    : "destructive"
                }
              >
                Status: {p.stock_status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {p.product_variants?.map((v) => (
                <div key={v.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-slate-400">{v.sku}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{v.size} / {v.colour}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-500">Stock Quantity:</label>
                    <Input
                      type="number"
                      min={0}
                      value={v.stock_quantity}
                      onChange={(e) => handleStockQuantityChange(p.id, v.id, parseInt(e.target.value) || 0)}
                      className="h-8 w-20 text-xs font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
