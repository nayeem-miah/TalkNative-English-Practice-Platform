"use client"

import * as React from "react"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

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
          <ModeToggle />
        </header>

        <div className="flex-1 max-w-[1600px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
