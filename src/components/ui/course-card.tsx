/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookMarked, GraduationCap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  course: any
}

export function CourseCard({ course }: CourseCardProps) {
  const thumbnailSrc = course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
  const lessonsCount = course._count?.lessons ?? 0
  const levelColors: Record<string, string> = {
    BEGINNER: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
    INTERMEDIATE: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    ADVANCED: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
  }
  const levelColor = levelColors[course.level?.toUpperCase()] || "bg-muted text-muted-foreground border-transparent"

  return (
    <Card className="overflow-hidden border border-border/80 hover:border-primary/30 shadow-sm hover:shadow-lg flex flex-col rounded-2xl bg-card transition-all duration-300 hover:-translate-y-1 group">
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
          <div className="flex items-center justify-between gap-1.5 text-[11px] text-muted-foreground font-bold bg-muted/30 px-3.5 py-2.5 rounded-xl border border-border/60 min-w-0">
            <span className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <BookMarked className="w-3.5 h-3.5 text-muted-foreground/60" />
              {lessonsCount} {lessonsCount === 1 ? "Lesson" : "Lessons"}
            </span>
            <span className="shrink-0 text-muted-foreground/40">•</span>
            <span className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <GraduationCap className="w-3.5 h-3.5 text-muted-foreground/60" />
              {course.studentsCount ?? 0} Learners
            </span>
            <span className="shrink-0 text-muted-foreground/40">•</span>
            <span className="text-foreground font-black text-xs truncate" title={course.price > 0 ? `$${course.price}` : "Free"}>
              {course.price > 0 
                ? new Intl.NumberFormat("en-US", { 
                    style: "currency", 
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  }).format(course.price) 
                : "Free"}
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
}
