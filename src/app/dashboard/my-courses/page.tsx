/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="h-11 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 text-sm font-semibold cursor-pointer outline-none hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
          >
            <option value="ALL">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
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
        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs rounded-2xl overflow-hidden">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="text-left border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Course</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Level & Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Lessons</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850">
                {filteredCourses.map((course: any) => {
                  const thumbnailSrc = course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
                  const lessonsCount = course._count?.lessons ?? course.lessons?.length ?? 0
                  const levelColor = levelColors[course.level?.toUpperCase()] || "bg-muted text-muted-foreground border-transparent"
                  const isFree = course.price === 0 || course.type === "FREE"

                  return (
                    <tr key={course.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      {/* Course Cover & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                            <Image
                              src={thumbnailSrc}
                              alt={course.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-0.5 max-w-[350px]">
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm tracking-tight truncate group-hover:text-primary transition-colors" title={course.title}>
                              {course.title}
                            </h4>
                            <p className="text-xs text-zinc-450 dark:text-zinc-500 truncate" title={course.description}>
                              {course.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Level & Type */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge variant="outline" className={cn("text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider", levelColor)}>
                            {course.level}
                          </Badge>
                          <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {isFree ? "Free" : course.type}
                          </Badge>
                        </div>
                      </td>

                      {/* Lessons Count */}
                      <td className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-zinc-400" />
                          {lessonsCount} {lessonsCount === 1 ? "Lesson" : "Lessons"}
                        </span>
                      </td>

                      {/* Continue CTA Button */}
                      <td className="px-6 py-4 text-right">
                        <Link href={`/courses/${course.id}`}>
                          <Button className="h-9 px-4 rounded-xl text-xs font-bold gap-1.5 cursor-pointer" variant="outline">
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
      )}
    </div>
  )
}
