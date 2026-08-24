"use client";

import React, { useState } from "react";
import { ProductReview } from "@/lib/supabase/mock-data";
import { store } from "@/lib/supabase/store";
import { useToast } from "@/components/ui/toast";
import { AuthModal } from "@/components/layout/AuthModal";
import { Star, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductReviewsProps {
  productId: string;
  initialReviews: ProductReview[];
}

export function ProductReviews({ productId, initialReviews }: ProductReviewsProps) {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = store.getCurrentUser();

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }
    if (!comment.trim()) {
      showToast("Please enter your review comment", "error");
      return;
    }

    setSubmitting(true);
    try {
      store.addReview({
        product_id: productId,
        user_id: currentUser.id,
        user_name: currentUser.full_name,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        status: "pending",
      });

      showToast(
        "Thank you! Your review has been submitted and is pending administrator approval.",
        "info"
      );
      setTitle("");
      setComment("");
    } catch (err: any) {
      showToast(err.message || "Failed to submit review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-8 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand" /> Customer Reviews ({reviews.length})
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(Number(avgRating))
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{avgRating} out of 5</span>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-sm dark:bg-slate-900 dark:border-slate-800">
            No approved reviews yet. Be the first customer to leave a review!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {rev.user_name || "Verified Customer"}
                </span>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {rev.title && <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{rev.title}</h4>}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Review Submission Form */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <h4 className="font-bold text-base text-slate-900 dark:text-white">Write a Review</h4>
        {!currentUser ? (
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
            <span className="text-xs text-slate-600 dark:text-slate-300">Please log in to share your product review.</span>
            <Button size="sm" onClick={() => setAuthOpen(true)}>Log In to Review</Button>
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setRating(s)}
                    className="p-1 text-amber-400 focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Review Headline (Optional)
              </label>
              <Input
                type="text"
                placeholder="e.g. Excellent fit and vibrant print quality!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Your Review Comment
              </label>
              <textarea
                rows={3}
                placeholder="Share your thoughts on size, comfort, fabric texture, and craftsmanship..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-3 text-xs bg-white focus:ring-2 focus:ring-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                required
              />
            </div>

            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review for Moderation"}
            </Button>
          </form>
        )}
      </div>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => showToast("Logged in! You may now submit your review.", "success")}
      />
    </div>
  );
}
