"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Toast {
  id: string;
  type?: "success" | "error" | "info";
  title?: string;
  message: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (msg: string, type?: "success" | "error" | "info", title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  showToast: () => {},
  removeToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback(
    (message: string, type: "success" | "error" | "info" = "success", title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start space-x-3 rounded-lg p-4 shadow-lg border transition-all animate-in fade-in slide-in-from-bottom-5",
              toast.type === "success" && "bg-white border-emerald-200 text-slate-900 dark:bg-slate-900 dark:border-emerald-800",
              toast.type === "error" && "bg-white border-rose-200 text-slate-900 dark:bg-slate-900 dark:border-rose-800",
              toast.type === "info" && "bg-white border-blue-200 text-slate-900 dark:bg-slate-900 dark:border-blue-800"
            )}
          >
            {toast.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />}
            {toast.type === "error" && <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />}
            
            <div className="flex-1 text-sm">
              {toast.title && <h4 className="font-semibold text-slate-900 dark:text-white">{toast.title}</h4>}
              <p className="text-slate-600 dark:text-slate-300">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}
