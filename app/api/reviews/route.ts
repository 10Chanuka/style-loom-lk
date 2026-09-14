import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateUUID } from "@/lib/utils";

// Server-Side Shared Reviews Store for universal multi-device sync
let SERVER_REVIEWS: any[] = [];
const SERVER_DELETED_REVIEW_IDS: Set<string> = new Set();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id");

    const supabase = createAdminClient();
    if (!supabase) {
      let filtered = SERVER_REVIEWS.filter((r) => !SERVER_DELETED_REVIEW_IDS.has(r.id));
      if (productId) filtered = filtered.filter((r) => r.product_id === productId);
      return NextResponse.json({ reviews: filtered, source: "mock" });
    }

    let query = supabase.from("product_reviews").select("*").order("created_at", { ascending: false });
    if (productId) query = query.eq("product_id", productId);

    const { data: reviews, error } = await query;

    if (error || !reviews) {
      let filtered = SERVER_REVIEWS.filter((r) => !SERVER_DELETED_REVIEW_IDS.has(r.id));
      if (productId) filtered = filtered.filter((r) => r.product_id === productId);
      return NextResponse.json({ reviews: filtered, source: "mock" });
    }

    const filtered = reviews.filter((r: any) => !SERVER_DELETED_REVIEW_IDS.has(r.id));
    SERVER_REVIEWS = filtered;
    return NextResponse.json({ reviews: filtered, source: "supabase" });
  } catch (err: any) {
    let filtered = SERVER_REVIEWS.filter((r) => !SERVER_DELETED_REVIEW_IDS.has(r.id));
    return NextResponse.json({ reviews: filtered, error: err.message });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.product_id || !body.comment) {
      return NextResponse.json({ error: "Missing required review fields" }, { status: 400 });
    }

    const reviewId = body.id || generateUUID();
    const newReview = {
      id: reviewId,
      product_id: body.product_id,
      user_id: body.user_id || "guest-user",
      user_name: body.user_name || "Verified Customer",
      rating: body.rating || 5,
      title: body.title || "",
      comment: body.comment,
      status: body.status || "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    SERVER_DELETED_REVIEW_IDS.delete(reviewId);
    const existingIdx = SERVER_REVIEWS.findIndex((r) => r.id === reviewId);
    if (existingIdx !== -1) {
      SERVER_REVIEWS[existingIdx] = newReview;
    } else {
      SERVER_REVIEWS.unshift(newReview);
    }

    const supabase = createAdminClient();
    if (supabase) {
      await supabase.from("product_reviews").upsert({
        id: reviewId,
        product_id: body.product_id,
        user_id: body.user_id || "admin-user-id-001",
        rating: body.rating || 5,
        title: body.title || "",
        comment: body.comment,
        status: body.status || "approved",
        updated_at: new Date().toISOString(),
      }).catch((err: any) => console.warn("[REVIEWS_API] Supabase upsert warn:", err));
    }

    return NextResponse.json({ success: true, review: newReview });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Missing review id or status" }, { status: 400 });
    }

    const idx = SERVER_REVIEWS.findIndex((r) => r.id === id);
    if (idx !== -1) {
      SERVER_REVIEWS[idx].status = status;
    }

    const supabase = createAdminClient();
    if (supabase) {
      await supabase.from("product_reviews").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    }

    return NextResponse.json({ success: true, id, status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing review id" }, { status: 400 });
    }

    // Instantly remove from server shared store
    SERVER_DELETED_REVIEW_IDS.add(id);
    SERVER_REVIEWS = SERVER_REVIEWS.filter((r) => r.id !== id);

    const supabase = createAdminClient();
    if (supabase) {
      await supabase.from("product_reviews").delete().eq("id", id);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
