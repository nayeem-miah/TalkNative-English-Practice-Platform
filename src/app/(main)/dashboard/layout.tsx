/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { NotificationBell } from "@/components/shared/notification-bell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useGetMeQuery, useLogoutMutation } from "@/redux/api/auth-api"
import { useGetUserTicketQuery } from "@/redux/api/chat-api"
import { removeCookie } from "@/utils/cookie"
import { BookOpen, ChevronLeft, ChevronRight, LayoutDashboard, LogOut, Megaphone, Menu, MessageSquare, MoreHorizontal, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Courses", icon: BookOpen, href: "/dashboard/my-courses" },
  { name: "Support Chat", icon: MessageSquare, href: "/dashboard/support" },
  { name: "Announcements", icon: Megaphone, href: "/dashboard/announcements" },
  { name: "Community", icon: Users, href: "/community" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const { data: userResponse, isLoading } = useGetMeQuery(undefined, { skip: !mounted })
  const [logout] = useLogoutMutation()

  const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data
  const isLoggedIn = !!user && (userResponse?.success !== false)

  const { data: ticketData } = useGetUserTicketQuery(undefined, {
    skip: !isLoggedIn || !mounted,
    pollingInterval: 15000,
  })
  const userTicket = ticketData?.data || (ticketData as any)?.result
  const unreadMessagesCount = userTicket?.unreadCount ?? 0

  const cleanName = React.useMemo(() => {
    const rawName = user?.name || ""
    if (!rawName) return "Student"
    if (rawName.includes("Portfolio") || rawName === "ymihqg" || /^[a-z0-9_]{4,15}$/.test(rawName)) {
      return "Nayeem Miah"
    }
    return rawName
  }, [user?.name])

  React.useEffect(() => {
    if (mounted && !isLoading && !isLoggedIn) {
      removeCookie("accessToken")
      removeCookie("refreshToken")
      window.location.href = "/login?redirect=/dashboard"
    }
  }, [mounted, isLoading, isLoggedIn])

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap()
    } catch {}
    removeCookie()
    window.location.href = "/login"
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-border/50">
        <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 overflow-hidden">
          {!isCollapsed && (
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-primary via-emerald-600 to-teal-500 dark:from-primary dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
              TalkNative
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative font-bold text-sm",
                isActive
                  ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  : "text-zinc-600 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300")} />
              {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
              {item.name === "Support Chat" && unreadMessagesCount > 0 && (
                <>
                  {!isCollapsed ? (
                    <span className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold px-1 shrink-0">
                      {unreadMessagesCount}
                    </span>
                  ) : (
                    <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-rose-500 shrink-0 border border-white dark:border-zinc-950 animate-pulse" />
                  )}
                </>
              )}
              {isActive && isCollapsed && (
                <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-border/50 space-y-4 bg-zinc-50 dark:bg-zinc-950 flex-shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white dark:bg-zinc-900/50 border border-border/50">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 border border-border flex-shrink-0">
                <AvatarImage src={user?.profilePicture || user?.image || ""} />
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {cleanName.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="leading-tight overflow-hidden">
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">{cleanName}</p>
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  {user?.role || "USER"}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg cursor-pointer flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <MoreHorizontal className="h-4.5 w-4.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2 rounded-xl shadow-xl border border-border/50 bg-card" align="end" side="right" sideOffset={10}>
                <div className="p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-foreground">{cleanName}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-muted/50" />
                <DropdownMenuItem className="rounded-lg cursor-pointer py-2.5 focus:bg-primary/5 focus:text-primary">
                  <Link href="/profile" className="flex items-center gap-2.5 w-full text-xs font-semibold">
                    <span className="h-4 w-4">👤</span> Profile Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 w-10 p-0 rounded-lg mx-auto flex items-center justify-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-850">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={user?.profilePicture || user?.image || ""} />
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {cleanName.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 rounded-xl shadow-xl border border-border/50 bg-card" align="start" side="right" sideOffset={15}>
              <div className="p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none text-foreground">{cleanName}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-muted/50" />
              <DropdownMenuItem className="rounded-lg cursor-pointer py-2 focus:bg-primary/5 focus:text-primary">
                <Link href="/profile" className="flex items-center gap-2.5 w-full text-xs font-semibold">
                  <span className="h-4 w-4">👤</span> Profile Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="flex flex-col gap-1">

          <Button
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full justify-start gap-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 h-10 px-3 rounded-lg hidden lg:flex cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!isCollapsed && <span className="text-xs font-semibold uppercase tracking-wider">Collapse Sidebar</span>}
          </Button>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10 h-10 px-3 rounded-lg cursor-pointer transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="text-xs font-semibold uppercase tracking-wider">Sign Out</span>}
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-[#f9fafb] dark:bg-zinc-950 font-sans antialiased relative">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "h-screen sticky top-0 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-all duration-300 flex flex-col border-r border-border z-50",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "fixed inset-y-0 left-0 w-64 lg:sticky lg:flex",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0 w-full bg-[#f9fafb] dark:bg-zinc-950">
        {/* Mobile Header */}
        <header className="h-16 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/50 flex items-center px-4 sm:px-6 lg:px-10 justify-between lg:justify-end w-full flex-shrink-0">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-muted text-zinc-550 dark:text-zinc-400 cursor-pointer lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-sm text-zinc-900 dark:text-white lg:hidden">TalkNative Dashboard</span>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ModeToggle />
          </div>
        </header>

        <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
