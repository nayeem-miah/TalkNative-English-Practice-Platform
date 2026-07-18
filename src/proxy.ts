import { NextRequest, NextResponse } from "next/server"


const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-user"]


const PROTECTED_ROUTES = ["/dashboard", "/profile", "/history", "/live-call", "/feedback", "/payment"]


const ADMIN_ROUTES = ["/admin"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl


  const token =
    request.cookies.get("accessToken_js")?.value ||
    request.cookies.get("accessToken")?.value

  const isAuthenticated = !!token


  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }


  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

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
