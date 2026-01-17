import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type Body = {
  email: string;
  full_name?: string;
};

export async function POST(req: Request) {
  const supabase = await createClient();

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  // Try find existing
  const existing = await supabase
    .from("customers")
    .select("id,email,full_name,created_at")
    .eq("email", email)
    .maybeSingle();

  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }

  if (existing.data) {
    return NextResponse.json({ customer: existing.data });
  }

  // Create new
  const created = await supabase
    .from("customers")
    .insert({ email, full_name: body.full_name ?? null })
    .select("id,email,full_name,created_at")
    .single();

  if (created.error) {
    return NextResponse.json({ error: created.error.message }, { status: 500 });
  }

  return NextResponse.json({ customer: created.data }, { status: 201 });
}
