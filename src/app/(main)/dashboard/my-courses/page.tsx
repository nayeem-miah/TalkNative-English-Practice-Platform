/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetMyCoursesQuery } from "@/redux/api/enrollment-api"
import { ArrowRight, Book, BookOpen, Filter, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import * as React from "react"
import { cn } from "@/lib/utils"

const levelColors: Record<string, string> = {
  BEGINNER: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  INTERMEDIATE: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  ADVANCED: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
}

export default function MyCoursesPage() {
  const [mounted, setMounted] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedLevel, setSelectedLevel] = React.useState("ALL")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const { data: myCoursesResponse, isLoading } = useGetMyCoursesQuery(undefined, { skip: !mounted })

  const enrolledCourses = React.useMemo(() => {
    if (!myCoursesResponse) return []
    // API returns direct array, or wraps it inside data key
    const rawList = Array.isArray(myCoursesResponse)
      ? myCoursesResponse
      : Array.isArray(myCoursesResponse?.data)
        ? myCoursesResponse.data
        : []

    return rawList.map((item: any) => {
      if (item && typeof item === 'object' && item.course) {
        return item.course
      }
      return item
    }).filter(Boolean)
  }, [myCoursesResponse])

  // Filter courses locally for search and difficulty dropdown
  const filteredCourses = React.useMemo(() => {
    return enrolledCourses.filter((course: any) => {
      const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLevel = selectedLevel === "ALL" ||
        course.level?.toUpperCase() === selectedLevel.toUpperCase()

      return matchesSearch && matchesLevel
    })
  }, [enrolledCourses, searchTerm, selectedLevel])

  const coursesWithProgress = React.useMemo(() => {
    return filteredCourses.map((course: any) => {
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
      const totalLessons = course._count?.lessons ?? course.lessons?.length ?? 0
      const percent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0
      return { ...course, completedCount, totalLessons, percent }
    })
  }, [filteredCourses])

  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        <p className="text-zinc-550 dark:text-zinc-400 font-medium text-sm">Loading your courses...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
          My Enrolled Courses
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mt-1">
          Continue learning where you left off in your English training path.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-550" />
          <Input
            placeholder="Search enrolled courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:ring-primary/10"
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter className="w-4 h-4 text-zinc-400" />
          <Select value={selectedLevel} onValueChange={(val) => setSelectedLevel(val || "ALL")}>
            <SelectTrigger className="h-11 min-w-[130px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 text-sm font-semibold cursor-pointer outline-none hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors flex items-center justify-between gap-2">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-zinc-150 dark:border-zinc-850 bg-card z-50">
              <SelectItem value="ALL">All Levels</SelectItem>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs bg-white dark:bg-zinc-900/60 rounded-2xl overflow-hidden p-10">
          <div className="text-center max-w-sm mx-auto space-y-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Book className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-zinc-850 dark:text-zinc-200 font-sans">No courses found</h3>
              <p className="text-xs text-zinc-450 dark:text-zinc-500 leading-relaxed font-medium">
                {enrolledCourses.length === 0
                  ? "You haven't enrolled in any English courses yet. Browse our catalog to start learning!"
                  : "No courses match your active search term or level filter."}
              </p>
            </div>
            {enrolledCourses.length === 0 && (
              <Link href="/courses" className="inline-block mt-2">
                <Button className="h-10 px-5 rounded-lg text-xs font-bold gap-2 cursor-pointer">
                  Browse All Courses
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card className="border border-zinc-150/80 dark:border-zinc-805/80 bg-white dark:bg-zinc-900/40 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr className="text-left border-b border-zinc-200/50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="px-6 py-4.5 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Course Info</th>
                    <th className="px-6 py-4.5 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Difficulty & Access</th>
                    <th className="px-6 py-4.5 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Progress</th>
                    <th className="px-6 py-4.5 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Lessons</th>
                    <th className="px-6 py-4.5 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850">
                  {coursesWithProgress.map((course: any) => {
                    const thumbnailSrc = course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
                    const lessonsCount = course.totalLessons
                    const levelColor = levelColors[course.level?.toUpperCase()] || "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-transparent"
                    const isFree = course.price === 0 || course.type === "FREE"

                    return (
                      <tr key={course.id} className="group hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                        {/* Course Cover & Title */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative h-14 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200/50 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-900">
                              <Image
                                src={thumbnailSrc}
                                alt={course.title}
                                fill
                                sizes="120px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="space-y-1 max-w-[320px]">
                              <h4 className="font-extrabold text-zinc-900 dark:text-zinc-50 text-sm tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-1" title={course.title}>
                                {course.title}
                              </h4>
                              <p className="text-xs text-zinc-450 dark:text-zinc-500 line-clamp-2 leading-relaxed" title={course.description}>
                                {course.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Difficulty & Type */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5 items-start">
                            <Badge variant="outline" className={cn("text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider bg-white/95 dark:bg-zinc-900/90", levelColor)}>
                              {course.level}
                            </Badge>
                            <Badge variant="outline" className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider bg-[#006D5B]/5 text-[#006D5B] border-[#006D5B]/20">
                              {isFree ? "Free" : course.type}
                            </Badge>
                          </div>
                        </td>

                        {/* Inline Progress Bar */}
                        <td className="px-6 py-5">
                          <div className="w-[180px] space-y-2">
                            <div className="flex justify-between text-[10px] font-black">
                              <span className="text-[#006D5B] dark:text-emerald-450">{course.percent}%</span>
                              <span className="text-zinc-400">{course.completedCount}/{lessonsCount} Completed</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200/20 shadow-inner">
                              <div className="h-full bg-gradient-to-r from-[#006D5B] to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${course.percent}%` }} />
                            </div>
                          </div>
                        </td>

                        {/* Lessons Count */}
                        <td className="px-6 py-5 text-xs font-extrabold text-zinc-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4 text-zinc-400" />
                            {lessonsCount} {lessonsCount === 1 ? "Lesson" : "Lessons"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5 text-right">
                          <Link href={`/courses/${course.id}`}>
                            <Button className="h-9 px-4 rounded-xl text-xs font-black gap-1.5 cursor-pointer bg-[#006D5B] hover:bg-[#005a4b] text-white border-none shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
                              Continue
                              <ArrowRight className="h-3.5 w-3.5" />
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

          {/* Discover More Courses CTA */}
          {enrolledCourses.length < 4 && (
            <div className="mt-8 p-8 rounded-3xl bg-gradient-to-r from-[#006D5B]/5 via-teal-500/5 to-transparent border border-zinc-200/60 dark:border-zinc-800/80 relative overflow-hidden shadow-sm">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <BookOpen className="h-44 w-44 text-[#006D5B]" />
              </div>
              <div className="relative z-10 space-y-4 max-w-lg">
                <span className="bg-[#006D5B]/10 text-[#006D5B] text-[9px] font-black tracking-widest uppercase py-1 px-2.5 rounded-full">
                  Discover More
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
                  Ready to expand your vocabulary?
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold leading-relaxed">
                  Browse our full catalog of English courses. From everyday small talk to business communication, we have a path for every skill level.
                </p>
                <Link href="/courses" className="inline-block pt-1">
                  <Button className="h-10 px-5 bg-[#006D5B] hover:bg-[#005a4b] text-white font-extrabold text-xs rounded-xl shadow-md shadow-primary/10 gap-2 border-none cursor-pointer">
                    Explore More Courses
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
