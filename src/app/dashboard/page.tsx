 
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { useGetCallHistoryQuery } from "@/redux/api/call-api"
import { useGetMyCoursesQuery } from "@/redux/api/enrollment-api"
import Image from "next/image"
import { removeCookie } from "@/utils/cookie"
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  Phone,
  Star,
  TrendingUp,
  Video
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

export default function UserDashboardPage() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const { data: userResponse, isLoading: isUserLoading } = useGetMeQuery(undefined, { skip: !mounted })
  const { data: callHistoryResponse, isLoading: isHistoryLoading } = useGetCallHistoryQuery(undefined, { skip: !mounted })
  const { data: myCoursesResponse, isLoading: isCoursesLoading } = useGetMyCoursesQuery(undefined, { skip: !mounted })

  const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data
  const calls = callHistoryResponse?.data || []
  const myCourses = myCoursesResponse?.data || []
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

  // Dynamic local-time greeting
  const greeting = React.useMemo(() => {
    if (typeof window === "undefined") return "Welcome back"
    const hours = new Date().getHours()
    if (hours < 12) return "Good morning"
    if (hours < 17) return "Good afternoon"
    return "Good evening"
  }, [])

  // Load completed lesson counts from localStorage for each enrolled course
  const courseProgressList = React.useMemo(() => {
    if (!mounted || !myCourses) return []
    return myCourses.map((course: any) => {
      let completedCount = 0
      try {
        const saved = localStorage.getItem(`talknative_completed_${course.id}`)
        if (saved) {
          const ids = JSON.parse(saved)
          if (Array.isArray(ids)) {
            completedCount = ids.length
          }
        }
      } catch (e) {
        console.error(e)
      }
      const totalLessons = course._count?.lessons || 0
      const percent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0
      return {
        ...course,
        completedCount,
        totalLessons,
        percent,
      }
    })
  }, [mounted, myCourses])

  const totalCompletedLessons = React.useMemo(() => {
    return courseProgressList.reduce((acc: number, course: any) => acc + course.completedCount, 0)
  }, [courseProgressList])

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

  // Calculate Statistics dynamically
  const totalSessions = calls.length
  const totalSeconds = calls.reduce((acc: number, call: any) => {
    if (call.duration) {
      return acc + call.duration
    }
    if (call.startTime && call.endTime) {
      const diffMs = new Date(call.endTime).getTime() - new Date(call.startTime).getTime()
      return acc + Math.floor(diffMs / 1000)
    }
    return acc
  }, 0)

  const totalMinutes = Math.floor(totalSeconds / 60)

  // Map call history into recent partners format
  const recentPartners = calls.slice(0, 3).map((call: any) => {
    const isCaller = call.callerId === user?.id
    const partner = isCaller ? call.callee : call.caller

    let durationStr = "0s"
    if (call.startTime && call.endTime) {
      const diffMs = new Date(call.endTime).getTime() - new Date(call.startTime).getTime()
      const totalSec = Math.floor(diffMs / 1000)
      if (totalSec >= 60) {
        durationStr = `${Math.floor(totalSec / 60)}m`
      } else {
        durationStr = `${totalSec}s`
      }
    }

    return {
      id: call.id,
      name: partner?.name || "Speaking Partner",
      language: isCaller ? `${user?.learningLanguage || 'English'} (Practice)` : `${user?.nativeLanguage || 'Bengali'} (Native)`,
      duration: durationStr,
      rating: 5,
      time: new Date(call.startTime).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }),
      image: partner?.profilePicture || ""
    }
  })

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Top welcome & greeting header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
            {greeting}, {user?.name || "Learner"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">
            Keep tracking your language progress and learning goals.
          </p>
        </div>
        <div>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg font-semibold text-xs flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active learning mode
          </Badge>
        </div>
      </div>

      {/* Dynamic Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm bg-white dark:bg-zinc-900/60 rounded-xl overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
              <Phone className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-zinc-450 uppercase tracking-wider">Total Sessions</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalSessions}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm bg-white dark:bg-zinc-900/60 rounded-xl overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Clock className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-zinc-450 uppercase tracking-wider">Practice Time</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {totalMinutes > 0 ? `${totalMinutes}m` : `${totalSeconds}s`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm bg-white dark:bg-zinc-900/60 rounded-xl overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-zinc-450 uppercase tracking-wider">Enrolled Courses</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{myCourses.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm bg-white dark:bg-zinc-900/60 rounded-xl overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
              <Award className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-zinc-450 uppercase tracking-wider">Completed Lessons</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalCompletedLessons}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main section and Sidebar grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Main Workspace */}
        <div className="lg:col-span-8 space-y-8">
          {/* Elegant, clean and formal Call-To-Action practice card */}
          <Card className="border border-primary/20 dark:border-primary/10 shadow-sm rounded-xl bg-primary/5 dark:bg-primary/10/30 p-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-bold uppercase text-primary tracking-widest">Connect Instantly</span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">Ready for a speaking practice?</h2>
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

          {/* Active Courses Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-sans">Active Courses</h3>
                <p className="text-xs text-zinc-400 font-medium">Your course enrollment and learning progress</p>
              </div>
              <Link href="/dashboard/my-courses" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                All My Courses <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {courseProgressList.length === 0 ? (
              <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm rounded-xl bg-white dark:bg-zinc-900/60">
                <CardContent className="p-8 text-center space-y-4">
                  <BookOpen className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm text-zinc-550 dark:text-zinc-400 font-bold">No enrolled courses yet</p>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto font-medium">
                      Unlock structured speaking curriculum, lessons, and practice materials.
                    </p>
                  </div>
                  <Link href="/courses">
                    <Button variant="outline" size="sm" className="rounded-lg font-bold text-xs cursor-pointer mt-1">
                      Browse Course Catalog
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courseProgressList.slice(0, 2).map((course: any) => (
                  <Card key={course.id} className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm rounded-xl bg-white dark:bg-zinc-900/60 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col">
                    <div className="relative aspect-video w-full bg-muted overflow-hidden flex-shrink-0">
                      <Image
                        fill
                        src={course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"}
                        alt={course.title}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <CardContent className="p-4 flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20">
                            {course.level}
                          </Badge>
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary/5 text-primary border-primary/20">
                            {course.type || "FREE"}
                          </Badge>
                        </div>
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-tight font-sans line-clamp-1">
                          {course.title}
                        </h4>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-zinc-450">{course.completedCount}/{course.totalLessons} Lessons</span>
                          <span className="text-primary">{course.percent}% completed</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${course.percent}%` }} />
                        </div>
                      </div>

                      <Link href={`/courses/${course.id}`} className="w-full">
                        <Button className="w-full h-9 rounded-lg font-bold text-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1.5">
                          Continue Learning
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* List of recent speaking sessions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-sans">Recent Interactions</h3>
                <p className="text-xs text-zinc-400 font-medium">History of your latest 3 conversations</p>
              </div>
              <Link href="/history" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                Full History <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            {recentPartners.length === 0 ? (
              <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm rounded-xl bg-white dark:bg-zinc-900/60">
                <CardContent className="p-8 text-center space-y-2.5">
                  <Phone className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
                  <p className="text-sm text-zinc-500 font-medium">No sessions practiced yet. Connect with learners to start!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentPartners.map((partner: any) => (
                  <Card key={partner.id} className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm rounded-xl bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-250 group">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 rounded-full border border-zinc-100 dark:border-zinc-800">
                          <AvatarImage src={partner.image} className="object-cover" />
                          <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350 font-bold">
                            {partner.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm group-hover:text-primary transition-colors font-sans">
                            {partner.name}
                          </p>
                          <p className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {partner.language}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 sm:gap-8">
                        <div className="hidden sm:block text-right space-y-0.5">
                          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{partner.duration}</p>
                          <p className="text-[10px] text-zinc-455 font-bold uppercase tracking-wider">Duration</p>
                        </div>

                        <div className="text-right space-y-0.5">
                          <div className="flex gap-0.5 mb-0.5 justify-end">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-2.5 w-2.5 ${i < partner.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-800'}`} />
                            ))}
                          </div>
                          <p className="text-[10px] text-zinc-400 font-semibold">{partner.time}</p>
                        </div>

                        <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-850 cursor-pointer">
                          <ChevronRight className="h-4 w-4 text-zinc-400" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Analytics & Resources */}
        <div className="lg:col-span-4 space-y-8">
          {/* Minimal and professional Weekly Target Progress card */}
          <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm rounded-2xl bg-white dark:bg-zinc-900/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-xs tracking-wider uppercase">Learning Progress</h3>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-400">Weekly Target</span>
                  <span className="text-primary font-bold">85% achieved</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-primary rounded-full" />
                </div>
              </div>

              <div className="pt-5 border-t border-zinc-150 dark:border-zinc-850 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 dark:text-amber-400 flex-shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Weekly Streak</p>
                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5">5 target days completed</p>
                  </div>
                </div>
                <Button className="w-full h-9 rounded-lg font-bold text-[11px] uppercase tracking-wider cursor-pointer" variant="outline">
                  View Progress Profile
                </Button>
              </div>
            </div>
          </Card>

          {/* Structured Resource Recommendations */}
          <div className="space-y-4 px-1">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recommended Resources</h3>
            <div className="space-y-3">
              <div className="group cursor-pointer bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                  <BookOpen className="h-3 w-3" />
                  Speaking Guide
                </div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-primary leading-snug">
                  Mastering Daily Idioms: A Practical Guide for Advanced Learners
                </p>
              </div>

              <div className="group cursor-pointer bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                  <Compass className="h-3 w-3" />
                  Pronunciation
                </div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 leading-snug">
                  Understanding Intonation Patterns in Conversational English
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
