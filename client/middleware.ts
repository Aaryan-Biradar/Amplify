import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // redirect / -> /landing
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  // supabase session refresh
  const { supabase, response } = createClient(request);
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/", "/landing", "/dashboard"],
};
