"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomizePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/products");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="p-4 bg-brand/10 text-brand rounded-full w-fit mx-auto">
        <ShoppingBag className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        Explore Our Clothing Collections
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-lg mx-auto">
        We have streamlined our store to focus exclusively on our premium ready-to-wear printed T-shirts, Long Kurtas, and Short Kurtas. Redirecting you to our shop...
      </p>
      <div className="pt-4">
        <Button asChild size="lg" className="bg-brand hover:bg-brand-700 font-bold">
          <Link href="/products">
            Browse All Products Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
