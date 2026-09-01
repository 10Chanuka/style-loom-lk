"use client";

import React, { useState, useEffect, useRef } from "react";
import { store } from "@/lib/supabase/store";
import { Category } from "@/lib/supabase/mock-data";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import { FolderTree, Edit3, FolderOpen, Smartphone, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>(store.getCategories());
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = () => {
    setCategories(store.getCategories());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setDialogOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingCategory) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file", "error");
      return;
    }

    setUploadingImage(true);
    try {
      let finalUrl = "";
      const client = createClient();
      if (client) {
        const fileExt = file.name.split(".").pop();
        const fileName = `category-${Date.now()}.${fileExt}`;
        const filePath = `categories/${fileName}`;

        const { error: uploadErr } = await client.storage
          .from("product-images")
          .upload(filePath, file, { cacheControl: "3600", upsert: true });

        if (!uploadErr) {
          const { data } = client.storage.from("product-images").getPublicUrl(filePath);
          if (data?.publicUrl) finalUrl = data.publicUrl;
        }
      }

      if (!finalUrl) {
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      setEditingCategory({ ...editingCategory, image_url: finalUrl });
      showToast("Category image uploaded from storage!", "success");
    } catch {
      showToast("Failed to process image file", "error");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    store.updateCategory(editingCategory.id, editingCategory);
    showToast(`Category "${editingCategory.name}" updated successfully!`, "success");
    setDialogOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <FolderTree className="h-6 w-6 text-brand" /> Category Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Edit category descriptions, upload images from device storage, display order, and active visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={cat.image_url} alt={cat.name} className="h-full w-full object-cover" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-brand uppercase">Slug: {cat.slug}</span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{cat.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between dark:border-slate-800">
              <span className="text-xs text-slate-400">Display Order: {cat.display_order}</span>
              <Button size="sm" variant="outline" onClick={() => handleOpenEdit(cat)} className="text-xs">
                <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingCategory && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title={`Edit Category: ${editingCategory.name}`}>
          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category Name</label>
              <Input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="mt-1 text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                rows={3}
                value={editingCategory.description}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                className="w-full mt-1 rounded-md border border-slate-300 p-2 text-xs bg-white focus:ring-2 focus:ring-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            {/* IMAGE SELECTION & DEVICE STORAGE BROWSE */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category Cover Image</label>
              
              {editingCategory.image_url && (
                <div className="h-32 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 mb-2">
                  <img src={editingCategory.image_url} alt="Cover Preview" className="h-full w-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand rounded-xl p-3 text-center cursor-pointer bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-1"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-1.5 text-brand font-bold text-xs">
                    <FolderOpen className="h-4 w-4" />
                    <Smartphone className="h-4 w-4" />
                    <span>Browse PC / Phone Storage</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Pick image file from device</span>
                  {uploadingImage && <span className="text-[10px] text-brand font-semibold animate-pulse">Uploading...</span>}
                </div>

                <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Link2 className="h-3.5 w-3.5 text-slate-400" /> Or Image URL
                  </label>
                  <Input
                    type="url"
                    value={editingCategory.image_url}
                    onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                    className="text-xs h-8 mt-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Display Order</label>
              <Input
                type="number"
                value={editingCategory.display_order}
                onChange={(e) => setEditingCategory({ ...editingCategory, display_order: parseInt(e.target.value) || 0 })}
                className="mt-1 text-xs"
              />
            </div>

            <Button type="submit" className="w-full font-bold">Save Category Changes</Button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
