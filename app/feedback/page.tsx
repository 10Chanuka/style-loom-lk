"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/supabase/store";
import { useToast } from "@/components/ui/toast";
import { AuthModal } from "@/components/layout/AuthModal";
import { Profile, FeedbackItem } from "@/lib/supabase/mock-data";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Send, CheckCircle2, History, User, Mail, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FeedbackPage() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [previousFeedback, setPreviousFeedback] = useState<FeedbackItem[]>([]);

  const loadFeedback = () => {
    const user = store.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setPreviousFeedback(store.getFeedback(user.id));
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthOpen(true);
      return;
    }
    if (!subject.trim() || !message.trim()) {
      showToast("Please enter a subject and message", "error");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Store in Supabase / Local Store
      store.addFeedback({
        user_id: currentUser.id,
        name: currentUser.full_name,
        email: currentUser.email,
        subject: subject.trim(),
        message: message.trim(),
        status: "unread",
      });

      // 2. Dispatch to server API endpoint for email notification
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentUser.full_name,
          email: currentUser.email,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      showToast("Thank you for your valuable feedback! Our team has received your submission.", "success");
      setSubject("");
      setMessage("");
      loadFeedback();
    } catch (err: any) {
      showToast(err.message || "Failed to submit feedback", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-rose-100 text-brand px-3 py-1 rounded-full text-xs font-bold dark:bg-slate-800">
          <MessageSquare className="h-4 w-4" /> Customer Feedback
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          We Value Your Thoughts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Help us improve our clothing quality, website experience, or customer service.
        </p>
      </div>

      {!currentUser ? (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-4 dark:bg-slate-900 dark:border-slate-800">
          <ShieldAlert className="h-10 w-10 text-brand mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Please Log In to Submit Feedback
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We connect feedback submissions to verified customer accounts to prevent spam and follow up effectively.
          </p>
          <Button onClick={() => setAuthOpen(true)}>Log In to Submit Feedback</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Submission Form */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
              Submit Feedback Form
            </h3>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your Name</label>
                  <Input type="text" value={currentUser.full_name} disabled className="mt-1 text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your Email</label>
                  <Input type="email" value={currentUser.email} disabled className="mt-1 text-xs bg-slate-50" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subject *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Sizing suggestion or fabric feedback"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Your Message & Detailed Feedback *
                </label>
                <textarea
                  rows={5}
                  placeholder="Please share your experience with our clothing quality, delivery speed, or customer support..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full mt-1 rounded-md border border-slate-300 p-3 text-xs bg-white focus:ring-2 focus:ring-brand focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : <span className="flex items-center gap-2"><Send className="h-4 w-4" /> Send Feedback</span>}
              </Button>
            </form>
          </div>

          {/* Previous Feedback Sidebar */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <History className="h-4 w-4 text-brand" /> Your Submission History ({previousFeedback.length})
            </h3>

            {previousFeedback.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No previous feedback submitted yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {previousFeedback.map((fb) => (
                  <div key={fb.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 dark:bg-slate-800 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white block">{fb.subject}</span>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{fb.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">{formatDate(fb.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => {
          loadFeedback();
          showToast("Authenticated!", "success");
        }}
      />
    </div>
  );
}
