import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const redirectUrl = req.nextUrl.clone(); 
      redirectUrl.pathname = "/"; 
      return NextResponse.redirect(redirectUrl); 
    }

    return res; 
  } catch (error) {
    console.error("Error en middleware:", error);
    return NextResponse.error(); 
  }
}

export const config = {
    matcher: ["/dashboard/:path*"], 
  };