import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const strapiBaseUrl =
    process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (strapiBaseUrl) {
      const normalizedBaseUrl = strapiBaseUrl.replace(/\/+$/, "");
      return NextResponse.redirect(new URL("/admin", normalizedBaseUrl));
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set(
        "callbackUrl",
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
      );
      return NextResponse.redirect(url);
    }

    const role = (token as { role?: unknown }).role;
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/error";
      url.searchParams.set("error", "AccessDenied");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
