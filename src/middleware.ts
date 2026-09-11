import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

function getRoleRedirect(role?: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "HR_MANAGER":
      return "/hr";
    case "MANAGER":
      return "/manager";
    case "STAFF":
    default:
      return "/staff";
  }
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = token.role as string;

    // 1. /admin route protection (Only ADMIN)
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL(getRoleRedirect(role), req.url));
    }

    // 2. /hr route protection (ADMIN, HR_MANAGER)
    if (pathname.startsWith("/hr") && !["ADMIN", "HR_MANAGER"].includes(role)) {
      return NextResponse.redirect(new URL(getRoleRedirect(role), req.url));
    }

    // 3. /manager route protection (ADMIN, HR_MANAGER, MANAGER)
    if (
      pathname.startsWith("/manager") &&
      !["ADMIN", "HR_MANAGER", "MANAGER"].includes(role)
    ) {
      return NextResponse.redirect(new URL(getRoleRedirect(role), req.url));
    }

    // 4. /staff is accessible to all authenticated users
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/hr/:path*",
    "/manager/:path*",
    "/staff/:path*",
  ],
};
