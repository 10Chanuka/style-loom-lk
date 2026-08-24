"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { store } from "@/lib/supabase/store";
import { formatLKR } from "@/lib/utils";
import {
  Package,
  Layers,
  ShoppingBag,
  Scissors,
  Star,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FolderTree,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState(store.getProducts());
  const [categories, setCategories] = useState(store.getCategories());
  const [orders, setOrders] = useState(store.getOrders());
  const [customizations, setCustomizations] = useState(store.getCustomizations());
  const [reviews, setReviews] = useState(store.getAllReviews());
  const [feedback, setFeedback] = useState(store.getFeedback());

  useEffect(() => {
    setProducts(store.getProducts());
    setCategories(store.getCategories());
    setOrders(store.getOrders());
    setCustomizations(store.getCustomizations());
    setReviews(store.getAllReviews());
    setFeedback(store.getFeedback());
  }, []);

  const activeProducts = products.filter((p) => p.is_active);
  const lowStockCount = products.filter((p) => p.stock_status === "low_stock").length;
  const outOfStockCount = products.filter((p) => p.stock_status === "out_of_stock").length;
  const pendingOrders = orders.filter((o) => o.status === "whatsapp_pending" || o.status === "received");
  const pendingCustomizations = customizations.filter((c) => c.status === "whatsapp_pending" || c.status === "received");
  const pendingReviews = reviews.filter((r) => r.status === "pending");
  const unreadFeedback = feedback.filter((f) => f.status === "unread");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Store Dashboard Overview
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time metrics, catalogue activity, pending orders, and moderation queues.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{activeProducts.length}</div>
            <p className="text-[11px] text-slate-400 mt-1">Across {categories.length} main categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{pendingOrders.length}</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Requires WhatsApp response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Custom Requests
            </CardTitle>
            <Scissors className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{pendingCustomizations.length}</div>
            <p className="text-[11px] text-slate-400 mt-1">New tailored quote requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Low / Out Stock
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {lowStockCount + outOfStockCount}
            </div>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">
              {lowStockCount} low stock, {outOfStockCount} out of stock
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Reviews Moderation
            </CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {pendingReviews.length} reviews pending
            </div>
            <Button asChild size="sm" variant="outline" className="text-xs">
              <Link href="/admin/reviews">Review Queue <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Unread Feedback
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-brand" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {unreadFeedback.length} unread submissions
            </div>
            <Button asChild size="sm" variant="outline" className="text-xs">
              <Link href="/admin/feedback">Inbox <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Category Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-brand" /> Products by Category
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            return (
              <div key={cat.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">{cat.name}</span>
                  <span className="text-xs text-slate-500">{cat.slug}</span>
                </div>
                <Badge variant="default" className="text-xs">{count} Items</Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
