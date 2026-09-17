import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Middleware (Edge):
 * - /api/*: propagasi X-Request-ID untuk tracing (lihat with-error.ts).
 * - /dashboard/*: gerbang cepat — cookie sesi harus bertanda tangan valid,
 *   selain itu redirect /login. Validitas penuh (revokasi, is_active,
 *   must_change_password) dicek di server via requireSession() di layout.
 * - /login: yang sudah login dialihkan ke /dashboard.
 * - /ganti-password: wajib cookie valid, selain itu ke /login.
 * Tanpa AUTH_SECRET → fail-closed (dianggap belum login).
 */

const SESSION_COOKIE = "smkbbm_sesi";

async function cookieValid(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret || secret.length < 32) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
    const headers = new Headers(request.headers);
    headers.set("x-request-id", requestId);
    const res = NextResponse.next({ request: { headers } });
    res.headers.set("X-Request-ID", requestId);
    return res;
  }

  if (pathname.startsWith("/dashboard")) {
    if (!(await cookieValid(request))) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/login") {
    if (await cookieValid(request)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === "/ganti-password") {
    if (!(await cookieValid(request))) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/login", "/ganti-password"],
};
