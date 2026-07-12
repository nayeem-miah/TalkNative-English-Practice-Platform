"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CourseWithProgress } from "@/types"
import { ArrowRight, BookOpen, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ActiveCoursesProps {
  courseProgressList: CourseWithProgress[]
}

export function ActiveCourses({ courseProgressList }: ActiveCoursesProps) {
  return (
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
          {courseProgressList.slice(0, 2).map((course) => (
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
  )
}
