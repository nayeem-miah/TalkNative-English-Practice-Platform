import { NextRequest, NextResponse } from "next/server"

/** Routes that logged-in users should be redirected away from */
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-user"]

/** Routes that require authentication */
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/history", "/live-call", "/feedback", "/payment"]

/** Admin-only routes */
const ADMIN_ROUTES = ["/admin"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Read the access token (non-httpOnly cookie set by backend)
  const token =
    request.cookies.get("accessToken_js")?.value ||
    request.cookies.get("accessToken")?.value

  const isAuthenticated = !!token

  // Redirect authenticated users away from auth pages
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users to login from protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect unauthenticated users to login from admin routes
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))
  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
