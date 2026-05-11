"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  ShieldAlert, 
  BarChart3, 
  Users, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  Languages,
  LogOut,
  Bell
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Moderation", icon: ShieldAlert, href: "/admin/moderation" },
  { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Reports", icon: FileText, href: "/admin/reports" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <aside 
      className={cn(
        "h-screen sticky top-0 bg-zinc-950 text-zinc-400 transition-all duration-300 flex flex-col border-r border-border z-50",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
            <Languages className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg text-white tracking-tight">FluentFlow</span>
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
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                isActive 
                  ? "bg-zinc-900 text-white font-medium" 
                  : "hover:bg-zinc-900/50 hover:text-zinc-100"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-400")} />
              {!isCollapsed && <span className="text-sm whitespace-nowrap">{item.name}</span>}
              {isActive && isCollapsed && (
                <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-border/50 space-y-4 bg-zinc-950">
        {!isCollapsed && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-900/50 border border-border/50">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="leading-tight overflow-hidden">
              <p className="font-semibold text-sm text-zinc-100 truncate">Alex Rivera</p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Admin</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <ModeToggle />
            {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Appearance</span>}
          </div>

          <Button 
            variant="ghost" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full justify-start gap-3 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/50 h-10 px-3 rounded-lg"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!isCollapsed && <span className="text-xs font-semibold uppercase tracking-wider">Collapse Sidebar</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-zinc-500 hover:text-destructive hover:bg-destructive/10 h-10 px-3 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="text-xs font-semibold uppercase tracking-wider">Sign Out</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
