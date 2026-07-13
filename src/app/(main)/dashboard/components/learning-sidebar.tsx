/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useGetCoursesQuery } from "@/redux/api/course-api"
import { Award, BookOpen, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import * as React from "react"

interface LearningSidebarProps {
  calls?: any[]
  enrolledCourses?: any[]
}

export function LearningSidebar({ calls = [], enrolledCourses = [] }: LearningSidebarProps) {
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"]

  // Calculate dynamic weekly streak & completed days based on user's call history
  const completedDays = React.useMemo(() => {
    const today = new Date()
    const currentDay = today.getDay()
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) // adjust when day is Sunday
    const monday = new Date(today.setDate(diff))
    monday.setHours(0, 0, 0, 0)

    return Array.from({ length: 7 }).map((_, idx) => {
      const dayDate = new Date(monday)
      dayDate.setDate(monday.getDate() + idx)
      const dayStr = dayDate.toDateString()

      // Check if user had any call on this day
      return calls.some((call: any) => {
        if (!call.startTime) return false
        return new Date(call.startTime).toDateString() === dayStr
      })
    })
  }, [calls])

  const streakDaysCount = React.useMemo(() => {
    return completedDays.filter(Boolean).length
  }, [completedDays])

  // Calculate speaking minutes in the last 7 days for progress bar
  const weeklyProgress = React.useMemo(() => {
    const today = new Date()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 7)

    const last7DaysCalls = calls.filter((call: any) => {
      if (!call.startTime) return false
      return new Date(call.startTime) >= sevenDaysAgo
    })

    const totalSeconds = last7DaysCalls.reduce((acc: number, call: any) => {
      if (call.duration) return acc + call.duration
      if (call.startTime && call.endTime) {
        return acc + Math.floor((new Date(call.endTime).getTime() - new Date(call.startTime).getTime()) / 1000)
      }
      return acc
    }, 0)

    const minutes = Math.floor(totalSeconds / 60)
    const targetMinutes = 15 // Target: 15 minutes of speaking practice per week
    const percent = Math.min(100, Math.round((minutes / targetMinutes) * 100))
    return { minutes, targetMinutes, percent }
  }, [calls])

  // Fetch Recommended Resources dynamically from All Courses API
  const { data: coursesResponse } = useGetCoursesQuery()
  const allCourses = coursesResponse?.data || coursesResponse?.result || []

  const recommendedCourses = React.useMemo(() => {
    // Exclude courses that user is already enrolled in
    const unenrolled = allCourses.filter((course: any) => {
      return !enrolledCourses.some((ec: any) => ec.id === course.id)
    })

    // Return first 2 unenrolled courses, or first 2 general courses if enrolled in all
    return (unenrolled.length > 0 ? unenrolled : allCourses).slice(0, 2)
  }, [allCourses, enrolledCourses])

  return (
    <div className="lg:col-span-4 space-y-8">
      {/* Weekly Target Progress */}
      <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm rounded-2xl bg-white dark:bg-zinc-900/60 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-xs tracking-wider uppercase">Learning Progress</h3>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-400">Weekly Target</span>
              <span className="text-primary font-bold">{weeklyProgress.percent}% achieved</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${weeklyProgress.percent}%` }} />
            </div>
            <p className="text-[10px] text-zinc-400 font-medium">
              Practiced {weeklyProgress.minutes} min of {weeklyProgress.targetMinutes} min target this week
            </p>
          </div>

          <div className="pt-5 border-t border-zinc-150 dark:border-zinc-850 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 dark:text-amber-400 flex-shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Weekly Streak</p>
                  <p className="text-[10px] text-zinc-400 font-medium mt-0.5">{streakDaysCount} target days completed</p>
                </div>
              </div>

              {/* Duolingo-style Streak Calendar */}
              <div className="flex items-center justify-between gap-1.5 pt-2">
                {daysOfWeek.map((day, index) => {
                  const isCompleted = completedDays[index]
                  return (
                    <div key={index} className="flex flex-col items-center gap-1 flex-1">
                      <div className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all shadow-sm",
                        isCompleted
                          ? "bg-primary text-primary-foreground scale-105 border border-primary"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-450 dark:text-zinc-550 border border-transparent"
                      )}>
                        {isCompleted ? "✓" : day}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <Link href="/profile" className="block w-full">
              <Button className="w-full h-9 rounded-lg font-bold text-[11px] uppercase tracking-wider cursor-pointer" variant="outline">
                View Progress Profile
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Recommended Resources */}
      <div className="space-y-4 px-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recommended Courses</h3>
        </div>

        <div className="space-y-3">
          {recommendedCourses.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-zinc-250 dark:border-zinc-800 rounded-2xl bg-card">
              <p className="text-xs font-bold text-muted-foreground">All recommended courses are enrolled!</p>
            </div>
          ) : (
            recommendedCourses.map((course: any, idx: number) => {
              const colors = [
                { bg: "bg-primary/10 dark:bg-primary/20", text: "text-primary" },
                { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400" }
              ]
              const color = colors[idx % colors.length]

              return (
                <Link href={`/courses/${course.id}`} key={course.id} className="block">
                  <div className="group cursor-pointer bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all p-3.5 flex gap-3.5 items-start">
                    <div className={cn("h-14 w-14 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200", color.bg, color.text)}>
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className={cn("flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest", color.text)}>
                        {course.level || "Suggested"}
                      </div>
                      <p className="text-[11px] font-bold text-zinc-850 dark:text-zinc-200 group-hover:text-primary leading-snug line-clamp-2">
                        {course.title}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
