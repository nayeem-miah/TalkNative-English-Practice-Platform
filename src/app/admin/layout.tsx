/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { removeCookie } from "@/utils/cookie"
import { Menu } from "lucide-react"
import * as React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const { data: userResponse, isLoading } = useGetMeQuery(undefined, { skip: !mounted })

  const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data
  const isLoggedIn = !!user && (userResponse?.success !== false)
  const isAdmin = isLoggedIn && user?.role?.toUpperCase() === "ADMIN"

  React.useEffect(() => {
    if (mounted && !isLoading) {
      if (!isLoggedIn) {
        removeCookie("accessToken")
        removeCookie("refreshToken")
        window.location.href = "/login?redirect=/admin/dashboard"
      } else if (!isAdmin) {
        window.location.href = "/dashboard"
      }
    }
  }, [mounted, isLoading, isLoggedIn, isAdmin])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f9fafb] dark:bg-zinc-950 font-sans antialiased relative">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <AdminSidebar isOpenMobile={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />

      <main className="flex-1 flex flex-col min-h-screen min-w-0 w-full">
        {/* Mobile Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex items-center px-4 sm:px-6 lg:hidden justify-between w-full flex-shrink-0">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-muted text-zinc-500 dark:text-zinc-400 cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-black text-base tracking-tight bg-gradient-to-r from-primary via-emerald-600 to-teal-500 dark:from-primary dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">TalkNative Admin</span>
          <div className="w-10" />
        </header>

        <div className="flex-1 max-w-[1600px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
