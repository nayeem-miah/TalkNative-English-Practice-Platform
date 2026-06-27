"use client"

import { ModeToggle } from "@/components/mode-toggle"
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
import { removeCookie } from "@/utils/cookie"
import {
  BarChart3,
  Book,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  ShieldAlert,
  Users
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Course", icon: Book, href: "/admin/course" },
  { name: "Enrollment", icon: Book, href: "/admin/enrollment" },
  { name: "Moderation", icon: ShieldAlert, href: "/admin/moderation" },
]

interface AdminSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ isOpenMobile, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const { data: userResponse } = useGetMeQuery(undefined)
  const [logout] = useLogoutMutation()

  const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap()
    } catch {}
    removeCookie("accessToken")
    removeCookie("refreshToken")
    try { localStorage.removeItem("accessToken") } catch {}
    try { localStorage.removeItem("refreshToken") } catch {}
    window.location.href = "/login"
  }

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 transition-all duration-300 flex flex-col border-r border-border z-50",
        // Desktop widths
        isCollapsed ? "lg:w-20" : "lg:w-64",
        // Mobile layout
        "fixed inset-y-0 left-0 w-64 lg:sticky lg:flex",
        isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-border/50">
        <Link href="/" onClick={() => onCloseMobile?.()} className="flex items-center gap-3 overflow-hidden">
          {!isCollapsed && (
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-primary via-emerald-600 to-teal-500 dark:from-primary dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
              TalkNative
            </span>
          )}
        </Link>
        <div className={cn(isCollapsed ? "mx-auto" : "")}>
          <ModeToggle />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onCloseMobile?.()}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                isActive
                  ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300")} />
              {!isCollapsed && <span className="text-sm whitespace-nowrap">{item.name}</span>}
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
          <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white dark:bg-zinc-900/50 border border-border/50 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 border border-border flex-shrink-0">
                <AvatarImage src={user?.profilePicture || user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} />
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="leading-tight overflow-hidden">
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">{user?.name || "Admin"}</p>
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  {user?.role || "ADMIN"}
                </p>
              </div>
            </div>

            {/* Three dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-lg cursor-pointer flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <MoreHorizontal className="h-4.5 w-4.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2 rounded-xl shadow-xl border border-border/50 bg-card" align="end" side="right" sideOffset={10}>
                <div className="p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-foreground">{user?.name || "Admin"}</p>
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
            <DropdownMenuTrigger className="h-10 w-10 p-0 rounded-lg mx-auto flex items-center justify-center cursor-pointer animate-in fade-in duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-850">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={user?.profilePicture || user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} />
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 rounded-xl shadow-xl border border-border/50 bg-card" align="start" side="right" sideOffset={15}>
              <div className="p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none text-foreground">{user?.name || "Admin"}</p>
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
            className="w-full justify-start gap-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 h-10 px-3 rounded-lg hidden lg:flex"
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
    </aside>
  )
}
