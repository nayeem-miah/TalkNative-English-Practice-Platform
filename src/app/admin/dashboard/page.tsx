/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useGetAdminDashboardOverviewQuery } from "@/redux/api/enrollment-api"
import {
  ArrowRight,
  BarChart3,
  Book,
  CreditCard,
  FileText,
  PhoneCall,
  ShieldAlert,
  Users
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

export default function AdminDashboardPage() {
  // Query dashboard statistics and overview lists from the backend single endpoint
  const { data: overviewResponse, isLoading } = useGetAdminDashboardOverviewQuery()

  const dashboardData = overviewResponse?.data || {}
  const stats = dashboardData.stats || {}
  const recentEnrollments = dashboardData.recentEnrollments || []
  const activeCourses = dashboardData.activeCourses || []

  const totalCourses = stats.totalCourses ?? 0
  const totalEnrollments = stats.totalEnrollments ?? 0
  const totalRevenue = stats.totalRevenue ?? 0

  // Build stats items dynamically
  const systemStats = React.useMemo(() => [
    { name: "Active Sessions", value: "1,284", status: "Live", icon: PhoneCall, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { name: "Total Courses", value: totalCourses.toString(), status: "Catalog", icon: Book, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { name: "Total Enrollments", value: totalEnrollments.toString(), status: "Students", icon: Users, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" },
    { name: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, status: "Stripe", icon: CreditCard, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10" },
  ], [totalCourses, totalEnrollments, totalRevenue])

  const modules = React.useMemo(() => [
    { name: "Users", icon: Users, href: "/admin/users", status: "Live", isLive: true, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
    { name: "Courses", icon: Book, href: "/admin/course", status: "Live", isLive: true, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" },
    { name: "Enrollments", icon: CreditCard, href: "/admin/enrollment", status: "Live", isLive: true, color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10" },
    { name: "AI Moderation", icon: ShieldAlert, href: "/admin/moderation", status: "Preview", isLive: false, color: "text-rose-500 bg-rose-50 dark:bg-rose-500/10" },
    { name: "Analytics", icon: BarChart3, href: "/admin/analytics", status: "Preview", isLive: false, color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10" },
    { name: "Resources", icon: FileText, href: "/admin/resources", status: "Preview", isLive: false, color: "text-zinc-500 bg-zinc-100 dark:bg-zinc-800" },
  ], [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        <p className="text-zinc-550 dark:text-zinc-400 font-medium text-sm">Preparing admin control center...</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            System Control Center
          </h1>
          <p className="text-sm text-muted-foreground font-medium">TalkNative administration control panel & system status overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Operational</span>
          </div>
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
                  {stat.status && (
                    <div className="text-zinc-600 dark:text-zinc-400 font-bold text-[9px] uppercase tracking-wider bg-muted/60 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                      {stat.status}
                    </div>
                  )}
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access Modules Grid */}
      <div className="space-y-4">
        <div className="border-b border-border/50 pb-2">
          <h2 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Quick Navigation</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {modules.map((m) => (
            <Link href={m.href} key={m.name} className="block">
              <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-card hover:bg-muted/10 hover:border-primary/30 transition-all flex flex-col items-center justify-center p-4 text-center gap-2 h-28 group rounded-xl shadow-none cursor-pointer">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.color} group-hover:scale-105 transition-transform shadow-sm`}>
                  <m.icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5 w-full">
                  <p className="font-extrabold text-[11px] text-foreground group-hover:text-primary transition-colors truncate">
                    {m.name}
                  </p>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border",
                    m.isLive
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100/40"
                      : "bg-muted text-muted-foreground border-transparent"
                  )}>
                    {m.status}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Dynamic Data Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column: Recent Enrollments */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm rounded-2xl bg-card overflow-hidden">
          <CardHeader className="p-5 border-b border-border bg-muted/10 flex flex-row items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
                <CreditCard className="h-4.5 w-4.5 text-primary" /> Recent Enrollments
              </h3>
              <p className="text-xs text-muted-foreground font-semibold">Latest course purchases and student registries</p>
            </div>
            <Link href="/admin/enrollment">
              <Button variant="ghost" size="sm" className="rounded-lg text-xs font-black uppercase tracking-wider text-primary hover:bg-transparent cursor-pointer">
                View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentEnrollments.length === 0 ? (
              <div className="p-8 text-center text-xs font-semibold text-muted-foreground">
                No enrollments registered yet.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentEnrollments.map((item: any) => {
                  const isPaid = item.paymentStatus === "PAID"
                  const isFree = item.paymentStatus === "FREE"
                  return (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border shadow-sm flex-shrink-0">
                          <AvatarImage src={item.user?.profilePicture || ""} className="object-cover" />
                          <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                            {item.user?.name ? item.user.name[0]?.toUpperCase() : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="leading-tight">
                          <p className="font-extrabold text-sm text-foreground">{item.user?.name || "Unknown User"}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight truncate max-w-[200px]" title={item.course?.title}>
                            {item.course?.title || "Unknown Course"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant="outline" className={cn(
                          "text-[8px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider",
                          isPaid ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100" :
                          isFree ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100" :
                          "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100"
                        )}>
                          {item.paymentStatus}
                        </Badge>
                        <p className="text-xs font-extrabold text-foreground">
                          {item.amountPaid !== undefined && item.amountPaid !== null ? `$${item.amountPaid.toFixed(2)}` : isFree ? "$0.00" : "N/A"}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Course Catalog Status */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm rounded-2xl bg-card overflow-hidden">
          <CardHeader className="p-5 border-b border-border bg-muted/10 flex flex-row items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
                <Book className="h-4.5 w-4.5 text-primary" /> Active Courses
              </h3>
              <p className="text-xs text-muted-foreground font-semibold">Live speaking course offerings and price catalog</p>
            </div>
            <Link href="/admin/course">
              <Button variant="ghost" size="sm" className="rounded-lg text-xs font-black uppercase tracking-wider text-primary hover:bg-transparent cursor-pointer">
                Manage Courses <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {activeCourses.length === 0 ? (
              <div className="p-8 text-center text-xs font-semibold text-muted-foreground">
                No courses created yet.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {activeCourses.map((course: any) => {
                  const levelColors: Record<string, string> = {
                    BEGINNER: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100",
                    INTERMEDIATE: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100",
                    ADVANCED: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-100",
                  }
                  const levelColor = levelColors[course.level?.toUpperCase()] || "bg-muted text-muted-foreground border-transparent"
                  return (
                    <div key={course.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-16 rounded-lg bg-muted border overflow-hidden flex-shrink-0">
                          <Image
                            fill
                            src={course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"}
                            alt={course.title}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="leading-tight">
                          <p className="font-extrabold text-sm text-foreground line-clamp-1">{course.title}</p>
                          <span className="text-[10px] text-muted-foreground font-semibold">{course._count?.lessons || 0} Lessons</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant="outline" className={cn("text-[8px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider", levelColor)}>
                          {course.level}
                        </Badge>
                        <p className="text-xs font-black text-foreground">
                          {course.price > 0 ? `$${course.price}` : "Free"}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
