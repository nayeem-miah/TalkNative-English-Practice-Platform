/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Award, BookOpen, Clock, Phone } from "lucide-react"
import * as React from "react"

interface DashboardStatsProps {
  totalSessions: number
  totalMinutes: number
  totalSeconds: number
  enrolledCoursesCount: number
  totalCompletedLessons: number
}

function AnimateNumber({ value }: { value: number }) {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    let start = 0
    const end = value
    if (end === 0) {
      setCurrent(0)
      return
    }
    const duration = 600 // ms
    const stepTime = 16 // ~60fps
    const steps = duration / stepTime
    const increment = end / steps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        clearInterval(timer)
        setCurrent(end)
      } else {
        setCurrent(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return <>{current}</>
}

export function DashboardStats({
  totalSessions,
  totalMinutes,
  totalSeconds,
  enrolledCoursesCount,
  totalCompletedLessons,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Total Sessions Card */}
      <Card className="border border-zinc-150/80 dark:border-zinc-805/80 shadow-sm bg-white dark:bg-zinc-900/40 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md hover:border-teal-500/20 dark:hover:border-teal-500/10 transition-all duration-305 group">
        <CardContent className="p-6 flex items-center gap-4.5">
          <div className="h-12 w-12 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-all duration-300">
            <Phone className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Total Sessions</p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              <AnimateNumber value={totalSessions} />
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Practice Time Card */}
      <Card className="border border-zinc-150/80 dark:border-zinc-805/80 shadow-sm bg-white dark:bg-zinc-900/40 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/20 dark:hover:border-emerald-500/10 transition-all duration-305 group">
        <CardContent className="p-6 flex items-center gap-4.5">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-all duration-300">
            <Clock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Practice Time</p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              {totalMinutes > 0 ? (
                <>
                  <AnimateNumber value={totalMinutes} />
                  <span className="text-lg font-bold text-zinc-450 dark:text-zinc-550 ml-0.5">m</span>
                </>
              ) : (
                <>
                  <AnimateNumber value={totalSeconds} />
                  <span className="text-lg font-bold text-zinc-450 dark:text-zinc-550 ml-0.5">s</span>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Courses Card */}
      <Card className="border border-zinc-150/80 dark:border-zinc-805/80 shadow-sm bg-white dark:bg-zinc-900/40 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md hover:border-amber-500/20 dark:hover:border-amber-500/10 transition-all duration-305 group">
        <CardContent className="p-6 flex items-center gap-4.5">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-all duration-300">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Enrolled Courses</p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              <AnimateNumber value={enrolledCoursesCount} />
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Completed Lessons Card */}
      <Card className="border border-zinc-150/80 dark:border-zinc-805/80 shadow-sm bg-white dark:bg-zinc-900/40 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md hover:border-blue-500/20 dark:hover:border-blue-500/10 transition-all duration-305 group">
        <CardContent className="p-6 flex items-center gap-4.5">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-all duration-300">
            <Award className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Completed Lessons</p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              <AnimateNumber value={totalCompletedLessons} />
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
