import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "@/lib/supabase/mock-data";

export async function GET() {
  try {
    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ products: INITIAL_PRODUCTS, source: "mock" });
    }

    const { data: products, error } = await supabase
      .from("products")
      .select("*, product_images(*), product_variants(*)")
      .order("created_at", { ascending: false });

    if (error || !products || products.length === 0) {
      // If DB is unpopulated, seed initial categories and products into Supabase
      await seedSupabaseIfEmpty(supabase);
      
      const { data: reFetch } = await supabase
        .from("products")
        .select("*, product_images(*), product_variants(*)")
        .order("created_at", { ascending: false });

      return NextResponse.json({
        products: reFetch && reFetch.length > 0 ? reFetch : INITIAL_PRODUCTS,
        source: reFetch && reFetch.length > 0 ? "supabase" : "mock",
      });
    }

    return NextResponse.json({ products, source: "supabase" });
  } catch (err: any) {
    return NextResponse.json({ products: INITIAL_PRODUCTS, error: err.message });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const productData = await request.json();

    if (!productData || !productData.name) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ success: true, product: productData, note: "Local store fallback" });
    }

    const productId = productData.id || `p-${Date.now()}`;
    const slug = productData.slug || productData.name.toLowerCase().replace(/\s+/g, "-");
    const code = productData.product_code || `PRD-${Date.now().toString().slice(-4)}`;

    // 1. Upsert Product Row
    const { error: prodErr } = await supabase.from("products").upsert({
      id: productId,
      category_id: productData.category_id,
      name: productData.name,
      slug: slug,
      product_code: code,
      short_description: productData.short_description || "",
      full_description: productData.full_description || "",
      base_price: productData.base_price,
      sale_price: productData.sale_price || null,
      featured: productData.featured || false,
      is_active: productData.is_active ?? true,
      stock_status: productData.stock_status || "in_stock",
      care_instructions: productData.care_instructions || "",
      material: productData.material || "",
      updated_at: new Date().toISOString(),
    });

    if (prodErr) {
      console.error("[SUPABASE_API] Error upserting product:", prodErr);
      return NextResponse.json({ error: prodErr.message }, { status: 500 });
    }

    // 2. Upsert Images
    if (productData.product_images && productData.product_images.length > 0) {
      const imagesToSave = productData.product_images.map((img: any, idx: number) => ({
        id: img.id && img.id.length === 36 ? img.id : undefined,
        product_id: productId,
        image_url: img.image_url,
        alt_text: img.alt_text || productData.name,
        display_order: img.display_order || idx + 1,
        is_primary: img.is_primary || idx === 0,
      }));

      await supabase.from("product_images").upsert(imagesToSave);
    }

    // 3. Upsert Variants
    if (productData.product_variants && productData.product_variants.length > 0) {
      const variantsToSave = productData.product_variants.map((v: any, idx: number) => ({
        id: v.id && v.id.length === 36 ? v.id : undefined,
        product_id: productId,
        sku: v.sku || `${code}-${v.colour?.substring(0, 3).toUpperCase() || "STD"}-${v.size || "M"}-${idx}`,
        size: v.size || "M",
        colour: v.colour || "Standard",
        stock_quantity: v.stock_quantity ?? 10,
        price_adjustment: v.price_adjustment || 0,
        is_active: v.is_active ?? true,
      }));

      await supabase.from("product_variants").upsert(variantsToSave);
    }

    return NextResponse.json({ success: true, productId });
  } catch (err: any) {
    console.error("[SUPABASE_API] Exception in POST /api/products:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const supabase = createAdminClient();
    if (supabase) {
      await supabase.from("products").delete().eq("id", id);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function seedSupabaseIfEmpty(supabase: any) {
  try {
    // 1. Categories
    const { data: existingCats } = await supabase.from("categories").select("id");
    if (!existingCats || existingCats.length === 0) {
      await supabase.from("categories").insert(
        INITIAL_CATEGORIES.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description,
          image_url: c.image_url,
          display_order: c.display_order,
          is_active: c.is_active,
        }))
      );
    }

    // 2. Products
    const { data: existingProds } = await supabase.from("products").select("id");
    if (!existingProds || existingProds.length === 0) {
      for (const p of INITIAL_PRODUCTS) {
        await supabase.from("products").insert({
          id: p.id,
          category_id: p.category_id,
          name: p.name,
          slug: p.slug,
          product_code: p.product_code,
          short_description: p.short_description,
          full_description: p.full_description,
          base_price: p.base_price,
          sale_price: p.sale_price,
          featured: p.featured,
          is_active: p.is_active,
          stock_status: p.stock_status,
          care_instructions: p.care_instructions,
          material: p.material,
        });

        if (p.product_images && p.product_images.length > 0) {
          await supabase.from("product_images").insert(
            p.product_images.map((img) => ({
              product_id: p.id,
              image_url: img.image_url,
              alt_text: img.alt_text,
              display_order: img.display_order,
              is_primary: img.is_primary,
            }))
          );
        }

        if (p.product_variants && p.product_variants.length > 0) {
          await supabase.from("product_variants").insert(
            p.product_variants.map((v) => ({
              product_id: p.id,
              sku: v.sku,
              size: v.size,
              colour: v.colour,
              stock_quantity: v.stock_quantity,
              price_adjustment: v.price_adjustment,
              is_active: v.is_active,
            }))
          );
        }
      }
    }
  } catch (err) {
    console.warn("Seed error:", err);
  }
}
