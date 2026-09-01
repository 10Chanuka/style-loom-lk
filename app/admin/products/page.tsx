"use client";

import React, { useState, useEffect, useRef } from "react";
import { store } from "@/lib/supabase/store";
import { Product, ProductImage, ProductVariant } from "@/lib/supabase/mock-data";
import { createClient } from "@/lib/supabase/client";
import { formatLKR } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Tag,
  Sparkles,
  FolderOpen,
  Smartphone,
  Image as ImageIcon,
  Star,
  X,
  Link2,
  Palette,
  Layers,
  Wand2,
  CheckCircle2,
} from "lucide-react";
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

  // Device storage browse state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageTargetColour, setImageTargetColour] = useState("");

  // Quick Variant Generator inputs
  const [genColoursStr, setGenColoursStr] = useState("Black, Blue, Yellow");
  const [genSizesStr, setGenSizesStr] = useState("S, M, L");
  const [genDefaultStock, setGenDefaultStock] = useState(15);

  const loadData = () => {
    store.syncWithSupabase().then(() => {
      setProducts(store.getProducts());
      setCategories(store.getCategories());
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    const code = `PRD-${Date.now().toString().slice(-4)}`;
    setEditingProduct({
      name: "",
      slug: "",
      product_code: code,
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
      product_images: [],
      product_variants: [
        {
          id: `v-${Date.now()}-1`,
          product_id: "",
          sku: `${code}-BLK-S`,
          size: "S",
          colour: "Black",
          stock_quantity: 10,
          price_adjustment: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: `v-${Date.now()}-2`,
          product_id: "",
          sku: `${code}-BLK-M`,
          size: "M",
          colour: "Black",
          stock_quantity: 15,
          price_adjustment: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: `v-${Date.now()}-3`,
          product_id: "",
          sku: `${code}-BLU-M`,
          size: "M",
          colour: "Blue",
          stock_quantity: 12,
          price_adjustment: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
    setImageUrlInput("");
    setImageTargetColour("");
    setDialogOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct({
      ...p,
      product_images: [...(p.product_images || [])],
      product_variants: [...(p.product_variants || [])],
    });
    setImageUrlInput("");
    setImageTargetColour("");
    setDialogOpen(true);
  };

  // Browse local PC / Mobile Phone storage & Google Drive files
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const newImages: ProductImage[] = [...(editingProduct?.product_images || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        showToast(`Skipped ${file.name}: Not a valid image file`, "error");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast(`Skipped ${file.name}: Exceeds 10MB size limit`, "error");
        continue;
      }

      try {
        let finalUrl = "";
        const client = createClient();
        if (client) {
          const fileExt = file.name.split(".").pop();
          const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          const filePath = `products/${fileName}`;

          const { error: uploadErr } = await client.storage
            .from("product-images")
            .upload(filePath, file, { cacheControl: "3600", upsert: true });

          if (!uploadErr) {
            const { data } = client.storage.from("product-images").getPublicUrl(filePath);
            if (data?.publicUrl) {
              finalUrl = data.publicUrl;
            }
          }
        }

        // Fallback to FileReader Base64 Data URL for offline / local mode
        if (!finalUrl) {
          finalUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }

        const isFirst = newImages.length === 0;
        newImages.push({
          id: `img-${Date.now()}-${i}`,
          product_id: editingProduct?.id || "",
          image_url: finalUrl,
          alt_text: editingProduct?.name || file.name,
          display_order: newImages.length + 1,
          is_primary: isFirst,
          colour: imageTargetColour || "",
          created_at: new Date().toISOString(),
        });
      } catch (err: any) {
        showToast(`Failed to process ${file.name}`, "error");
      }
    }

    setEditingProduct((prev) => (prev ? { ...prev, product_images: newImages } : null));
    setUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("Product images uploaded successfully from storage!", "success");
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const url = imageUrlInput.trim();
    const newImages = [...(editingProduct?.product_images || [])];
    const isFirst = newImages.length === 0;
    newImages.push({
      id: `img-${Date.now()}`,
      product_id: editingProduct?.id || "",
      image_url: url,
      alt_text: editingProduct?.name || "Product image",
      display_order: newImages.length + 1,
      is_primary: isFirst,
      colour: imageTargetColour || "",
      created_at: new Date().toISOString(),
    });
    setEditingProduct((prev) => (prev ? { ...prev, product_images: newImages } : null));
    setImageUrlInput("");
  };

  const handleSetPrimaryImage = (index: number) => {
    if (!editingProduct?.product_images) return;
    const updated = editingProduct.product_images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    setEditingProduct((prev) => (prev ? { ...prev, product_images: updated } : null));
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct?.product_images) return;
    const updated = editingProduct.product_images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
      updated[0].is_primary = true;
    }
    setEditingProduct((prev) => (prev ? { ...prev, product_images: updated } : null));
  };

  // Quick Variant Generator
  const handleGenerateVariants = () => {
    const colours = genColoursStr.split(",").map((c) => c.trim()).filter(Boolean);
    const sizes = genSizesStr.split(",").map((s) => s.trim()).filter(Boolean);

    if (colours.length === 0 || sizes.length === 0) {
      showToast("Please enter at least one colour and one size", "error");
      return;
    }

    const newVariants: ProductVariant[] = [];
    const code = editingProduct?.product_code || "SKU";

    colours.forEach((col, cIdx) => {
      sizes.forEach((sz, sIdx) => {
        const colCode = col.substring(0, 3).toUpperCase();
        newVariants.push({
          id: `v-${Date.now()}-${cIdx}-${sIdx}`,
          product_id: editingProduct?.id || "",
          sku: `${code}-${colCode}-${sz}`,
          colour: col,
          size: sz,
          stock_quantity: genDefaultStock,
          price_adjustment: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      });
    });

    setEditingProduct((prev) => (prev ? { ...prev, product_variants: newVariants } : null));
    showToast(`Generated ${newVariants.length} variants across ${colours.length} colours!`, "success");
  };

  const handleAddSingleVariant = () => {
    const existing = editingProduct?.product_variants || [];
    const code = editingProduct?.product_code || "SKU";
    const newV: ProductVariant = {
      id: `v-${Date.now()}`,
      product_id: editingProduct?.id || "",
      sku: `${code}-VAR-${existing.length + 1}`,
      colour: "Black",
      size: "M",
      stock_quantity: 10,
      price_adjustment: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEditingProduct((prev) => (prev ? { ...prev, product_variants: [...existing, newV] } : null));
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const variants = [...(editingProduct?.product_variants || [])];
    variants[index] = { ...variants[index], [field]: value };
    setEditingProduct((prev) => (prev ? { ...prev, product_variants: variants } : null));
  };

  const handleRemoveVariant = (index: number) => {
    const variants = [...(editingProduct?.product_variants || [])];
    variants.splice(index, 1);
    setEditingProduct((prev) => (prev ? { ...prev, product_variants: variants } : null));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.product_code || !editingProduct?.base_price) {
      showToast("Please fill in required product fields", "error");
      return;
    }

    let finalImages = editingProduct.product_images || [];
    if (finalImages.length === 0) {
      finalImages = [
        {
          id: `img-${Date.now()}`,
          product_id: editingProduct.id || "",
          image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
          alt_text: editingProduct.name || "Product image",
          display_order: 1,
          is_primary: true,
          colour: "",
          created_at: new Date().toISOString(),
        },
      ];
    }

    let finalVariants = editingProduct.product_variants || [];
    if (finalVariants.length === 0) {
      finalVariants = [
        {
          id: `v-${Date.now()}`,
          product_id: editingProduct.id || "",
          sku: `${editingProduct.product_code}-STD-M`,
          size: "M",
          colour: "Standard",
          stock_quantity: 10,
          price_adjustment: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    const totalStock = finalVariants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
    const calculatedStockStatus: "in_stock" | "low_stock" | "out_of_stock" =
      totalStock <= 0 ? "out_of_stock" : totalStock <= 5 ? "low_stock" : "in_stock";

    try {
      store.saveProduct({
        ...editingProduct,
        product_images: finalImages,
        product_variants: finalVariants,
        stock_status: calculatedStockStatus,
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

  // Extract distinct colours configured for editingProduct
  const currentVariants = editingProduct?.product_variants || [];
  const currentColoursList = Array.from(new Set(currentVariants.map((v) => v.colour))).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-brand" /> Product Catalogue Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, archive products, upload specific photos per colour, manage sizes, and exact stock counts.
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
                <th className="p-4">Colours & Variants</th>
                <th className="p-4">Total Inventory</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                const primaryImg = p.product_images?.find((i) => i.is_primary)?.image_url || p.product_images?.[0]?.image_url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";
                const pVariants = p.product_variants || [];
                const pColours = Array.from(new Set(pVariants.map((v) => v.colour)));
                const totalStock = pVariants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-4 flex items-center gap-3">
                      <img src={primaryImg} alt={p.name} className="h-12 w-10 object-cover rounded-md bg-slate-100 border border-slate-200" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">{p.name}</span>
                        <span className="text-[10px] font-mono text-brand">{p.product_code}</span>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {cat?.name || "Uncategorized"}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {pColours.map((c, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            {c}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">{pVariants.length} total variants</span>
                    </td>

                    <td className="p-4">
                      <span className={`font-extrabold text-xs ${totalStock <= 0 ? "text-rose-600" : totalStock <= 5 ? "text-amber-600" : "text-emerald-600"}`}>
                        {totalStock} items
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {formatLKR(p.sale_price ?? p.base_price)}
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
          title={editingProduct.id ? `Edit Product: ${editingProduct.name}` : "Add New Product & Set Up Colours / Sizes"}
          className="max-w-4xl"
        >
          <form onSubmit={handleSave} className="space-y-6 max-h-[82vh] overflow-y-auto pr-2">
            
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product Title / Name *</label>
                <Input
                  type="text"
                  value={editingProduct.name || ""}
                  onChange={(e) => {
                    const newName = e.target.value;
                    const autoSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                    setEditingProduct({ ...editingProduct, name: newName, slug: editingProduct.slug || autoSlug });
                  }}
                  className="mt-1 text-xs"
                  placeholder="e.g. Minimalist Tropical Palm Tee"
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
                  placeholder="e.g. TEE-PLM-01"
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

            {/* Custom URL Slug & Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">URL Slug</label>
                <Input
                  type="text"
                  value={editingProduct.slug || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                  className="mt-1 text-xs font-mono"
                  placeholder="e.g. tropical-palm-tee"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={editingProduct.featured || false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand cursor-pointer"
                />
                <label htmlFor="featured-toggle" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Featured on Homepage
                </label>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={editingProduct.is_active ?? true}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                />
                <label htmlFor="active-toggle" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  🟢 Published / Visible to Customers
                </label>
              </div>
            </div>

            {/* Short & Full Descriptions */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Short Summary / Tagline</label>
                <Input
                  type="text"
                  value={editingProduct.short_description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                  className="mt-1 text-xs"
                  placeholder="e.g. Relaxed-fit 100% breathable cotton tee with custom palm embroidery."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Detailed Product Story & Specifications</label>
                <textarea
                  rows={3}
                  value={editingProduct.full_description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, full_description: e.target.value })}
                  className="w-full mt-1 rounded-md border border-slate-300 p-2.5 text-xs bg-white focus:ring-2 focus:ring-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  placeholder="Enter full product details, fit guide, fabric texture, lining, design background, and recommended styling..."
                />
              </div>
            </div>

            {/* Fabric & Garment Care Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Fabric Composition / Material</label>
                <Input
                  type="text"
                  value={editingProduct.material || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                  className="mt-1 text-xs"
                  placeholder="e.g. 100% Combed Organic Cotton / Linen Blend"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Garment Care Instructions</label>
                <textarea
                  rows={2}
                  value={editingProduct.care_instructions || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, care_instructions: e.target.value })}
                  className="w-full mt-1 rounded-md border border-slate-300 p-2 text-xs bg-white focus:ring-2 focus:ring-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  placeholder="e.g. Hand wash cold with gentle detergent. Do not bleach. Line dry in shade. Warm iron on reverse."
                />
              </div>
            </div>

            {/* SECTION 1: COLOUR-SPECIFIC PHOTOS UPLOADER */}
            <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-brand" /> Product Photos & Colour Assignments
                  </label>
                  <p className="text-[10px] text-slate-500">
                    Upload photos for each colour (Black photo, Blue photo, Yellow photo, etc.) so when customers click a colour, the photo changes!
                  </p>
                </div>
              </div>

              {/* Upload Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                {/* File Upload Button */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand rounded-xl p-3 text-center cursor-pointer bg-white dark:bg-slate-900 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors flex flex-col items-center justify-center gap-1"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <div className="flex items-center gap-1.5 text-brand font-bold text-xs">
                    <FolderOpen className="h-4 w-4" />
                    <Smartphone className="h-4 w-4" />
                    <span>Upload Photo from Device / Phone</span>
                  </div>
                  <span className="text-[10px] text-slate-500">PC storage, phone gallery, or Drive</span>
                  {uploadingImage && <span className="text-[10px] text-brand font-semibold animate-pulse">Uploading file...</span>}
                </div>

                {/* Direct URL Box with Optional Colour Tag */}
                <div className="space-y-2 flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Palette className="h-3.5 w-3.5 text-brand" /> Tag Photo to Colour:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Black, Blue, Yellow"
                      value={imageTargetColour}
                      onChange={(e) => setImageTargetColour(e.target.value)}
                      className="text-xs h-7 px-2 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex-1"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="Or enter Image URL (https://...)"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="text-xs h-8"
                    />
                    <Button type="button" size="sm" variant="outline" onClick={handleAddImageUrl} className="h-8 text-xs shrink-0">
                      Add Photo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Uploaded Images List & Colour Tags */}
              {editingProduct.product_images && editingProduct.product_images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {editingProduct.product_images.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className={`relative rounded-xl overflow-hidden border-2 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between ${
                        img.is_primary ? "border-brand ring-2 ring-brand/30" : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="relative h-28 w-full bg-slate-100 dark:bg-slate-800">
                        <img src={img.image_url} alt={img.alt_text} className="h-full w-full object-cover" />
                        
                        <div className="absolute top-1 left-1">
                          {img.is_primary ? (
                            <span className="bg-brand text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow">
                              <Star className="h-2.5 w-2.5 fill-white" /> Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="bg-slate-900/80 hover:bg-brand text-white text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm transition-colors shadow"
                            >
                              Set Primary
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-700 text-white p-1 rounded-full shadow transition-colors"
                          title="Remove Photo"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Tag Colour Input */}
                      <div className="p-1.5 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                        <label className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">Photo Colour Tag:</label>
                        <Input
                          type="text"
                          placeholder="e.g. Black, Blue, Yellow..."
                          value={img.colour || ""}
                          onChange={(e) => {
                            const updated = [...(editingProduct.product_images || [])];
                            updated[idx].colour = e.target.value;
                            setEditingProduct({ ...editingProduct, product_images: updated });
                          }}
                          className="h-6 text-[10px] px-1.5 py-0 bg-white dark:bg-slate-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 2: COLOURS, SIZES & STOCK MATRIX */}
            <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-brand" /> Colours, Sizes & Stock Inventory Matrix *
                  </label>
                  <p className="text-[10px] text-slate-500">
                    Set up exactly how many items are available in each Colour & Size combination (e.g. Black S: 10, Black M: 15, Blue M: 12).
                  </p>
                </div>
              </div>

              {/* Quick Generator Assistant */}
              <div className="bg-rose-50/60 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 space-y-2">
                <span className="text-[11px] font-extrabold text-brand uppercase tracking-wider flex items-center gap-1">
                  <Wand2 className="h-3.5 w-3.5" /> ⚡ Quick Variant & Stock Generator
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Colours (comma separated)</label>
                    <Input
                      type="text"
                      value={genColoursStr}
                      onChange={(e) => setGenColoursStr(e.target.value)}
                      className="h-7 text-xs mt-0.5 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Sizes (comma separated)</label>
                    <Input
                      type="text"
                      value={genSizesStr}
                      onChange={(e) => setGenSizesStr(e.target.value)}
                      className="h-7 text-xs mt-0.5 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Default Stock per Item</label>
                    <Input
                      type="number"
                      value={genDefaultStock}
                      onChange={(e) => setGenDefaultStock(parseInt(e.target.value) || 0)}
                      className="h-7 text-xs mt-0.5 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" size="sm" onClick={handleGenerateVariants} className="h-7 w-full text-xs font-bold bg-brand hover:bg-brand/90">
                      Generate Matrix
                    </Button>
                  </div>
                </div>
              </div>

              {/* Variants Rows Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    Configured Colour & Size Variants ({currentVariants.length})
                  </span>
                  <Button type="button" size="sm" variant="outline" onClick={handleAddSingleVariant} className="text-xs h-7">
                    <Plus className="h-3 w-3 mr-1" /> Add Single Variant
                  </Button>
                </div>

                <div className="overflow-x-auto max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Colour Name *</th>
                        <th className="p-2.5">Size *</th>
                        <th className="p-2.5">Stock Available *</th>
                        <th className="p-2.5">Price Adjust (LKR)</th>
                        <th className="p-2.5">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {currentVariants.map((v, idx) => (
                        <tr key={v.id || idx}>
                          <td className="p-2">
                            <Input
                              type="text"
                              value={v.colour}
                              onChange={(e) => handleUpdateVariant(idx, "colour", e.target.value)}
                              className="h-7 text-xs"
                              placeholder="e.g. Black, Blue..."
                              required
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="text"
                              value={v.size}
                              onChange={(e) => handleUpdateVariant(idx, "size", e.target.value)}
                              className="h-7 text-xs"
                              placeholder="e.g. S, M, L..."
                              required
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={v.stock_quantity}
                              onChange={(e) => handleUpdateVariant(idx, "stock_quantity", parseInt(e.target.value) || 0)}
                              className="h-7 text-xs font-bold"
                              required
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={v.price_adjustment || 0}
                              onChange={(e) => handleUpdateVariant(idx, "price_adjustment", parseFloat(e.target.value) || 0)}
                              className="h-7 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveVariant(idx)}
                              className="h-7 w-7 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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

            <Button type="submit" className="w-full mt-4 font-extrabold text-sm py-2.5">
              Save Product Record & Inventory Matrix
            </Button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
