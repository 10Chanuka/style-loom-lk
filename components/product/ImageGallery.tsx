"use client";

import React, { useState, useEffect } from "react";
import { ProductImage } from "@/lib/supabase/mock-data";
import { ZoomIn } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
  activeColour?: string;
  selectedImageUrl?: string;
  onImageSelect?: (img: ProductImage) => void;
}

export function ImageGallery({
  images,
  productName,
  activeColour,
  selectedImageUrl,
  onImageSelect,
}: ImageGalleryProps) {
  const primaryImg = images.find((img) => img.is_primary)?.image_url || images[0]?.image_url;
  const [selectedImage, setSelectedImage] = useState(primaryImg);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    if (selectedImageUrl) {
      setSelectedImage(selectedImageUrl);
    } else if (activeColour) {
      const match = images.find(
        (img) =>
          (img.colour && img.colour.toLowerCase() === activeColour.toLowerCase()) ||
          (img.alt_text && img.alt_text.toLowerCase().includes(activeColour.toLowerCase()))
      );
      if (match) {
        setSelectedImage(match.image_url);
      }
    }
  }, [activeColour, selectedImageUrl, images]);

  const handleThumbnailClick = (img: ProductImage) => {
    setSelectedImage(img.image_url);
    if (onImageSelect) {
      onImageSelect(img);
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Display Box */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md group">
        <img
          src={selectedImage}
          alt={productName}
          className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105"
        />
        <button
          onClick={() => setZoomOpen(true)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 p-2.5 rounded-full shadow-lg hover:bg-white transition-colors"
          title="Zoom image"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>

      {/* Thumbnails List */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => handleThumbnailClick(img)}
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
              {img.colour && (
                <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white text-[8px] font-bold py-0.5 text-center truncate px-0.5">
                  {img.colour}
                </span>
              )}
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
