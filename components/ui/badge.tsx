import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-brand text-white hover:bg-brand-700",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
    destructive: "border-transparent bg-rose-500 text-white hover:bg-rose-600",
    outline: "text-slate-950 border border-slate-300",
    success: "border-transparent bg-emerald-100 text-emerald-800 font-medium",
    warning: "border-transparent bg-amber-100 text-amber-800 font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
