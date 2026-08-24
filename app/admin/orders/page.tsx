"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/supabase/store";
import { Order } from "@/lib/supabase/mock-data";
import { formatLKR, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { ShoppingBag, MessageCircle, Search, Filter } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>(store.getOrders());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const loadData = () => {
    setOrders(store.getOrders());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    store.updateOrderStatus(orderId, newStatus);
    showToast(`Order status updated to "${newStatus}"`, "success");
    loadData();
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchNum = o.order_number.toLowerCase().includes(q);
      const matchEmail = o.customer_email.toLowerCase().includes(q);
      const matchPhone = o.customer_phone.toLowerCase().includes(q);
      const matchName = o.customer_name.toLowerCase().includes(q);
      if (!matchNum && !matchEmail && !matchPhone && !matchName) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-brand" /> WhatsApp Order Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review customer orders, update workflow statuses, and open WhatsApp conversations directly.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search by order #, customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
        </div>

        <div className="w-full sm:w-56">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs"
          >
            <option value="">All Statuses</option>
            <option value="whatsapp_pending">WhatsApp Pending</option>
            <option value="received">Received</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800">
            No orders found matching your search parameters.
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const cleanPhone = ord.customer_phone.replace(/[^0-9]/g, "");
            return (
              <div key={ord.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <span className="font-extrabold text-base text-slate-900 dark:text-white mr-3">{ord.order_number}</span>
                    <span className="text-xs text-slate-400">{formatDate(ord.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">Status:</span>
                    <Select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                      className="h-8 text-xs font-bold w-40"
                    >
                      <option value="whatsapp_pending">whatsapp_pending</option>
                      <option value="received">received</option>
                      <option value="confirmed">confirmed</option>
                      <option value="preparing">preparing</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p><span className="text-slate-500">Customer Name:</span> <strong className="text-slate-900 dark:text-white">{ord.customer_name}</strong></p>
                    <p><span className="text-slate-500">Phone:</span> {ord.customer_phone}</p>
                    <p><span className="text-slate-500">Email:</span> {ord.customer_email}</p>
                  </div>
                  <div className="space-y-1">
                    <p><span className="text-slate-500">Delivery Address:</span> {ord.delivery_address}</p>
                    <p><span className="text-slate-500">Notes:</span> {ord.customer_notes || "None"}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500">Subtotal Amount: </span>
                    <strong className="text-brand text-sm">{formatLKR(ord.subtotal)}</strong>
                  </div>

                  <a
                    href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(ord.customer_name)},%20regarding%20your%20order%20${ord.order_number}%20at%20Elegance%20Fashion:`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    <MessageCircle className="h-4 w-4" /> Chat Customer on WhatsApp
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
