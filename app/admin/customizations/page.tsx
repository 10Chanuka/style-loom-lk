"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/supabase/store";
import { CustomizationRequest } from "@/lib/supabase/mock-data";
import { formatDate, formatLKR } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Scissors, MessageCircle, Eye, FileImage } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AdminCustomizationsPage() {
  const { showToast } = useToast();
  const [customizations, setCustomizations] = useState<CustomizationRequest[]>(store.getCustomizations());

  const loadData = () => {
    setCustomizations(store.getCustomizations());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (id: string, status: CustomizationRequest["status"]) => {
    store.updateCustomizationStatus(id, status);
    showToast(`Customization request status updated to "${status}"`, "success");
    loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Scissors className="h-6 w-6 text-brand" /> Custom Clothing Request Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review custom tailoring specs, design placement, reference images, and contact customers via WhatsApp.
        </p>
      </div>

      <div className="space-y-4">
        {customizations.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800">
            No customization requests received yet.
          </div>
        ) : (
          customizations.map((cust) => {
            const cleanPhone = cust.customer_phone.replace(/[^0-9]/g, "");
            return (
              <div key={cust.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <span className="font-extrabold text-base text-slate-900 dark:text-white mr-3">{cust.request_number}</span>
                    <Badge variant="default" className="mr-2">{cust.product_type}</Badge>
                    <span className="text-xs text-slate-400">{formatDate(cust.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">Status:</span>
                    <Select
                      value={cust.status}
                      onChange={(e) => handleStatusChange(cust.id, e.target.value as any)}
                      className="h-8 text-xs font-bold w-40"
                    >
                      <option value="whatsapp_pending">whatsapp_pending</option>
                      <option value="received">received</option>
                      <option value="discussing">discussing</option>
                      <option value="quoted">quoted</option>
                      <option value="confirmed">confirmed</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <p><span className="text-slate-500">Customer:</span> <strong className="text-slate-900 dark:text-white">{cust.customer_name}</strong></p>
                    <p><span className="text-slate-500">Phone:</span> {cust.customer_phone}</p>
                    <p><span className="text-slate-500">Email:</span> {cust.customer_email}</p>
                  </div>

                  <div className="space-y-1">
                    <p><span className="text-slate-500">Specs:</span> Qty {cust.quantity} • Size: {cust.selected_size || "Standard"} • Colour: {cust.preferred_colour || "Any"}</p>
                    <p><span className="text-slate-500">Fabric:</span> {cust.preferred_fabric || "Recommended"}</p>
                    <p><span className="text-slate-500">Estimated Budget:</span> {cust.estimated_budget ? formatLKR(cust.estimated_budget) : "Not set"}</p>
                  </div>

                  {cust.reference_image_url && (
                    <div className="flex items-center gap-2">
                      <img src={cust.reference_image_url} alt="Reference" className="h-16 w-16 object-cover rounded-lg border border-slate-200" />
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <FileImage className="h-4 w-4" /> Reference Image Attached
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 block mb-1">Design Details & Description:</span>
                  <p className="p-3 bg-slate-50 rounded-lg text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-mono text-[11px] leading-relaxed">
                    {cust.design_description}
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <a
                    href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(cust.customer_name)},%20regarding%20your%20customization%20request%20${cust.request_number}:`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs"
                  >
                    <MessageCircle className="h-4 w-4" /> Discuss Quote on WhatsApp
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
