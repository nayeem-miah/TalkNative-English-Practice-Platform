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
  // Route protection and redirection are handled entirely on the client-side
  // (using RTK Query + localStorage backup in cookies.ts / base-api.ts).
  // This ensures 100% robust support for Incognito/Private browsing and browsers 
  // that block cross-origin/third-party cookies by default.
  return NextResponse.next()
}

export const config = {
  // Apply middleware to all routes except api, _next/static, _next/image, favicon.ico
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
