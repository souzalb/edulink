import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;
    
    // Proteção de rotas baseada no Role
    if (pathname.startsWith("/dashboard/docente") && token?.role !== "DOCENTE") {
      return NextResponse.rewrite(new URL("/login?unauthorized=true", req.url));
    }

    if (
      pathname.startsWith("/dashboard/pedagogico") &&
      !["OPP", "AQV_OE"].includes(token?.role as string)
    ) {
      return NextResponse.rewrite(new URL("/login?unauthorized=true", req.url));
    }
    
    if (pathname.startsWith("/management") && token?.role !== "AQV_OE" && token?.role !== "OPP") {
      return NextResponse.rewrite(new URL("/login?unauthorized=true", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/management/:path*",
    "/fiaa/:path*"
  ],
};
