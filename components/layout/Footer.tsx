"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PhoneCall, Mail, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";
import { store } from "@/lib/supabase/store";
import { INITIAL_SITE_SETTINGS } from "@/lib/supabase/mock-data";

export function Footer() {
  const [settings, setSettings] = useState(INITIAL_SITE_SETTINGS);

  useEffect(() => {
    setSettings(store.getSiteSettings());
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 font-bold text-2xl tracking-tight text-white">
              <img src="/logo.jpg" alt="Style Loom Logo" className="h-10 w-10 rounded-lg object-cover shadow border border-slate-800" />
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-xl">Style Loom</span>
                <span className="text-xs text-rose-400 font-medium italic">“Style That Speaks, Quality That Lasts.”</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.about_content}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {settings.social_links?.facebook && (
                <a
                  href={settings.social_links.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-900 hover:bg-brand text-slate-300 hover:text-white rounded-full transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings.social_links?.instagram && (
                <a
                  href={settings.social_links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-900 hover:bg-brand text-slate-300 hover:text-white rounded-full transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-emerald-950 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-full transition-colors flex items-center gap-1 text-xs font-semibold px-3"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Shopping</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-brand transition-colors">Shop All Products</Link>
              </li>
              <li>
                <Link href="/category/t-shirts" className="hover:text-brand transition-colors">Printed T-Shirts</Link>
              </li>
              <li>
                <Link href="/category/kurtas" className="hover:text-brand transition-colors">Women Kurtas</Link>
              </li>
              <li>
                <Link href="/category/blouses" className="hover:text-brand transition-colors">Tailored Blouses</Link>
              </li>
              <li>
                <Link href="/customize" className="text-brand font-semibold hover:underline">Custom Design Request</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-brand transition-colors">About Style Loom</Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-brand transition-colors">Leave Feedback</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-brand transition-colors">View Cart & Checkout</Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-brand transition-colors">My Orders</Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-500 hover:text-slate-300 text-xs">Administrator Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Store Info</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <span className="text-slate-400 text-xs">{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall className="h-4 w-4 text-brand shrink-0" />
                <span className="text-slate-400 text-xs">{settings.business_phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand shrink-0" />
                <span className="text-slate-400 text-xs">{settings.business_email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.business_name}. All rights reserved. Prices in Sri Lankan Rupees (LKR).</p>
          <div className="flex space-x-4">
            <Link href="/about" className="hover:underline">Delivery & Shipping</Link>
            <Link href="/about" className="hover:underline">7-Day Return Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
