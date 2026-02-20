import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const { pathname } = request.nextUrl;

  if ((pathname.startsWith("/admin") || pathname.startsWith("/auth")) && strapiBaseUrl) {
    const normalizedBaseUrl = strapiBaseUrl.replace(/\/+$/, "");
    return NextResponse.redirect(new URL("/admin", normalizedBaseUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
