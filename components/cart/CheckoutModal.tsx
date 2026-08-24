"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { store } from "@/lib/supabase/store";
import { formatLKR, generateOrderNumber } from "@/lib/utils";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { CartItem } from "@/lib/supabase/mock-data";
import { MessageCircle, ShoppingBag, CheckCircle2, Copy, ExternalLink, AlertTriangle } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  subtotal: number;
}

export function CheckoutModal({
  open,
  onOpenChange,
  cartItems,
  subtotal,
}: CheckoutModalProps) {
  const { showToast } = useToast();
  const currentUser = store.getCurrentUser();

  const [customerName, setCustomerName] = useState(currentUser?.full_name || "");
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "+94771234567");
  const [deliveryAddress, setDeliveryAddress] = useState("No. 45, Galle Road, Colombo 03, Sri Lanka");
  const [customerNotes, setCustomerNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const [createdWhatsAppUrl, setCreatedWhatsAppUrl] = useState<string | null>(null);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
      showToast("Please fill in all required delivery details", "error");
      return;
    }
    if (cartItems.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    setLoading(true);
    try {
      const orderNum = generateOrderNumber();

      const itemsSnapshot = cartItems.map((item) => {
        const p = item.product!;
        const v = item.variant!;
        const unit = (p.sale_price ?? p.base_price) + (v.price_adjustment || 0);
        return {
          productName: p.name,
          productCode: p.product_code,
          size: v.size,
          colour: v.colour,
          quantity: item.quantity,
          unitPrice: unit,
          lineTotal: unit * item.quantity,
        };
      });

      const recalculatedSubtotal = itemsSnapshot.reduce((acc, i) => acc + i.lineTotal, 0);

      // Create order in store / database
      const order = store.createOrder({
        order_number: orderNum,
        user_id: currentUser?.id || "guest",
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        subtotal: recalculatedSubtotal,
        status: "whatsapp_pending",
        customer_notes: customerNotes || undefined,
        whatsapp_opened_at: new Date().toISOString(),
      });

      const waUrl = buildWhatsAppOrderUrl({
        orderNumber: orderNum,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        items: itemsSnapshot,
        subtotal: recalculatedSubtotal,
        customerNotes,
      });

      setCreatedWhatsAppUrl(waUrl);

      // Attempt to open WhatsApp window
      const opened = window.open(waUrl, "_blank");
      if (!opened) {
        showToast("Order saved! WhatsApp popup was blocked. Please click the button below to open WhatsApp.", "info");
      } else {
        showToast("Order created! Opening WhatsApp conversation...", "success");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to create order", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyWhatsAppUrl = () => {
    if (createdWhatsAppUrl) {
      navigator.clipboard.writeText(createdWhatsAppUrl);
      showToast("WhatsApp order link copied to clipboard!", "success");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) setCreatedWhatsAppUrl(null);
        onOpenChange(val);
      }}
      title={createdWhatsAppUrl ? "Order Placed Successfully!" : "WhatsApp Order Checkout"}
      description={
        createdWhatsAppUrl
          ? "Your order has been recorded in our system. Complete your order by sending the generated message on WhatsApp."
          : "Provide your delivery details to complete your order via WhatsApp."
      }
    >
      {createdWhatsAppUrl ? (
        <div className="space-y-4 text-center py-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Ready to Send to WhatsApp
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our team at +94 71 490 3231 will confirm stock availability and delivery options immediately upon receiving your WhatsApp message.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <a
              href={createdWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-3 rounded-lg shadow-md transition-colors"
            >
              <MessageCircle className="h-5 w-5" /> Open WhatsApp Now
            </a>
            <Button variant="outline" onClick={copyWhatsAppUrl} className="flex items-center gap-1.5 text-xs">
              <Copy className="h-4 w-4" /> Copy Link
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleOrderSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name *
              </label>
              <Input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone Number (WhatsApp) *
              </label>
              <Input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mt-1 text-xs"
                placeholder="+94 71 490 3231"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address *
            </label>
            <Input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="mt-1 text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Delivery Address (Sri Lanka) *
            </label>
            <textarea
              rows={2}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full mt-1 rounded-md border border-slate-300 p-2 text-xs bg-white focus:ring-2 focus:ring-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              placeholder="House No, Street Name, City, Postal Code"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Customer Notes (Optional)
            </label>
            <Input
              type="text"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="e.g. Leave package with security guard"
              className="mt-1 text-xs"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center text-xs font-bold dark:bg-slate-800 dark:border-slate-700">
            <span className="text-slate-700 dark:text-slate-300">Order Subtotal ({cartItems.length} items):</span>
            <span className="text-brand text-base font-extrabold">{formatLKR(subtotal)}</span>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11"
            disabled={loading}
          >
            {loading ? (
              "Processing Order..."
            ) : (
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" /> Proceed to WhatsApp Order
              </span>
            )}
          </Button>
        </form>
      )}
    </Dialog>
  );
}
