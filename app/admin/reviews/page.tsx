"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/supabase/store";
import { ProductReview } from "@/lib/supabase/mock-data";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ProductReview[]>(store.getAllReviews());

  const loadData = () => {
    setReviews(store.getAllReviews());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = (id: string) => {
    store.updateReviewStatus(id, "approved");
    showToast("Review approved and published publicly!", "success");
    loadData();
  };

  const handleReject = (id: string) => {
    store.updateReviewStatus(id, "rejected");
    showToast("Review rejected", "info");
    loadData();
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this review permanently?")) {
      store.deleteReview(id);
      showToast("Review deleted", "info");
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Star className="h-6 w-6 text-brand" /> Customer Reviews Moderation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Approve or reject customer submitted reviews. Only approved reviews are shown publicly.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800">
            No reviews submitted yet.
          </div>
        ) : (
          reviews.map((rev) => {
            const product = store.getProductById(rev.product_id);
            return (
              <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white">{rev.user_name || "Customer"}</span>
                    <span className="text-slate-400 ml-2">Product: <strong>{product?.name || rev.product_id}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={rev.status === "approved" ? "success" : rev.status === "pending" ? "warning" : "destructive"}>
                      {rev.status}
                    </Badge>
                    <span className="text-slate-400 text-[10px]">{formatDate(rev.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                  ))}
                </div>

                {rev.title && <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rev.title}</h4>}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {rev.status !== "approved" && (
                    <Button size="sm" onClick={() => handleApprove(rev.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                      <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
                    </Button>
                  )}
                  {rev.status !== "rejected" && (
                    <Button size="sm" variant="outline" onClick={() => handleReject(rev.id)} className="text-xs text-rose-600">
                      <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(rev.id)} className="text-xs text-slate-400 hover:text-rose-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
