"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { store } from "@/lib/supabase/store";
import { formatLKR } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { CheckoutModal } from "@/components/cart/CheckoutModal";
import { AuthModal } from "@/components/layout/AuthModal";
import { Profile, CartItem } from "@/lib/supabase/mock-data";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const loadCart = () => {
    const user = store.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setCartItems(store.getCart(user.id));
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadCart();
  }, []);

  const handleUpdateQuantity = (id: string, qty: number) => {
    store.updateCartQuantity(id, qty);
    loadCart();
  };

  const handleRemoveItem = (id: string) => {
    store.removeFromCart(id);
    showToast("Item removed from cart", "info");
    loadCart();
  };

  const handleClearCart = () => {
    if (currentUser) {
      if (confirm("Are you sure you want to clear your entire cart?")) {
        store.clearCart(currentUser.id);
        showToast("Cart cleared", "info");
        loadCart();
      }
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const p = item.product;
    const v = item.variant;
    if (!p || !v) return acc;
    const unitPrice = (p.sale_price ?? p.base_price) + (v.price_adjustment || 0);
    return acc + unitPrice * item.quantity;
  }, 0);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <p className="text-sm font-medium animate-pulse">Loading shopping cart...</p>
      </div>
    );
  }

  const handleCheckoutClick = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (cartItems.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }
    setCheckoutModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-brand" /> Shopping Cart
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your items and proceed to WhatsApp order confirmation.
          </p>
        </div>

        {cartItems.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearCart} className="text-rose-600 hover:bg-rose-50 text-xs">
            <Trash2 className="h-4 w-4 mr-1" /> Clear Cart
          </Button>
        )}
      </div>

      {!currentUser ? (
        <div className="py-16 text-center space-y-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <ShoppingBag className="h-12 w-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Please Log In to View Your Cart
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your cart is saved securely to your customer account across browsers.
            </p>
          </div>
          <Button onClick={() => setAuthModalOpen(true)}>Log In to Continue</Button>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <ShoppingBag className="h-12 w-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Cart is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse our T-Shirts, Kurtas, and Blouses and add items to your cart.
            </p>
          </div>
          <Button asChild>
            <Link href="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Item Rows */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const p = item.product;
              const v = item.variant;
              if (!p || !v) return null;
              const unitPrice = (p.sale_price ?? p.base_price) + (v.price_adjustment || 0);
              const lineTotal = unitPrice * item.quantity;
              const imgUrl = p.product_images?.[0]?.image_url || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80";

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm gap-4 dark:bg-slate-900 dark:border-slate-800"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={imgUrl}
                      alt={p.name}
                      className="h-20 w-16 object-cover rounded-lg bg-slate-100 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-brand uppercase">{p.product_code}</span>
                      <Link href={`/products/${p.slug}`} className="font-bold text-sm text-slate-900 dark:text-white hover:text-brand block line-clamp-1">
                        {p.name}
                      </Link>
                      <div className="text-xs text-slate-500 space-x-2">
                        <span>Size: <strong>{v.size}</strong></span>
                        <span>•</span>
                        <span>Colour: <strong>{v.colour}</strong></span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                        {formatLKR(unitPrice)} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-slate-600 hover:text-slate-900"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-slate-600 hover:text-slate-900"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {formatLKR(lineTotal)}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-full"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatLKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Standard Delivery (Sri Lanka)</span>
                <span className="font-bold text-emerald-600">Calculated on WhatsApp</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Estimated Total</span>
                <span className="text-xl font-black text-brand">{formatLKR(subtotal)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckoutClick}
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-sm shadow-md"
            >
              <MessageCircle className="mr-2 h-5 w-5" /> Order via WhatsApp
            </Button>

            <div className="text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Fast verification with store team
              </p>
              <p>Prices revalidated on server before creating order.</p>
            </div>
          </div>

        </div>
      )}

      {/* Modals */}
      <CheckoutModal
        open={checkoutModalOpen}
        onOpenChange={(val) => {
          setCheckoutModalOpen(val);
          loadCart();
        }}
        cartItems={cartItems}
        subtotal={subtotal}
      />

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onSuccess={() => {
          loadCart();
          showToast("Authenticated!", "success");
        }}
      />
    </div>
  );
}
