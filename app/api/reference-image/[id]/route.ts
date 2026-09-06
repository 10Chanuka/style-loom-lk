import { NextResponse } from "next/server";
import { store } from "@/lib/supabase/store";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reqId = params.id;
    if (!reqId) {
      return NextResponse.json({ error: "Missing request ID" }, { status: 400 });
    }

    const customReq = store.getCustomizationByRequestNumber(reqId);
    const imageUrl = customReq?.reference_image_url;

    if (!imageUrl) {
      // Return SVG placeholder if no image attached
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="#f1f5f9">
        <rect width="400" height="300" fill="#f8fafc"/>
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#64748b">No Reference Image Attached</text>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#94a3b8">Request #${reqId}</text>
      </svg>`;
      return new Response(svg, {
        headers: { "Content-Type": "image/svg+xml" },
      });
    }

    // If it's a direct URL (e.g. Supabase storage or external image), redirect to it
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return NextResponse.redirect(imageUrl);
    }

    // If it's a base64 Data URL (data:image/png;base64,...)
    if (imageUrl.startsWith("data:image/")) {
      const parts = imageUrl.split(",");
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
      const base64Data = parts[1];
      const buffer = Buffer.from(base64Data, "base64");

      return new Response(buffer, {
        headers: {
          "Content-Type": mimeType,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
