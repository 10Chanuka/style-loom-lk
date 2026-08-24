"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { store } from "@/lib/supabase/store";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Scissors,
  Star,
  MessageSquare,
  FolderTree,
  Settings,
  ShieldAlert,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(store.getCurrentUser());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const user = store.getCurrentUser();
    setCurrentUser(user);
  }, [pathname]);

  // Bypass protection for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Access Denied if non-admin or unauthenticated
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <div className="h-14 w-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto dark:bg-slate-800">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Access Denied</h1>
          <p className="text-xs text-slate-500">
            You do not have administrator permissions to access this control portal.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Store</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/admin/login">Admin Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products Catalog", icon: Package },
    { href: "/admin/stock", label: "Variants & Stock", icon: Layers },
    { href: "/admin/orders", label: "WhatsApp Orders", icon: ShoppingBag },
    { href: "/admin/customizations", label: "Custom Requests", icon: Scissors },
    { href: "/admin/reviews", label: "Review Moderation", icon: Star },
    { href: "/admin/feedback", label: "Customer Feedback", icon: MessageSquare },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/settings", label: "Site Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <img src="/logo.jpg" alt="Style Loom Logo" className="h-9 w-9 rounded-lg object-cover shadow border border-slate-800" />
          <div>
            <h2 className="font-extrabold text-white text-base">Style Loom</h2>
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Admin Control</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-brand text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link href="/" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-3 py-2">
            <ArrowLeft className="h-4 w-4" /> View Public Website
          </Link>
          <button
            onClick={() => { store.logout(); router.push("/admin/login"); }}
            className="w-full flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" /> Log Out Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Admin Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white">
              Administrator Portal
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full dark:bg-emerald-950 dark:text-emerald-300">
              Admin Session Active
            </span>
            <span className="hidden sm:inline text-slate-500">{currentUser.email}</span>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/90 p-6 flex flex-col space-y-4 lg:hidden text-white overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="font-extrabold text-lg">Admin Navigation</span>
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold hover:bg-slate-800"
                >
                  <link.icon className="h-5 w-5 text-brand" />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link href="/" className="block text-xs text-slate-400">View Public Store</Link>
              <button onClick={() => { store.logout(); router.push("/admin/login"); }} className="text-xs font-bold text-rose-400">
                Log Out Admin
              </button>
            </div>
          </div>
        )}

        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>

    </div>
  );
}
