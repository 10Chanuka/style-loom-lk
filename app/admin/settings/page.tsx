"use client";

import React, { useState, useEffect, useRef } from "react";
import { store } from "@/lib/supabase/store";
import { SiteSettings } from "@/lib/supabase/mock-data";
import { useToast } from "@/components/ui/toast";
import { Settings, Save, Sparkles, Building, PhoneCall, Download, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(store.getSiteSettings());
  const [saving, setSaving] = useState(false);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSettings(store.getSiteSettings());
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      store.updateSiteSettings(settings);
      showToast("Site settings updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save site settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const backupData = {
      version: "3.0",
      timestamp: new Date().toISOString(),
      products: store.getProducts(),
      categories: store.getCategories(),
      settings: store.getSiteSettings(),
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `style_loom_catalogue_backup_${Date.now()}.json`;
    a.click();
    showToast("Downloaded catalogue backup file!", "success");
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        if (data.products && Array.isArray(data.products)) {
          data.products.forEach((p: any) => store.saveProduct(p));
          showToast(`Imported ${data.products.length} products & published to all devices!`, "success");
          window.location.reload();
        } else {
          showToast("Invalid JSON backup format", "error");
        }
      } catch (err) {
        showToast("Error reading backup JSON file", "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-brand" /> Site Settings & Business Details
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage business contact info, WhatsApp number, store address, policies, and multi-device catalogue sync.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-800">
        
        {/* Business Identity */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800 flex items-center gap-2">
            <Building className="h-4 w-4 text-brand" /> Store Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Business Name *</label>
              <Input
                type="text"
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="mt-1 text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Brand Primary Accent Colour</label>
              <div className="flex gap-2 items-center mt-1">
                <Input
                  type="color"
                  value={settings.primary_colour}
                  onChange={(e) => setSettings({ ...settings, primary_colour: e.target.value })}
                  className="h-10 w-16 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={settings.primary_colour}
                  onChange={(e) => setSettings({ ...settings, primary_colour: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact & WhatsApp */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800 flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-emerald-600" /> WhatsApp & Contact Numbers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Business WhatsApp Number *</label>
              <Input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="mt-1 text-xs"
                required
              />
              <span className="text-[10px] text-slate-400">Target wa.me number (e.g. 94714903231)</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Business Phone</label>
              <Input
                type="text"
                value={settings.business_phone}
                onChange={(e) => setSettings({ ...settings, business_phone: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Business Email *</label>
              <Input
                type="email"
                value={settings.business_email}
                onChange={(e) => setSettings({ ...settings, business_email: e.target.value })}
                className="mt-1 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Store Address (Sri Lanka)</label>
            <Input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="mt-1 text-xs"
            />
          </div>
        </div>

        {/* Content & Policies */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">
            About Content & Policies
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">About Us Story Content</label>
            <textarea
              rows={3}
              value={settings.about_content}
              onChange={(e) => setSettings({ ...settings, about_content: e.target.value })}
              className="w-full mt-1 rounded-md border border-slate-300 p-2.5 text-xs bg-white focus:ring-2 focus:ring-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Delivery Information</label>
            <textarea
              rows={2}
              value={settings.delivery_information}
              onChange={(e) => setSettings({ ...settings, delivery_information: e.target.value })}
              className="w-full mt-1 rounded-md border border-slate-300 p-2.5 text-xs bg-white focus:ring-2 focus:ring-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Return & Exchange Policy</label>
            <textarea
              rows={2}
              value={settings.return_policy}
              onChange={(e) => setSettings({ ...settings, return_policy: e.target.value })}
              className="w-full mt-1 rounded-md border border-slate-300 p-2.5 text-xs bg-white focus:ring-2 focus:ring-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full font-bold" disabled={saving}>
          {saving ? "Saving Settings..." : <span className="flex items-center gap-2"><Save className="h-4 w-4" /> Save Site Settings</span>}
        </Button>
      </form>

      {/* MULTI-DEVICE CATALOGUE BACKUP & SYNC */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-brand" /> Multi-Device Catalogue Sync & Backup
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Export all your products, photos, colours, and stock numbers to share or import on other devices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Button type="button" variant="outline" onClick={handleExportData} className="w-full font-bold text-xs flex items-center gap-2">
            <Download className="h-4 w-4 text-brand" /> Export Catalogue Backup (.JSON)
          </Button>

          <div>
            <input
              type="file"
              ref={jsonImportRef}
              onChange={handleImportData}
              accept=".json"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => jsonImportRef.current?.click()}
              className="w-full font-bold text-xs flex items-center gap-2 bg-slate-50 dark:bg-slate-800"
            >
              <Upload className="h-4 w-4 text-emerald-600" /> Import & Sync Catalogue (.JSON)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
