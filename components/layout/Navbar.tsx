"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { store } from "@/lib/supabase/store";
import { Profile } from "@/lib/supabase/mock-data";
import { AuthModal } from "@/components/layout/AuthModal";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  Scissors,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    setMounted(true);
    const updateState = () => {
      const user = store.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        const cart = store.getCart(user.id);
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    };

    updateState();
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    store.logout();
    setCurrentUser(null);
    router.push("/");
  };

  const openAuth = (mode: "login" | "signup") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const isCurrent = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm dark:bg-slate-900/95 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 dark:text-white">
              <img src="/logo.jpg" alt="Style Loom Logo" className="h-10 w-10 rounded-lg object-cover shadow-sm border border-slate-200 dark:border-slate-800" />
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 dark:text-white leading-none text-lg">
                  Style <span className="text-brand">Loom</span>
                </span>
                <span className="text-[9px] text-slate-500 font-medium tracking-tight mt-0.5 hidden sm:inline">
                  Style That Speaks, Quality That Lasts
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm relative">
              <input
                type="text"
                placeholder="Search T-shirts, Kurtas, Blouses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-full border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand dark:bg-slate-800 dark:border-slate-700"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </form>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/"
                className={isCurrent("/") ? "text-brand font-semibold" : "text-slate-700 hover:text-brand dark:text-slate-200"}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={pathname.startsWith("/products") ? "text-brand font-semibold" : "text-slate-700 hover:text-brand dark:text-slate-200"}
              >
                Shop All
              </Link>
              <Link
                href="/customize"
                className={isCurrent("/customize") ? "text-brand font-semibold flex items-center gap-1" : "text-slate-700 hover:text-brand flex items-center gap-1 dark:text-slate-200"}
              >
                <Scissors className="h-4 w-4 text-brand" /> Customize
              </Link>
              <Link
                href="/about"
                className={isCurrent("/about") ? "text-brand font-semibold" : "text-slate-700 hover:text-brand dark:text-slate-200"}
              >
                About Us
              </Link>
              <Link
                href="/feedback"
                className={isCurrent("/feedback") ? "text-brand font-semibold" : "text-slate-700 hover:text-brand dark:text-slate-200"}
              >
                Feedback
              </Link>
            </nav>

            {/* Actions & Admin Login */}
            <div className="flex items-center space-x-3">
              
              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-slate-700 hover:text-brand dark:text-slate-200">
                <ShoppingBag className="h-6 w-6" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account / User Menu */}
              {mounted && currentUser ? (
                <div className="flex items-center gap-2">
                  <Link href="/account" className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full dark:bg-slate-800 dark:text-slate-200">
                    <User className="h-4 w-4 text-brand" />
                    <span className="max-w-[100px] truncate">{currentUser.full_name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-full"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => openAuth("login")} className="hidden sm:inline-flex">
                  Login
                </Button>
              )}

              {/* Administrator Login (Desktop Right Corner) */}
              <Link
                href="/admin/login"
                className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 border border-slate-200 px-2.5 py-1 rounded-md dark:border-slate-800 dark:text-slate-400"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" /> Admin
              </Link>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 dark:text-slate-200"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 dark:bg-slate-900 dark:border-slate-800">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </form>

            <nav className="flex flex-col space-y-2 pt-2 text-sm font-medium">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Shop All Products
              </Link>
              <Link
                href="/customize"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-brand font-semibold"
              >
                <Scissors className="h-4 w-4" /> Customize Products
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                About Us
              </Link>
              <Link
                href="/feedback"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Feedback
              </Link>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                {mounted && currentUser ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center gap-2 text-brand font-semibold"
                    >
                      <User className="h-4 w-4" /> My Account ({currentUser.full_name})
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 font-semibold"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => openAuth("login")}>
                      Login
                    </Button>
                    <Button className="flex-1" onClick={() => openAuth("signup")}>
                      Sign Up
                    </Button>
                  </div>
                )}

                {/* Administrator Login (Mobile Menu Location) */}
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs text-slate-500 font-medium border border-slate-200 rounded-lg dark:border-slate-800"
                >
                  <ShieldCheck className="h-4 w-4 text-slate-400" /> Administrator Login
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        initialMode={authModalMode}
      />
    </>
  );
}
