"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { store } from "@/lib/supabase/store";
import {
  Sparkles,
  Scissors,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
  Mail,
  MapPin,
  PhoneCall,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const [settings, setSettings] = useState(store.getSiteSettings());

  useEffect(() => {
    setSettings(store.getSiteSettings());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-rose-100 text-brand px-3.5 py-1.5 rounded-full text-xs font-bold dark:bg-slate-800">
          <Sparkles className="h-4 w-4" /> About {settings.business_name}
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Crafting Island Style & Timeless Tailoring
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {settings.about_content}
        </p>
      </div>

      {/* Story & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission & Craftsmanship</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            At {settings.business_name}, we believe fashion should combine everyday comfort with distinctive island elegance. Every printed T-shirt is printed using high-density bio-washed cotton, our Kurtas feature authentic handcrafted embroidery, and our Blouses are engineered for superior fit and comfort.
          </p>
          <div className="space-y-2 pt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> 100% Combed Cotton & Pure Linen Fabrics
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-500" /> Islandwide Delivery across Sri Lanka in 3-5 days
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-emerald-500" /> 7-Day Easy Exchange Policy
            </div>
          </div>
        </div>

        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
            alt="Tailoring Workshop"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Delivery & Return Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-base">
            <Truck className="h-5 w-5" /> Delivery Information
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {settings.delivery_information}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-base">
            <RotateCcw className="h-5 w-5" /> Return & Exchange Policy
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {settings.return_policy}
          </p>
        </div>
      </div>

      {/* Direct Contact & Location Card */}
      <div className="p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-2xl font-bold">Contact Our Store Team</h3>
          <p className="text-xs text-slate-300">
            Have questions about sizes, upcoming drops, or custom orders? Reach out directly via WhatsApp or visit our Colombo store location.
          </p>
          <div className="space-y-2 text-xs text-slate-300 pt-2">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand shrink-0" /> {settings.address}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand shrink-0" /> {settings.business_email}
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-brand shrink-0" /> {settings.business_phone}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <a
            href={`https://wa.me/${settings.whatsapp_number}`}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-lg text-sm shadow transition-colors"
          >
            <MessageCircle className="h-5 w-5" /> Message +94 71 490 3231
          </a>
          <Button asChild variant="outline" className="w-full text-slate-900 bg-white hover:bg-slate-100">
            <Link href="/customize">
              <Scissors className="mr-2 h-4 w-4 text-brand" /> Custom Clothing Form
            </Link>
          </Button>
        </div>
      </div>

    </div>
  );
}
