import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "@/lib/supabase/mock-data";
import { generateUUID } from "@/lib/utils";

const isValidUUID = (id?: string) => Boolean(id && id.length === 36 && id.includes("-"));

// Global Server-Side Shared Store for universal multi-device sync
let SERVER_PRODUCTS: any[] = [...INITIAL_PRODUCTS];
const SERVER_DELETED_IDS: Set<string> = new Set();

export async function GET() {
  try {
    const supabase = createAdminClient();
    if (!supabase) {
      const filteredMock = SERVER_PRODUCTS.filter((p) => !SERVER_DELETED_IDS.has(p.id));
      return NextResponse.json({ products: filteredMock, source: "mock" });
    }

    const { data: products, error } = await supabase
      .from("products")
      .select("*, product_images(*), product_variants(*)")
      .order("created_at", { ascending: false });

    if (error) {
      const filteredMock = SERVER_PRODUCTS.filter((p) => !SERVER_DELETED_IDS.has(p.id));
      return NextResponse.json({ products: filteredMock, source: "mock" });
    }

    if (!products || products.length === 0) {
      // Check if DB was NEVER seeded by checking categories table
      const { data: cats } = await supabase.from("categories").select("id").limit(1);
      if (!cats || cats.length === 0) {
        await seedSupabaseIfEmpty(supabase);
        const { data: reFetch } = await supabase
          .from("products")
          .select("*, product_images(*), product_variants(*)")
          .order("created_at", { ascending: false });

        const finalProds = (reFetch || [])
          .filter((p: any) => !SERVER_DELETED_IDS.has(p.id))
          .map(parseProductImagesColour);
        SERVER_PRODUCTS = finalProds;
        return NextResponse.json({ products: finalProds, source: "supabase" });
      }

      // If categories exist but products table is empty (e.g. products deleted by admin), return [] without re-seeding mock items!
      SERVER_PRODUCTS = [];
      return NextResponse.json({ products: [], source: "supabase" });
    }

    const formattedProducts = products
      .filter((p: any) => !SERVER_DELETED_IDS.has(p.id))
      .map(parseProductImagesColour);

    SERVER_PRODUCTS = formattedProducts;
    return NextResponse.json({ products: formattedProducts, source: "supabase" });
  } catch (err: any) {
    const filteredMock = SERVER_PRODUCTS.filter((p) => !SERVER_DELETED_IDS.has(p.id));
    return NextResponse.json({ products: filteredMock, error: err.message });
  }
}

function parseProductImagesColour(p: any) {
  return {
    ...p,
    product_images: (p.product_images || []).map((img: any) => {
      let col = img.colour || "";
      let alt = img.alt_text || "";
      if (!col && alt.startsWith("Colour: ")) {
        const parts = alt.split("|");
        col = parts[0].replace("Colour: ", "").trim();
        alt = parts.slice(1).join("|").trim();
      }
      return { ...img, colour: col, alt_text: alt || p.name };
    }),
    product_variants: p.product_variants || [],
  };
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const productData = await request.json();

    if (!productData || !productData.name) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    const productId = isValidUUID(productData.id) ? productData.id : generateUUID();
    const slug = productData.slug || productData.name.toLowerCase().replace(/\s+/g, "-");
    const code = productData.product_code || `PRD-${Date.now().toString().slice(-4)}`;

    const targetProduct = {
      ...productData,
      id: productId,
      slug,
      product_code: code,
      product_images: productData.product_images || [],
      product_variants: productData.product_variants || [],
    };

    // Update Server-Side Shared Memory Store immediately
    SERVER_DELETED_IDS.delete(productId);
    const existingIdx = SERVER_PRODUCTS.findIndex((p) => p.id === productId);
    if (existingIdx !== -1) {
      SERVER_PRODUCTS[existingIdx] = { ...SERVER_PRODUCTS[existingIdx], ...targetProduct };
    } else {
      SERVER_PRODUCTS.unshift(targetProduct);
    }

    if (!supabase) {
      return NextResponse.json({ success: true, productId, note: "Updated server store" });
    }

    // Ensure category_id is a valid UUID
    let categoryId = isValidUUID(productData.category_id) ? productData.category_id : null;
    if (!categoryId) {
      const { data: catList } = await supabase.from("categories").select("id").limit(1);
      categoryId = catList?.[0]?.id || "11111111-0000-0000-0000-000000000001";
    }

    // 1. Upsert Product Row
    const { error: prodErr } = await supabase.from("products").upsert({
      id: productId,
      category_id: categoryId,
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

    // 2. Upsert Images with encoded colour tag in alt_text
    if (productData.product_images && productData.product_images.length > 0) {
      const imagesToSave = productData.product_images.map((img: any, idx: number) => {
        const cleanAlt = (img.alt_text || productData.name).replace(/^Colour: [^|]+\|\s*/, "");
        const colourTag = img.colour ? `Colour: ${img.colour} | ` : "";
        return {
          id: isValidUUID(img.id) ? img.id : generateUUID(),
          product_id: productId,
          image_url: img.image_url,
          alt_text: `${colourTag}${cleanAlt}`,
          display_order: img.display_order || idx + 1,
          is_primary: img.is_primary || idx === 0,
        };
      });

      const { error: imgErr } = await supabase.from("product_images").upsert(imagesToSave);
      if (imgErr) console.warn("[SUPABASE_API] Warning upserting images:", imgErr);
    }

    // 3. Upsert Variants
    if (productData.product_variants && productData.product_variants.length > 0) {
      const variantsToSave = productData.product_variants.map((v: any, idx: number) => ({
        id: isValidUUID(v.id) ? v.id : generateUUID(),
        product_id: productId,
        sku: v.sku || `${code}-${(v.colour || "STD").substring(0, 3).toUpperCase()}-${v.size || "M"}-${idx}`,
        size: v.size || "M",
        colour: v.colour || "Standard",
        stock_quantity: v.stock_quantity ?? 10,
        price_adjustment: v.price_adjustment || 0,
        is_active: v.is_active ?? true,
      }));

      const { error: varErr } = await supabase.from("product_variants").upsert(variantsToSave);
      if (varErr) console.warn("[SUPABASE_API] Warning upserting variants:", varErr);
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

    // Instantly delete from Server Shared Store for all devices
    SERVER_DELETED_IDS.add(id);
    SERVER_PRODUCTS = SERVER_PRODUCTS.filter((p) => p.id !== id);

    const supabase = createAdminClient();
    if (supabase) {
      // Delete child rows first, then product row in Supabase
      await supabase.from("product_images").delete().eq("product_id", id);
      await supabase.from("product_variants").delete().eq("product_id", id);
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
