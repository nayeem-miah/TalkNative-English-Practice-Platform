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
        <Card className="border border-zinc-150/80 dark:border-zinc-805/80 bg-white dark:bg-zinc-900/40 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="text-left border-b border-zinc-200/50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Active Course</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Difficulty</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Progress</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850">
                {courseProgressList.slice(0, 3).map((course) => {
                  const thumbnailSrc = course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
                  const lessonsCount = course.totalLessons || course._count?.lessons || 0

                  return (
                    <tr key={course.id} className="group hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                      {/* Course Cover & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200/50 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-900">
                            <Image
                              src={thumbnailSrc}
                              alt={course.title}
                              fill
                              sizes="100px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized
                            />
                          </div>
                          <div className="space-y-0.5 max-w-[280px]">
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-1" title={course.title}>
                              {course.title}
                            </h4>
                            <p className="text-[11px] text-zinc-450 dark:text-zinc-550 flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {lessonsCount} lessons
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Difficulty Level */}
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 uppercase tracking-wider">
                          {course.level}
                        </Badge>
                      </td>

                      {/* Progress Bar */}
                      <td className="px-6 py-4">
                        <div className="w-[150px] space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-zinc-450 dark:text-zinc-500">{course.completedCount}/{lessonsCount} Completed</span>
                            <span className="text-primary font-black">{course.percent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-850 rounded-full overflow-hidden border border-zinc-200/20 shadow-inner">
                            <div className="h-full bg-gradient-to-r from-[#006D5B] to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${course.percent}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* Action Continue Button */}
                      <td className="px-6 py-4 text-right">
                        <Link href={`/courses/${course.id}`}>
                          <Button className="h-8.5 px-3.5 rounded-lg text-xs font-black gap-1 cursor-pointer bg-[#006D5B] hover:bg-[#005a4b] text-white border-none shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center">
                            Continue
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
