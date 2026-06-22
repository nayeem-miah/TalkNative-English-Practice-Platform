/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client"

import {
  BookMarked,
  BookOpen,
  GraduationCap,
  Search
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useGetCoursesQuery } from "@/redux/api/course-api"
import { EmptyState } from "@/components/ui/empty-state"

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [levelFilter, setLevelFilter] = React.useState("ALL")
  const [currentPage, setCurrentPage] = React.useState(1)
  const limit = 6

  // Reset page to 1 when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleLevelChange = (level: string) => {
    setLevelFilter(level)
    setCurrentPage(1)
  }

  // RTK Query call
  const { data: coursesResponse, isLoading } = useGetCoursesQuery({
    page: currentPage,
    limit,
    level: levelFilter,
    searchTerm,
  })

  const courses = coursesResponse?.data || []
  const meta = coursesResponse?.meta
  const totalCourses = meta?.total ?? 0
  const totalPages = meta?.totalPage ?? 1

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hero Section */}
      {/* <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 py-16 sm:py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-violet-500/30 blur-3xl" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center space-y-6">
          <Badge className="bg-white/10 hover:bg-white/15 text-white border-none py-1 px-3 text-xs gap-1.5 rounded-full backdrop-blur-sm animate-pulse">
            <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" /> Learn from Native Speakers
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Unlock Your Potential with Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">English Courses</span>
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
            Gain fluency, confidence, and vocabulary through structured lessons designed by expert native language coaches.
          </p>
        </div>
      </div> */}

      {/* Main Content & Filters */}
      <div className="max-w-6xl mx-auto px-6 mt-12 space-y-10">

        {/* Search & Filter bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card border border-border/80 p-5 rounded-2xl shadow-sm">
          {/* Search Input */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/50" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-11 h-12 rounded-xl border-border bg-muted/10 transition-all focus:ring-primary/10"
            />
          </div>

          {/* Level Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((lvl) => (
              <Button
                key={lvl}
                variant={levelFilter === lvl ? "default" : "outline"}
                onClick={() => handleLevelChange(lvl)}
                className={cn(
                  "rounded-xl text-xs font-bold px-4 py-2 h-10 transition-all uppercase tracking-wider border-border/60",
                  levelFilter === lvl
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10 border-none"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground bg-background"
                )}
              >
                {lvl === "ALL" ? "All Levels" : lvl.toLowerCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Courses Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx} className="overflow-hidden border border-border/60 rounded-2xl flex flex-col min-h-[380px] animate-pulse">
                <div className="w-full aspect-video bg-muted" />
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                  </div>
                  <div className="h-10 bg-muted rounded w-full mt-4" />
                </div>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            title="No courses found"
            description="We couldn't find any courses matching your search terms or filters. Try adjusting your search query."
            actionLabel="Reset Filters"
            onActionClick={() => { setSearchTerm(""); setLevelFilter("ALL"); }}
            className="border-2 border-dashed rounded-3xl min-h-[350px]"
          />
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course: any) => {
                const thumbnailSrc = course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
                const lessonsCount = course._count?.lessons ?? 0
                const levelColors: Record<string, string> = {
                  BEGINNER: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
                  INTERMEDIATE: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
                  ADVANCED: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
                }
                const levelColor = levelColors[course.level?.toUpperCase()] || "bg-muted text-muted-foreground border-transparent"

                return (
                  <Card key={course.id} className="overflow-hidden border border-border/80 hover:border-primary/30 shadow-sm hover:shadow-lg flex flex-col rounded-2xl bg-card transition-all duration-300 hover:-translate-y-1 group">

                    {/* Media Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <Image
                        width={400}
                        height={250}
                        src={thumbnailSrc}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 animate-in fade-in-50 duration-500"
                        unoptimized
                      />

                      {/* Floating Badges */}
                      <div className="absolute inset-0 p-3.5 flex justify-between items-start bg-gradient-to-b from-black/40 via-transparent to-transparent">
                        <Badge variant="outline" className="rounded-lg border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider backdrop-blur-md text-white bg-black/10 border-white/20">
                          {course.type || "PREMIUM"}
                        </Badge>
                        <Badge variant="outline" className={cn("rounded-lg border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-background text-foreground border-border/60 shadow-sm", levelColor)}>
                          {course.level}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-base font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                          {course.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Stats Flex Row */}
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-bold bg-muted/30 px-3.5 py-2.5 rounded-xl border border-border/60">
                          <span className="flex items-center gap-1.5">
                            <BookMarked className="w-3.5 h-3.5 text-muted-foreground/60" />
                            {lessonsCount} {lessonsCount === 1 ? "Lesson" : "Lessons"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-muted-foreground/60" />
                            {course.studentsCount ?? 0} Learners
                          </span>
                          <span>•</span>
                          <span className="text-foreground font-black text-xs">
                            {course.price > 0 ? `$${course.price}` : "Free"}
                          </span>
                        </div>

                        {/* CTA button */}
                        <Link href={`/courses/${course.id}`} className="block w-full">
                          <Button className="w-full rounded-xl h-10 text-xs font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-sm">
                            Explore Course
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Premium Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border/60 px-4 py-4 sm:px-6 mt-8 bg-card rounded-2xl border">
                {/* Mobile pagination controls */}
                <div className="flex flex-1 justify-between sm:hidden">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="rounded-xl font-bold text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="rounded-xl font-bold text-xs"
                  >
                    Next
                  </Button>
                </div>

                {/* Desktop pagination controls */}
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">
                      Showing <span className="text-foreground font-black">{(currentPage - 1) * limit + 1}</span> to{" "}
                      <span className="text-foreground font-black">
                        {Math.min(currentPage * limit, totalCourses)}
                      </span>{" "}
                      of <span className="text-foreground font-black">{totalCourses}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-xl gap-1" aria-label="Pagination">
                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-xl border-border/50 hover:bg-muted font-bold text-xs"
                      >
                        <span className="sr-only">Previous</span>
                        &larr;
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          className={`h-9 w-9 rounded-xl p-0 font-black text-xs transition-all ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/95 border-none"
                              : "border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {page}
                        </Button>
                      ))}

                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-xl border-border/50 hover:bg-muted font-bold text-xs"
                      >
                        <span className="sr-only">Next</span>
                        &rarr;
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesPage
