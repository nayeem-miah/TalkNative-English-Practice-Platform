"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Book,
  CreditCard,
  FileText,
  PhoneCall,
  Server,
  ShieldAlert,
  Sparkles,
  Users
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const systemStats = [
  { name: "Active Sessions", value: "1,284", status: "Live", icon: PhoneCall, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { name: "Daily Signups", value: "452", change: "+12.5%", icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { name: "Total Accounts", value: "10", target: "Monitored", icon: Users, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10" },
  { name: "Server Load", value: "34%", status: "Optimal", icon: Server, color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800" },
]

const modules = [
  {
    name: "User Directory",
    description: "Manage roles, verify account statuses, promote or suspend user accounts dynamically.",
    icon: Users,
    href: "/admin/users",
    status: "Completed",
    isDynamic: true,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100/30"
  },
  {
    name: "Course Manager",
    description: "Create, update, and delete speaking courses, manage lesson syllabi, and set pricing models.",
    icon: Book,
    href: "/admin/course",
    status: "Completed",
    isDynamic: true,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100/30"
  },
  {
    name: "Enrollment Registry",
    description: "Audit student course enrollments, track Stripe payment checkouts, and copy transaction IDs.",
    icon: CreditCard,
    href: "/admin/enrollment",
    status: "Completed",
    isDynamic: true,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10 border-purple-100/30"
  },
  {
    name: "AI Moderation",
    description: "Monitor safety logs, review flag events, and oversee chat/interaction guidelines.",
    icon: ShieldAlert,
    href: "/admin/moderation",
    status: "Static Preview",
    isDynamic: false,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-100/30"
  },
  {
    name: "Usage Analytics",
    description: "Visualize platform performance indicators, active session counts, and signup metrics.",
    icon: BarChart3,
    href: "/admin/analytics",
    status: "Static Preview",
    isDynamic: false,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-100/30"
  },
  {
    name: "Resource Manager",
    description: "Manage speaking guides, recommended articles, and platform training materials.",
    icon: FileText,
    href: "/admin/resources",
    status: "Static Preview",
    isDynamic: false,
    color: "text-zinc-600 dark:text-zinc-400",
    bg: "bg-zinc-100 dark:bg-zinc-800 border-zinc-200/30"
  }
]

export default function AdminDashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Sparkles className="w-5.5 h-5.5 text-primary fill-primary/10" /> System Control Center
          </h1>
          <p className="text-sm text-muted-foreground font-medium">TalkNative administration control panel & system status overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Operational</span>
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-border bg-background hover:bg-muted transition-colors">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => (
          <Card key={stat.name} className="border-border bg-card shadow-none rounded-xl transition-all hover:border-primary/20">
            <CardContent className="p-6 space-y-5">
               <div className="flex items-center justify-between">
                  <div className={`h-11 w-11 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5.5 w-5.5" />
                  </div>
                  {stat.change && (
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" /> {stat.change}
                    </div>
                  )}
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{stat.name}</p>
                  <p className="text-3xl font-bold text-foreground tracking-tighter">{stat.value}</p>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Modules Dashboard Section */}
      <div className="space-y-5">
        <div className="border-b border-border/60 pb-3">
          <h2 className="text-base font-bold text-foreground tracking-tight">System Control Modules</h2>
          <p className="text-xs text-muted-foreground font-semibold">Implemented features and static previews in the admin panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <Card key={m.name} className="border-border bg-card/40 hover:bg-card hover:border-primary/30 shadow-none rounded-2xl transition-all duration-300 group flex flex-col justify-between overflow-hidden">
              <CardHeader className="p-6 pb-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`h-11 w-11 rounded-xl ${m.bg} flex items-center justify-center ${m.color} border shadow-sm`}>
                    <m.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm border",
                    m.isDynamic
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100/40 dark:border-emerald-500/20"
                      : "bg-muted text-muted-foreground border-transparent"
                  )}>
                    {m.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-foreground text-base tracking-tight leading-snug group-hover:text-primary transition-colors">
                    {m.name}
                  </h3>
                  <p className="text-xs text-muted-foreground/85 font-medium leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-4 border-t border-border/30 mt-auto bg-muted/10 group-hover:bg-muted/20 transition-colors">
                <Link href={m.href} className="w-full">
                  <Button variant="ghost" className="w-full justify-between h-9 px-3 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-transparent p-0 hover:text-primary text-muted-foreground group-hover:translate-x-0.5 transition-transform">
                    Enter Module <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
