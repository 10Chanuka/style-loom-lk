"use client";

import React, { useState } from "react";
import { ProductImage } from "@/lib/supabase/mock-data";
import { ZoomIn, Eye } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const primaryImg = images.find((img) => img.is_primary)?.image_url || images[0]?.image_url;
  const [selectedImage, setSelectedImage] = useState(primaryImg);
  const [zoomOpen, setZoomOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Primary Display */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md group">
        <img
          src={selectedImage}
          alt={productName}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={() => setZoomOpen(true)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 p-2.5 rounded-full shadow-lg hover:bg-white transition-colors"
          title="Zoom image"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img.image_url)}
              className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                selectedImage === img.image_url
                  ? "border-brand ring-2 ring-brand/30"
                  : "border-slate-200 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img.image_url}
                alt={img.alt_text || productName}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <Dialog
        open={zoomOpen}
        onOpenChange={setZoomOpen}
        title={productName}
        className="max-w-4xl"
      >
        <div className="relative aspect-[3/4] max-h-[80vh] w-full overflow-hidden rounded-xl bg-slate-950">
          <img
            src={selectedImage}
            alt={productName}
            className="h-full w-full object-contain mx-auto"
          />
        </div>
      </Dialog>
    </div>
  );
}
