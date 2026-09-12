"use client";

import React from "react";
import { Truck, PhoneCall, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-[#2A170C] text-amber-50 text-xs py-2 px-4 border-b border-[#3D2314]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#D4AF37] animate-pulse" />
          <span className="font-medium">Island-wide Delivery across Sri Lanka | Premium Apparel Collections</span>
        </div>
        <div className="flex items-center gap-4 text-amber-100/90">
          <span className="flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-[#D4AF37]" /> Standard Delivery 3-5 Days
          </span>
          <a
            href="https://wa.me/94741880953"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#D4AF37] hover:text-white font-semibold transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5" /> WhatsApp: +94 74 188 0953
          </a>
        </div>
      </div>
    </div>
  );
}
