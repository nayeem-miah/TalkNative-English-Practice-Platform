/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useGetAdminDashboardOverviewQuery } from "@/redux/api/enrollment-api"
import {
  ArrowRight,
  Book,
  CreditCard,
  Download,
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

  // Client-side simulation of active sessions
  const [activeSessions, setActiveSessions] = React.useState(18)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveSessions((prev) => {
        const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or +1
        const nextValue = prev + change
        if (nextValue < 12) return 12
        if (nextValue > 25) return 25
        return nextValue
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Helper to construct sparkline points path
  const getSparklinePoints = React.useCallback((data: number[]) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    return data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * 90 + 5;
      const y = 25 - ((val - min) / range) * 20;
      return `${x},${y}`;
    }).join(" ");
  }, []);

  // Build stats items dynamically
  const systemStats = React.useMemo(() => {
    const sessionsData = [14, 16, 12, 19, 15, 22, activeSessions];
    const coursesData = [18, 19, 20, 20, 22, 23, totalCourses];
    const enrollmentsData = [
      totalEnrollments - 30 > 0 ? totalEnrollments - 30 : 0,
      totalEnrollments - 22 > 0 ? totalEnrollments - 22 : 0,
      totalEnrollments - 18 > 0 ? totalEnrollments - 18 : 0,
      totalEnrollments - 10 > 0 ? totalEnrollments - 10 : 0,
      totalEnrollments - 5 > 0 ? totalEnrollments - 5 : 0,
      totalEnrollments - 2 > 0 ? totalEnrollments - 2 : 0,
      totalEnrollments
    ];
    const revenueData = [
      totalRevenue * 0.8,
      totalRevenue * 0.83,
      totalRevenue * 0.88,
      totalRevenue * 0.9,
      totalRevenue * 0.93,
      totalRevenue * 0.97,
      totalRevenue
    ];

    return [
      { 
        name: "Active Sessions", 
        value: activeSessions.toString(), 
        status: "Live", 
        icon: PhoneCall, 
        color: "text-emerald-600 dark:text-emerald-400", 
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
        points: getSparklinePoints(sessionsData)
      },
      { 
        name: "Total Courses", 
        value: totalCourses.toString(), 
        status: "Catalog", 
        icon: Book, 
        color: "text-blue-600 dark:text-blue-400", 
        bg: "bg-blue-50 dark:bg-blue-500/10",
        points: getSparklinePoints(coursesData)
      },
      { 
        name: "Total Enrollments", 
        value: totalEnrollments.toString(), 
        status: "Students", 
        icon: Users, 
        color: "text-purple-600 dark:text-purple-400", 
        bg: "bg-purple-50 dark:bg-purple-500/10",
        points: getSparklinePoints(enrollmentsData)
      },
      { 
        name: "Total Revenue", 
        value: `$${totalRevenue.toFixed(2)}`, 
        status: "Stripe", 
        icon: CreditCard, 
        color: "text-orange-600 dark:text-orange-400", 
        bg: "bg-orange-50 dark:bg-orange-500/10",
        points: getSparklinePoints(revenueData)
      },
    ];
  }, [totalCourses, totalEnrollments, totalRevenue, activeSessions, getSparklinePoints])

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
               <div className="flex items-end justify-between gap-4">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{stat.name}</p>
                     <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                  </div>
                  {/* Mini-Sparkline */}
                  <div className={cn("h-8 w-16 opacity-85 hover:opacity-100 transition-opacity", stat.color)}>
                    <svg className="w-full h-full" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={stat.points}
                      />
                    </svg>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>



      {/* Engagement & Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm rounded-2xl bg-card overflow-hidden">
           <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between bg-muted/10">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-foreground">Engagement Trends</CardTitle>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Weekly Active Users Distribution</p>
              </div>
              <Button variant="ghost" className="text-[9px] font-bold uppercase tracking-widest gap-2 bg-muted/50 hover:bg-muted h-9 px-5 rounded-lg border border-border transition-all">
                <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export Data
              </Button>
           </CardHeader>
           <CardContent className="p-4 sm:p-6 lg:p-10 h-[380px] flex items-end justify-between relative px-4 sm:px-12 gap-4">
              {(dashboardData.engagementTrends || [40, 70, 55, 90, 65, 85, 50]).map((h: number, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full bg-gradient-to-t from-primary/40 to-primary border border-primary/30 rounded-t-xl transition-all group-hover:from-primary/60 group-hover:to-primary/95 group-hover:shadow-lg group-hover:shadow-primary/20 relative cursor-pointer" style={{ height: `${h * 2.5}px` }}>
                       <div className="absolute -top-10 left-1/2 -translate-y-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 pointer-events-none whitespace-nowrap z-10 shadow-xl">
                          {h * 124} sessions
                       </div>
                    </div>
                   <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Day {i + 1}</span>
                </div>
              ))}
           </CardContent>
        </Card>

        <Card className="lg:col-span-4 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm rounded-2xl bg-card overflow-hidden">
           <CardHeader className="p-6 border-b border-border bg-muted/10">
              <CardTitle className="text-lg font-bold text-foreground">Language Distribution</CardTitle>
           </CardHeader>
           <CardContent className="p-8 space-y-10">
              <div className="relative h-56 w-56 mx-auto">
                 <div className="absolute inset-0 rounded-full border-[18px] border-muted/20" />
                 <div className="absolute inset-0 rounded-full border-[18px] border-primary border-t-transparent border-l-transparent rotate-[35deg] drop-shadow-sm transition-transform duration-1000" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-4xl font-bold text-foreground leading-none">{dashboardData.matchSuccessRate || "82%"}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2 max-w-[80px]">Match Success</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                 {(dashboardData.languageDistribution || [
                   { name: "Spanish", value: "43%", color: "bg-emerald-500" },
                   { name: "English", value: "40%", color: "bg-primary" },
                   { name: "Mandarin", value: "12%", color: "bg-zinc-400" },
                   { name: "Others", value: "5%", color: "bg-zinc-200 dark:bg-zinc-800" },
                 ]).map((lang: any) => (
                   <div key={lang.name} className="space-y-1 group cursor-default">
                      <div className="flex items-center gap-2">
                         <div className={`h-2.5 w-2.5 rounded-full ${lang.color || 'bg-primary'} transition-transform group-hover:scale-125 shadow-sm`} />
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{lang.name}</span>
                      </div>
                      <span className="text-base font-bold text-foreground block ml-4 leading-none tracking-tighter">{lang.value}</span>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>
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
                          {course.price > 0 
                            ? course.price > 1000000 
                              ? `$${course.price.toExponential(2)}` 
                              : `$${course.price.toFixed(2)}` 
                            : "Free"}
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
