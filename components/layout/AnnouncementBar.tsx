"use client";

import React from "react";
import { Truck, PhoneCall, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
          <span>Island-wide Delivery across Sri Lanka | Custom Printing & Tailoring Available</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-emerald-400" /> Standard Delivery 3-5 Days
          </span>
          <a
            href="https://wa.me/94714903231"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5 text-rose-400" /> WhatsApp: +94 71 490 3231
          </a>
        </div>
      </div>
    </div>
  );
}
