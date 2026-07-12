/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookMarked, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useGetCoursesQuery } from "@/redux/api/course-api"
import { CourseCard } from "@/components/ui/course-card"


export function FeaturedCourses() {
  // Query 3 courses
  const { data: coursesResponse, isLoading } = useGetCoursesQuery({
    page: 1,
    limit: 3
  })

  const courses = coursesResponse?.data || []

  return (
    <section className="py-24 bg-zinc-50/30 dark:bg-zinc-900/5 border-y border-border/40">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Self-Paced Learning</span>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground tracking-tight">Featured English Courses</h2>
            <p className="text-muted-foreground max-w-lg text-sm">
              Accelerate your English speaking, writing, and vocabulary with structured video lessons and materials.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline" className="rounded-xl text-xs font-black uppercase tracking-widest border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground h-11 px-5 cursor-pointer">
              View All Courses <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx} className="overflow-hidden border border-border/60 rounded-2xl flex flex-col min-h-[380px] animate-pulse">
                <div className="w-full aspect-video bg-muted" />
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                  <div className="h-10 bg-muted rounded w-full mt-4" />
                </div>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-muted/10 border border-dashed border-border/60 rounded-2xl space-y-2">
            <BookMarked className="w-8 h-8 mx-auto text-muted-foreground/30" />
            <h3 className="text-sm font-bold text-foreground">No Courses Published</h3>
            <p className="text-xs text-muted-foreground font-medium">We are adding new self-paced programs. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
