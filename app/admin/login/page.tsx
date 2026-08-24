"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { store } from "@/lib/supabase/store";
import { useToast } from "@/components/ui/toast";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please enter administrator email and password", "error");
      return;
    }

    setLoading(true);
    try {
      const res = store.login(email);
      if (res.profile.role !== "admin") {
        showToast("Access Denied: Your account does not have administrator privileges.", "error");
        store.logout();
        setLoading(false);
        return;
      }

      showToast("Welcome to Administrator Dashboard!", "success");
      router.push("/admin");
    } catch (err: any) {
      showToast(err.message || "Failed to authenticate administrator", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6 dark:bg-slate-900 dark:border-slate-800">
        
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-slate-900 text-brand flex items-center justify-center mx-auto dark:bg-slate-800">
            <ShieldCheck className="h-8 w-8 text-brand" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Administrator Access
          </h1>
          <p className="text-xs text-slate-500">
            Secure portal for store management, catalog control, and orders.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Admin Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="admin@elegancefashion.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Admin Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 text-xs"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11 text-sm font-bold" disabled={loading}>
            {loading ? "Authenticating..." : <span className="flex items-center justify-center gap-2">Login to Admin Portal <ArrowRight className="h-4 w-4" /></span>}
          </Button>
        </form>

        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Administrator accounts are assigned manually in Supabase. Public admin registration is disabled.
        </div>
      </div>
    </div>
  );
}
