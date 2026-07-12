"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./navbar"
import { Footer } from "./footer"

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-user"]

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAuth = AUTH_ROUTES.some((route) => pathname?.startsWith(route))
  const isAdmin = pathname?.startsWith("/admin")
  const isDashboard = pathname?.startsWith("/dashboard")
  const isLiveCall = pathname?.startsWith("/live-call")

  const hideNavbar = isAuth || isAdmin || isDashboard
  const hideFooter = isAuth || isAdmin || isDashboard || isLiveCall

  return (
    <div className="relative flex min-h-screen flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  )
}
