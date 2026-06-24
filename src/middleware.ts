import { NextResponse } from 'next/server'

export function middleware() {
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
