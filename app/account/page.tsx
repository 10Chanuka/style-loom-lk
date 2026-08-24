"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/supabase/store";
import { Profile, Order, CustomizationRequest } from "@/lib/supabase/mock-data";
import { formatLKR, formatDate } from "@/lib/utils";
import { AuthModal } from "@/components/layout/AuthModal";
import { User, Package, Scissors, MessageSquare, LogOut, Clock, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AccountPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customizations, setCustomizations] = useState<CustomizationRequest[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = store.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setOrders(store.getOrders(user.id));
      setCustomizations(store.getCustomizations(user.id));
    } else {
      setAuthOpen(true);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        <p className="text-sm font-medium animate-pulse">Loading account info...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <User className="h-12 w-12 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Account Login Required</h2>
        <p className="text-sm text-slate-500">Please log in to view your order history and customization requests.</p>
        <Button onClick={() => setAuthOpen(true)}>Log In</Button>
        <AuthModal
          open={authOpen}
          onOpenChange={setAuthOpen}
          onSuccess={() => {
            const user = store.getCurrentUser();
            setCurrentUser(user);
            if (user) {
              setOrders(store.getOrders(user.id));
              setCustomizations(store.getCustomizations(user.id));
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-brand text-white font-extrabold text-2xl flex items-center justify-center">
            {currentUser.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{currentUser.full_name}</h1>
            <p className="text-xs text-slate-500">{currentUser.email} • Role: <span className="font-bold capitalize text-brand">{currentUser.role}</span></p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={() => { store.logout(); window.location.href = "/"; }}>
          <LogOut className="mr-2 h-4 w-4 text-rose-600" /> Log Out
        </Button>
      </div>

      {/* Orders & Customization History Tabs */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="h-5 w-5 text-brand" /> WhatsApp Orders ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800">
            No orders placed yet. Add items to your cart and proceed to WhatsApp order!
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white">{ord.order_number}</span>
                    <span className="text-slate-400 ml-3">{formatDate(ord.created_at)}</span>
                  </div>
                  <Badge variant={ord.status === "completed" ? "success" : "secondary"}>
                    Status: {ord.status}
                  </Badge>
                </div>

                <div className="text-xs space-y-1">
                  <p><span className="text-slate-500">Customer:</span> {ord.customer_name} ({ord.customer_phone})</p>
                  <p><span className="text-slate-500">Delivery Address:</span> {ord.delivery_address}</p>
                </div>

                <div className="flex justify-between items-center pt-2 text-xs font-bold border-t border-slate-100 dark:border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-brand text-sm">{formatLKR(ord.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customizations Section */}
      <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scissors className="h-5 w-5 text-brand" /> Custom Clothing Requests ({customizations.length})
        </h2>

        {customizations.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800">
            No customization requests submitted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {customizations.map((cust) => (
              <div key={cust.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white">{cust.request_number}</span>
                    <span className="text-slate-400 ml-3">{cust.product_type} (Qty: {cust.quantity})</span>
                  </div>
                  <Badge variant="secondary">Status: {cust.status}</Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{cust.design_description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
