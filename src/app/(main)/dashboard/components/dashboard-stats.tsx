"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Award, BookOpen, Clock, Phone } from "lucide-react"

interface DashboardStatsProps {
  totalSessions: number
  totalMinutes: number
  totalSeconds: number
  enrolledCoursesCount: number
  totalCompletedLessons: number
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
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{enrolledCoursesCount}</p>
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
  )
}
