/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Search } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ComingSoonCard } from "@/components/ui/coming-soon-card"
import { CourseCard } from "@/components/ui/course-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { cn } from "@/lib/utils"
import { useGetCoursesQuery } from "@/redux/api/course-api"

export function CoursesClient() {
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

  const allCourses = coursesResponse?.data || []
  const courses = allCourses.filter((course: any) => course.isPublished === true)
  const meta = coursesResponse?.meta
  const totalCourses = meta?.total ?? 0
  const totalPages = meta?.totalPage ?? 1

  return (
    <div className="min-h-screen bg-background pb-16">
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
              className="pl-11 h-11 rounded-xl border-border bg-muted/10 transition-all focus:ring-primary/10"
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
                  "rounded-xl text-xs font-extrabold px-4 h-11 transition-all duration-300 uppercase tracking-wider border-border/60 hover:scale-[1.02] active:scale-[0.98]",
                  levelFilter === lvl
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 border-none hover:bg-primary/90"
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
              {courses.map((course: any) => (
                <CourseCard key={course.id} course={course} />
              ))}
              {/* Coming Soon placeholders to fill grid symmetry */}
              {courses.length > 0 && courses.length % 3 !== 0 &&
                Array.from({ length: 3 - (courses.length % 3) }).map((_, idx) => (
                  <ComingSoonCard key={`placeholder-${idx}`} />
                ))
              }
            </div>

            {/* Premium Pagination controls */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCourses}
              limit={limit}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
