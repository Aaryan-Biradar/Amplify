import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id,sku,name,description,price_cents,currency,inventory_count,purchase_count,is_active,created_at")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.code === "PGRST116" ? 404 : 500 }
    );
  }

  return NextResponse.json({ product: data });
}
