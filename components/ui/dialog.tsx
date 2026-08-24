"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
}: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
          className
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        {title && (
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 pr-6">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-4">
            {description}
          </p>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
