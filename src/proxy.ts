import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip auth for login page and API auth routes
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "minha-chave-secreta-para-nextauth-dev" });

  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  // Role-based protection
  const role = token.role as string;
  
  if (pathname.startsWith("/dashboard/docente") && role !== "DOCENTE") {
     return NextResponse.redirect(new URL("/login?unauthorized=true", req.url));
  }

  if (pathname.startsWith("/dashboard/pedagogico") && !["OPP", "AQV_OE"].includes(role)) {
     return NextResponse.redirect(new URL("/login?unauthorized=true", req.url));
  }

  if (pathname.startsWith("/management") && !["AQV_OE", "OPP"].includes(role)) {
     return NextResponse.redirect(new URL("/login?unauthorized=true", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/management/:path*",
    "/fiaa/:path*"
  ],
};
