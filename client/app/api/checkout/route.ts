import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type CheckoutItem = {
  product_id: string;
  quantity: number;
};

type CheckoutBody = {
  customer_email: string;
  customer_name?: string;
  items: CheckoutItem[];
  shipping_address?: Record<string, unknown>;
};

export async function POST(req: Request) {
  const supabase = await createClient();

  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = (body.customer_email || "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "customer_email is required" }, { status: 400 });
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "items is required" }, { status: 400 });
  }

  // Basic sanitize items
  const items = body.items
    .map((it) => ({ product_id: String(it.product_id), quantity: Number(it.quantity) }))
    .filter((it) => it.product_id && Number.isFinite(it.quantity) && it.quantity > 0);

  if (items.length === 0) {
    return NextResponse.json({ error: "No valid items" }, { status: 400 });
  }

  // 1) Upsert customer by email
  const existing = await supabase
    .from("customers")
    .select("id,email")
    .eq("email", email)
    .maybeSingle();

  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }

  let customerId = existing.data?.id as string | undefined;

  if (!customerId) {
    const created = await supabase
      .from("customers")
      .insert({ email, full_name: body.customer_name ?? null })
      .select("id")
      .single();

    if (created.error) {
      return NextResponse.json({ error: created.error.message }, { status: 500 });
    }
    customerId = created.data.id;
  }

  // 2) Fetch products to lock in unit price and validate inventory
  const productIds = Array.from(new Set(items.map((i) => i.product_id)));
  const productsRes = await supabase
    .from("products")
    .select("id,price_cents,inventory_count,is_active")
    .in("id", productIds);

  if (productsRes.error) {
    return NextResponse.json({ error: productsRes.error.message }, { status: 500 });
  }

  const products = productsRes.data ?? [];
  const byId = new Map(products.map((p) => [p.id, p]));

  for (const it of items) {
    const p = byId.get(it.product_id);
    if (!p) return NextResponse.json({ error: `Unknown product_id: ${it.product_id}` }, { status: 400 });
    if (!p.is_active) return NextResponse.json({ error: `Product inactive: ${it.product_id}` }, { status: 400 });
    if (p.inventory_count < it.quantity) {
      return NextResponse.json(
        { error: `Not enough inventory for ${it.product_id}`, available: p.inventory_count },
        { status: 400 }
      );
    }
  }

  // 3) Create order
  const orderRes = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      status: "pending",
      shipping_address: body.shipping_address ?? null,
    })
    .select("id,status,subtotal_cents,shipping_cost_cents,total_cents,created_at")
    .single();

  if (orderRes.error) {
    return NextResponse.json({ error: orderRes.error.message }, { status: 500 });
  }

  const orderId = orderRes.data.id as string;

  // 4) Insert order items with unit_price locked in
  const orderItemsPayload = items.map((it) => {
    const p = byId.get(it.product_id)!;
    return {
      order_id: orderId,
      product_id: it.product_id,
      quantity: it.quantity,
      unit_price_cents: p.price_cents,
    };
  });

  const itemsRes = await supabase.from("order_items").insert(orderItemsPayload);

  if (itemsRes.error) {
    // cleanup order if items insert fails
    await supabase.from("orders").delete().eq("id", orderId);
    return NextResponse.json({ error: itemsRes.error.message }, { status: 500 });
  }

  // 5) Mark paid so your DB trigger updates purchase_count + inventory
  const paidRes = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId)
    .select("id,status,subtotal_cents,shipping_cost_cents,total_cents,created_at")
    .single();

  if (paidRes.error) {
    return NextResponse.json({ error: paidRes.error.message }, { status: 500 });
  }

  return NextResponse.json({ order: paidRes.data }, { status: 201 });
}
