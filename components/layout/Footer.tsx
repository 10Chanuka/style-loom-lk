"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PhoneCall, Mail, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";
import { store } from "@/lib/supabase/store";
import { INITIAL_SITE_SETTINGS, INITIAL_CATEGORIES, Category } from "@/lib/supabase/mock-data";

export function Footer() {
  const [settings, setSettings] = useState(INITIAL_SITE_SETTINGS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    const updateFooter = () => {
      setSettings(store.getSiteSettings());
      setCategories(store.getCategories());
    };
    updateFooter();
    const unsub = store.subscribe(updateFooter);
    store.syncWithSupabase().then(updateFooter);
    return () => unsub();
  }, []);

  const cleanWhatsapp = (settings.whatsapp_number || "94741880953").replace(/[^0-9]/g, "");

  return (
    <footer className="bg-[#1E110A] text-amber-100/90 border-t border-[#3D2314]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 font-bold text-2xl tracking-tight text-white">
              <img src="/logo.jpg" alt="Style Loom Logo" className="h-10 w-10 rounded-lg object-cover shadow border border-[#D4AF37]/40" />
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight leading-none">
                  <span className="text-white">Style</span> <span className="text-[#D4AF37]">Loom</span>
                </span>
                <span className="text-xs text-[#D4AF37] font-medium italic">“Style That Speaks, Quality That Lasts.”</span>
              </div>
            </Link>
            <p className="text-xs text-amber-100/70 leading-relaxed max-w-sm line-clamp-4">
              {settings.about_content}
            </p>
            <div className="flex items-center space-x-3 pt-2 flex-wrap gap-y-2">
              {settings.social_links?.facebook && (
                <a
                  href={settings.social_links.facebook}
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  className="p-2 bg-[#2A170C] hover:bg-[#D4AF37] text-amber-100 hover:text-slate-950 rounded-full transition-colors border border-[#5C3A21]"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings.social_links?.instagram && (
                <a
                  href={settings.social_links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  className="p-2 bg-[#2A170C] hover:bg-[#D4AF37] text-amber-100 hover:text-slate-950 rounded-full transition-colors border border-[#5C3A21]"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings.social_links?.tiktok && (
                <a
                  href={settings.social_links.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  title="TikTok"
                  className="p-2 bg-[#2A170C] hover:bg-[#D4AF37] text-amber-100 hover:text-slate-950 rounded-full transition-colors border border-[#5C3A21]"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.04z"/>
                  </svg>
                </a>
              )}
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-emerald-950 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold px-3 border border-emerald-800"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Shopping</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-[#D4AF37] transition-colors">Shop All Products</Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-[#D4AF37] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors">About Style Loom</Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-[#D4AF37] transition-colors">Leave Feedback</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#D4AF37] transition-colors">View Cart & Checkout</Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#D4AF37] transition-colors">My Orders</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Store Info</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-amber-100/70 text-xs">{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span className="text-amber-100/70 text-xs">{settings.business_phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span className="text-amber-100/70 text-xs">{settings.business_email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#3D2314] flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/60 gap-4">
          <p>© {new Date().getFullYear()} {settings.business_name}. All rights reserved. Prices in Sri Lankan Rupees (LKR).</p>
          <div className="flex space-x-4">
            <Link href="/about" className="hover:text-[#D4AF37] hover:underline">Delivery & Shipping</Link>
            <Link href="/about" className="hover:text-[#D4AF37] hover:underline">7-Day Return Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
