"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col overflow-hidden shadow-sm animate-pulse">
      {/* Image Container Skeleton */}
      <div className="aspect-[3/4] w-full bg-slate-200 dark:bg-slate-800 relative">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <div className="absolute top-3 right-3">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Product Information Skeleton */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 space-y-2.5">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />

        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Buttons Skeleton */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="h-8 sm:h-9 w-full rounded-lg" />
          <Skeleton className="h-8 sm:h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
