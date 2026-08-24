"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/supabase/store";
import { Product } from "@/lib/supabase/mock-data";
import { formatLKR } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import { Package, Plus, Edit3, Trash2, Eye, Tag, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [categories, setCategories] = useState(store.getCategories());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const loadData = () => {
    setProducts(store.getProducts());
    setCategories(store.getCategories());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct({
      name: "",
      slug: "",
      product_code: `PRD-${Date.now().toString().slice(-4)}`,
      category_id: categories[0]?.id || "",
      base_price: 3000,
      sale_price: null,
      short_description: "",
      full_description: "",
      material: "100% Combed Cotton",
      care_instructions: "Machine wash cold gentle",
      featured: false,
      is_active: true,
      stock_status: "in_stock",
      product_images: [
        {
          id: `img-${Date.now()}`,
          product_id: "",
          image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
          alt_text: "Product image",
          display_order: 1,
          is_primary: true,
          created_at: new Date().toISOString(),
        },
      ],
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.product_code || !editingProduct?.base_price) {
      showToast("Please fill in required product fields", "error");
      return;
    }

    try {
      store.saveProduct({
        ...editingProduct,
        slug: editingProduct.slug || editingProduct.name.toLowerCase().replace(/\s+/g, "-"),
      });
      showToast(editingProduct.id ? "Product updated successfully!" : "New product created successfully!", "success");
      setDialogOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || "Failed to save product", "error");
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete product "${name}"?`)) {
      store.deleteProduct(id);
      showToast(`Product "${name}" deleted`, "info");
      loadData();
    }
  };

  const toggleActive = (p: Product) => {
    store.saveProduct({ id: p.id, is_active: !p.is_active });
    showToast(`Product "${p.name}" ${!p.is_active ? "activated" : "archived"}`, "info");
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-brand" /> Product Catalogue Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, archive products, update images, prices, and stock statuses.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="font-bold text-xs">
          <Plus className="mr-1.5 h-4 w-4" /> Add New Product
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              <tr>
                <th className="p-4">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Sale Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                const img = p.product_images?.[0]?.image_url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-4 flex items-center gap-3">
                      <img src={img} alt={p.name} className="h-12 w-10 object-cover rounded-md bg-slate-100" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">{p.name}</span>
                        <span className="text-[10px] font-mono text-brand">{p.product_code}</span>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {cat?.name || "Uncategorized"}
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatLKR(p.base_price)}
                    </td>

                    <td className="p-4 text-emerald-600 font-bold">
                      {p.sale_price ? formatLKR(p.sale_price) : "-"}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={p.is_active ? "success" : "secondary"}>
                          {p.is_active ? "Active" : "Archived"}
                        </Badge>
                        {p.featured && <Badge variant="default">Featured</Badge>}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(p)}>
                          <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleActive(p)}>
                          {p.is_active ? "Archive" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id, p.name)}>
                          <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingProduct && (
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={editingProduct.id ? "Edit Product" : "Add New Product"}
        >
          <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product Name *</label>
                <Input
                  type="text"
                  value={editingProduct.name || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="mt-1 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product Code (SKU Prefix) *</label>
                <Input
                  type="text"
                  value={editingProduct.product_code || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, product_code: e.target.value })}
                  className="mt-1 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category *</label>
                <Select
                  value={editingProduct.category_id || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                  className="mt-1 text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Base Price (LKR) *</label>
                <Input
                  type="number"
                  value={editingProduct.base_price || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, base_price: parseFloat(e.target.value) || 0 })}
                  className="mt-1 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sale Price (Optional LKR)</label>
                <Input
                  type="number"
                  value={editingProduct.sale_price ?? ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sale_price: e.target.value ? parseFloat(e.target.value) : null })}
                  className="mt-1 text-xs"
                  placeholder="Leave empty if not on sale"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Short Description</label>
              <Input
                type="text"
                value={editingProduct.short_description || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Description</label>
              <textarea
                rows={3}
                value={editingProduct.full_description || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, full_description: e.target.value })}
                className="w-full mt-1 rounded-md border border-slate-300 p-2 text-xs bg-white focus:ring-2 focus:ring-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Material / Fabric</label>
                <Input
                  type="text"
                  value={editingProduct.material || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Care Instructions</label>
                <Input
                  type="text"
                  value={editingProduct.care_instructions || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, care_instructions: e.target.value })}
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Primary Product Image URL</label>
              <Input
                type="text"
                value={editingProduct.product_images?.[0]?.image_url || ""}
                onChange={(e) => {
                  const url = e.target.value;
                  const newImgs = [...(editingProduct.product_images || [])];
                  if (newImgs.length > 0) {
                    newImgs[0].image_url = url;
                  } else {
                    newImgs.push({
                      id: `img-${Date.now()}`,
                      product_id: editingProduct.id || "",
                      image_url: url,
                      alt_text: editingProduct.name || "",
                      display_order: 1,
                      is_primary: true,
                      created_at: new Date().toISOString(),
                    });
                  }
                  setEditingProduct({ ...editingProduct, product_images: newImgs });
                }}
                className="mt-1 text-xs"
              />
            </div>

            <div className="flex items-center gap-6 pt-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={editingProduct.featured || false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                  className="rounded text-brand"
                />
                <span>Featured Product</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={editingProduct.is_active ?? true}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                  className="rounded text-brand"
                />
                <span>Is Active in Store</span>
              </label>
            </div>

            <Button type="submit" className="w-full mt-4 font-bold">
              Save Product Record
            </Button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
