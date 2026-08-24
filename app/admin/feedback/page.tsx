"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/supabase/store";
import { FeedbackItem } from "@/lib/supabase/mock-data";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { MessageSquare, Mail, CheckCircle2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminFeedbackPage() {
  const { showToast } = useToast();
  const [feedback, setFeedback] = useState<FeedbackItem[]>(store.getFeedback());

  const loadData = () => {
    setFeedback(store.getFeedback());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkRead = (id: string) => {
    store.markFeedbackStatus(id, "read");
    showToast("Feedback marked as read", "info");
    loadData();
  };

  const handleArchive = (id: string) => {
    store.markFeedbackStatus(id, "archived");
    showToast("Feedback archived", "info");
    loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-brand" /> Customer Feedback Inbox
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Read customer suggestions, service feedback, and general store inquiries.
        </p>
      </div>

      <div className="space-y-4">
        {feedback.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800">
            No customer feedback received yet.
          </div>
        ) : (
          feedback.map((fb) => (
            <div key={fb.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{fb.name}</span>
                  <span className="text-slate-400 ml-2">({fb.email})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={fb.status === "unread" ? "destructive" : "secondary"}>
                    {fb.status}
                  </Badge>
                  <span className="text-slate-400 text-[10px]">{formatDate(fb.created_at)}</span>
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{fb.subject}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">{fb.message}</p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {fb.status === "unread" && (
                  <Button size="sm" variant="outline" onClick={() => handleMarkRead(fb.id)} className="text-xs">
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Mark Read
                  </Button>
                )}
                {fb.status !== "archived" && (
                  <Button size="sm" variant="ghost" onClick={() => handleArchive(fb.id)} className="text-xs text-slate-500">
                    <Archive className="mr-1 h-3.5 w-3.5" /> Archive
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
