/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { useGetCallHistoryQuery } from "@/redux/api/call-api"
import { useGetMyCoursesQuery } from "@/redux/api/enrollment-api"
import type { Call, CourseWithProgress, RecentPartner } from "@/types"
import { removeCookie } from "@/utils/cookie"
import { ArrowRight, Badge as BadgeIcon, Video } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { ActiveCourses } from "./components/active-courses"
import { DashboardStats } from "./components/dashboard-stats"
import { LearningSidebar } from "./components/learning-sidebar"
import { RecentInteractions } from "./components/recent-interactions"
import { Badge } from "@/components/ui/badge"

export default function UserDashboardPage() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const { data: userResponse, isLoading: isUserLoading } = useGetMeQuery(undefined, { skip: !mounted })
  const { data: callHistoryResponse, isLoading: isHistoryLoading } = useGetCallHistoryQuery(undefined, { skip: !mounted })
  const { data: myCoursesResponse, isLoading: isCoursesLoading } = useGetMyCoursesQuery(undefined, { skip: !mounted })

  const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data
  const calls: Call[] = callHistoryResponse?.data || []
  const myCourses = React.useMemo(() => myCoursesResponse?.data || [], [myCoursesResponse?.data])
  const isLoggedIn = !!user && (userResponse?.success !== false)

  React.useEffect(() => {
    if (mounted && !isUserLoading) {
      if (!isLoggedIn) {
        removeCookie("accessToken")
        removeCookie("refreshToken")
        window.location.href = "/login?redirect=/dashboard"
      } else if (user?.role?.toUpperCase() === "ADMIN") {
        window.location.href = "/admin/dashboard"
      }
    }
  }, [mounted, isUserLoading, isLoggedIn, user])

  const greeting = React.useMemo(() => {
    if (typeof window === "undefined") return "Welcome back"
    const hours = new Date().getHours()
    if (hours < 12) return "Good morning"
    if (hours < 17) return "Good afternoon"
    return "Good evening"
  }, [])

  const courseProgressList: CourseWithProgress[] = React.useMemo(() => {
    if (!mounted || !myCourses) return []
    return myCourses.map((course: CourseWithProgress) => {
      let completedCount = 0
      try {
        const saved = localStorage.getItem(`talknative_completed_${course.id}`)
        if (saved) {
          const ids = JSON.parse(saved)
          if (Array.isArray(ids)) completedCount = ids.length
        }
      } catch (e) {
        console.error(e)
      }
      const totalLessons = course._count?.lessons || 0
      const percent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0
      return { ...course, completedCount, totalLessons, percent }
    })
  }, [mounted, myCourses])

  const totalCompletedLessons = React.useMemo(
    () => courseProgressList.reduce((acc, course) => acc + course.completedCount, 0),
    [courseProgressList]
  )

  if (!mounted || isUserLoading || isHistoryLoading || isCoursesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        <p className="text-zinc-550 dark:text-zinc-400 font-medium text-sm">Preparing your dashboard...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        <p className="text-zinc-550 dark:text-zinc-400 font-medium text-sm">Redirecting to login...</p>
      </div>
    )
  }

  // Calculate call statistics
  const totalSessions = calls.length
  const totalSeconds = calls.reduce((acc, call) => {
    if (call.duration) return acc + call.duration
    if (call.startTime && call.endTime) {
      return acc + Math.floor((new Date(call.endTime).getTime() - new Date(call.startTime).getTime()) / 1000)
    }
    return acc
  }, 0)
  const totalMinutes = Math.floor(totalSeconds / 60)

  // Build recent partners from call history
  const recentPartners: RecentPartner[] = calls.slice(0, 3).map((call) => {
    const isCaller = call.callerId === user?.id
    const partner = isCaller ? call.callee : call.caller

    let durationStr = "0s"
    if (call.startTime && call.endTime) {
      const totalSec = Math.floor((new Date(call.endTime).getTime() - new Date(call.startTime).getTime()) / 1000)
      durationStr = totalSec >= 60 ? `${Math.floor(totalSec / 60)}m` : `${totalSec}s`
    }

    return {
      id: call.id,
      name: partner?.name || "Speaking Partner",
      language: isCaller
        ? `${user?.learningLanguage || "English"} (Practice)`
        : `${user?.nativeLanguage || "Bengali"} (Native)`,
      duration: durationStr,
      rating: 5,
      time: new Date(call.startTime!).toLocaleDateString(undefined, {
        month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
      }),
      image: partner?.profilePicture || "",
    }
  })

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            {greeting}, {user?.name || "Learner"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">
            Keep tracking your language progress and learning goals.
          </p>
        </div>
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg font-semibold text-xs flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active learning mode
        </Badge>
      </div>

      {/* Stats Row */}
      <DashboardStats
        totalSessions={totalSessions}
        totalMinutes={totalMinutes}
        totalSeconds={totalSeconds}
        enrolledCoursesCount={myCourses.length}
        totalCompletedLessons={totalCompletedLessons}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Main Workspace */}
        <div className="lg:col-span-8 space-y-8">
          {/* CTA Card */}
          <Card className="border border-primary/20 dark:border-primary/10 shadow-sm rounded-xl bg-primary/5 dark:bg-primary/10/30 p-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-bold uppercase text-primary tracking-widest">Connect Instantly</span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
                  Ready for a speaking practice?
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Practice English seamlessly with partners globally. Build speaking confidence in real-time conversations.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/live-call">
                  <Button className="h-11 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm gap-2 shadow-sm transition-all duration-150 cursor-pointer">
                    <Video className="h-4 w-4" />
                    Start Matching
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <ActiveCourses courseProgressList={courseProgressList} />
          <RecentInteractions recentPartners={recentPartners} />
        </div>

        {/* Right Sidebar */}
        <LearningSidebar />
      </div>
    </div>
  )
}
