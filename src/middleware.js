// // middleware.js

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Always allow NextAuth APIs & static assets FIRST
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("MIDDLEWARE TOKEN:", token);

  // ✅ PUBLIC ROUTES
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/employee/login"
  ) {
    // redirect logged-in users away from admin login ONLY
    if (pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
    return NextResponse.next();
  }

  // ❌ NOT AUTHENTICATED
  if (!token) {
    if (pathname.startsWith("/employee")) {
      return NextResponse.redirect(new URL("/employee/login", req.url));
    }
    return NextResponse.redirect(
      new URL("/login?message=login-required", req.url),
    );
  }

  // 👑 ADMIN trying to access employee area
  if (token.isAdmin && pathname.startsWith("/employee")) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // 👤 EMPLOYEE trying to access admin area
  if (!token.isAdmin && !pathname.startsWith("/employee")) {
    return NextResponse.redirect(new URL("/employee/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Admin routes (UNCHANGED)
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

    // ➕ Employee routes
    "/employee/:path*",
  ],
};

// admin login working code ==================================================

// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// export async function middleware(req) {
//   const { pathname } = req.nextUrl;

//   // ✅ Always allow NextAuth APIs & static assets FIRST
//   if (
//     pathname.startsWith("/api/auth") ||
//     pathname.startsWith("/_next") ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next();
//   }

//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   console.log("MIDDLEWARE TOKEN:", token);

//   // ✅ Redirect logged-in users away from login
//   if (pathname === "/login" && token) {
//     return NextResponse.redirect(new URL("/home", req.url));
//   }

//   // ✅ Public routes
//   if (pathname === "/login" || pathname === "/register") {
//     return NextResponse.next();
//   }

//   // ❌ Not authenticated
//   if (!token) {
//     return NextResponse.redirect(
//       new URL("/login?message=login-required", req.url),
//     );
//   }

//   // ❌ Not admin
//   if (!token.isAdmin) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/home",
//     "/all-users/:path*",
//     "/deleted-users/:path*",
//     "/credit-debit-amount/:path*",
//     "/all-transactions/:path*",
//     "/staff-roles/:path*",
//     "/manage-staff/:path*",
//     "/subscription-packages/:path*",
//     "/site-config/:path*",
//     "/about-us/:path*",
//     "/terms-conditions/:path*",
//     "/social-media/:path*",
//     "/privacy-policy/:path*",
//     "/manage-faqs/:path*",
//     "/partners-list/:path*",
//     "/storage-providers/:path*",
//     "/plan-features/:path*",
//     "/login-logs/:path*",
//     "/wait-listusers/:path*",
//     "/subscription-requests/:path*",
//     "/withdrawal-requests/:path*",
//     "/subscription-plans/:path*",
//   ],
// };
