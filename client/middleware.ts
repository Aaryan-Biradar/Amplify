import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // supabase session refresh
  const { supabase, response } = createClient(request);
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/landing", "/dashboard", "/test-client"],
};

