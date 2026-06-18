import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fungsi untuk mendecode JWT payload di Edge Runtime (tanpa library eksternal)
function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    // Ubah format Base64Url ke Base64 standar
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Decode base64 menjadi string JSON yang aman untuk karakter spesial (UTF-8)
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Gagal mendecode JWT di middleware:", e);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("jwt_token")?.value;
  const payload = token ? decodeJwtPayload(token) : null;

  const isAdminRoute =
    pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isUserRoute = pathname.startsWith("/dashboard");
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/admin/login";

  if (isAdminRoute) {
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (isUserRoute) {
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isAuthRoute && payload) {
    if (payload.role === "admin" && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (
      payload.role === "user" &&
      (pathname === "/login" || pathname === "/register")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|videos).*)"],
};
