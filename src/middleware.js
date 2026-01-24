// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("middle ware request : ", req);
  console.log("TOKEN IN MIDDLEWARE:", token);

  const { pathname } = req.nextUrl;

  // ✅ Always allow next-auth API routes and static files
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") // static files: .png, .jpg, .css, etc.
  ) {
    return NextResponse.next();
  }

  // ✅ Public routes
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return NextResponse.next();
  }

  // ❌ No session → redirect to login
  if (!token || !token.email || !token.isAdmin) {
    return NextResponse.redirect(
      new URL("/login?message=login-required", req.url)
    );
  }

  // ❌ Not admin → redirect
  if (!token.isAdmin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Admin authenticated → allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login", // 🔴 REQUIRED
    "/home",
    "/all-users/:path*",
    "/deleted-users/:path*",
    "/credit-debit-amount/:path*",
    "/all-transactions/:path*",
    "/staff-roles/:path*",
    "/manage-staff/:path*",
    "/subscription-packages/:path*",
    "/site-config/:path*",
    "/about-us/:path*",
    "/terms-conditions/:path*",
    "/social-media/:path*",
    "/privacy-policy/:path*",
    "/manage-faqs/:path*",
    "/partners-list/:path*",
    "/storage-providers/:path*",
    "/plan-features/:path*",
    "/login-logs/:path*",
    "/wait-listusers/:path*",
    "/subscription-requests/:path*",
    "/withdrawal-requests/:path*",
    "/subscription-plans/:path*",
    "/subscriptions-report/:path*",
    "/manual-subscription-requests/:path*",
    "/home-sliders",
    "/marketing-banners",
    "/contact-messages",
    "/ad-management",
    "/subscriptions-report",
    "/login-logs"
  ],
};
