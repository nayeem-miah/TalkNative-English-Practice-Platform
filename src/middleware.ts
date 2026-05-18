import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication here
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/live-call',
  '/history',
  '/feedback'
]

// Add paths that are only for unauthenticated users here
const authPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-user'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value

  // Check if it's a protected path
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  // Check if it's an auth path
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath && !accessToken) {
    // Redirect unauthenticated users to login page
    const loginUrl = new URL('/login', request.url)
    // Optional: add a redirect parameter so they return to their original destination after logging in
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPath && accessToken) {
    // Redirect authenticated users trying to access login/register to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware to all routes except api, _next/static, _next/image, favicon.ico
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
