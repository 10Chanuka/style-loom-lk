"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/supabase/store";
import { Sparkles, Database } from "lucide-react";

export function SiteLoader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [statusText, setStatusText] = useState("Connecting to Supabase database...");
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Progress bar ticker for smooth visual feedback
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 85) return prev + Math.floor(Math.random() * 12) + 5;
        return prev;
      });
    }, 200);

    const timer1 = setTimeout(() => {
      setStatusText("Fetching products, categories & site details...");
    }, 400);

    const finishLoading = () => {
      setProgress(100);
      setStatusText("Ready!");
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }, 300);
    };

    // Trigger store sync & wait for completion
    store.syncWithSupabase().finally(() => {
      finishLoading();
    });

    // Fallback safety timeout so loader never hangs
    const safetyTimer = setTimeout(() => {
      finishLoading();
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(safetyTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background ambient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto px-6 text-center space-y-6">
        
        {/* Brand Emblem with Golden Pulsing Ring */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-full border border-[#D4AF37]/40 animate-ping opacity-30" />
          <div className="absolute -inset-1.5 rounded-full border-2 border-[#D4AF37] animate-spin" style={{ animationDuration: '3s' }} />
          <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#D4AF37] p-0.5 bg-slate-900 shadow-2xl shadow-[#D4AF37]/20 flex items-center justify-center relative z-10">
            <img
              src="/logo.jpg"
              alt="Style Loom Logo"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Brand Title & Tagline */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-extrabold uppercase tracking-widest mb-1">
            <Sparkles className="h-3 w-3" /> Official Store
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-white via-[#F5E6BE] to-[#D4AF37] bg-clip-text text-transparent uppercase">
            Style Loom
          </h1>
          <p className="text-xs text-slate-400 font-light tracking-wide italic">
            Style That Speaks, Quality That Lasts
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full space-y-2 pt-2">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] rounded-full transition-all duration-300 ease-out shadow-sm shadow-[#D4AF37]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-1">
            <Database className="h-3 w-3 text-[#D4AF37] animate-pulse" />
            <span>{statusText}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
