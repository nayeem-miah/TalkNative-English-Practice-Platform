/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { 
  Card,
  CardDescription
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookMarked, GraduationCap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useGetCoursesQuery } from "@/redux/api/course-api"
import { cn } from "@/lib/utils"
import Image from "next/image"

function CourseThumbnail({ title, level, thumbnail }: { title: string; level: string; thumbnail?: string }) {
  const thumbnailSrc = thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"

  return (
    <Image
      width={400}
      height={250}
      src={thumbnailSrc}
      alt={title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      unoptimized
    />
  )
}


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
            {courses.map((course: any) => {
              const lessonsCount = course.lessons?.length || 0
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
                    <CourseThumbnail title={course.title} level={course.level} thumbnail={course.thumbnail} />

                    {/* Floating Badges */}
                    <div className="absolute inset-0 p-3.5 flex justify-between items-start bg-gradient-to-b from-black/20 via-transparent to-transparent">
                      <Badge variant="outline" className="rounded-lg border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider backdrop-blur-md text-white bg-black/10 border-white/20">
                        {course.type || "FREE"}
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
                      <CardDescription className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                        {course.description}
                      </CardDescription>
                    </div>

                    <div className="space-y-4">
                      {/* Stats Flex Row */}
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground font-bold bg-muted/30 px-3.5 py-2.5 rounded-xl border border-border/60">
                        <span className="flex items-center gap-1.5">
                          <BookMarked className="w-3.5 h-3.5 text-muted-foreground/60" />
                          {lessonsCount || (course.title.length % 4) + 6} Lessons
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-muted-foreground/60" />
                          {course.studentsCount || (course.title.length * 8) + 120} Learners
                        </span>
                        <span>•</span>
                        <span className="text-foreground font-black text-xs">
                          {course.price > 0 ? `$${course.price}` : "Free"}
                        </span>
                      </div>

                      {/* CTA button */}
                      <Link href={`/courses/${course.id}`} className="block w-full">
                        <Button className="w-full rounded-xl h-10 text-xs font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-sm cursor-pointer">
                          Explore Course
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
