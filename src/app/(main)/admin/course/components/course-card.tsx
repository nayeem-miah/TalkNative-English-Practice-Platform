"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Edit, ExternalLink, MoreVertical, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Course } from "../types"

interface CourseCardProps {
  course: Course
  onStartEdit: (course: Course) => void
  onPublishToggle: (courseId: string) => void
  onStartDelete: (course: Course) => void
}

export function CourseCard({
  course,
  onStartEdit,
  onPublishToggle,
  onStartDelete,
}: CourseCardProps) {
  const thumbnailSrc = course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
  const lessonsCount = course._count?.lessons ?? 0
  const studentsCount = course.studentsCount ?? 0

  return (
    <Card className="overflow-hidden border border-border shadow-sm flex flex-col rounded-2xl bg-card relative">
      {/* Card Header Media & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          width={500}
          height={500}
          src={thumbnailSrc}
          alt={course.title}
          className="w-full h-full object-cover"
        />

        {/* Badge Overlay */}
        <div className="absolute inset-0 p-3 flex justify-between items-start bg-black/25">
          {/* Level Badge */}
          <Badge className="rounded-lg border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-background text-foreground border-border shadow-sm">
            {course.level}
          </Badge>

          {/* Action Dropdown Menu */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 rounded-xl bg-background/90 hover:bg-background text-foreground flex items-center justify-center shadow-md cursor-pointer border border-border focus:outline-none">
                <MoreVertical className="w-4.5 h-4.5" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 p-1.5 rounded-xl border border-border bg-card shadow-lg" align="end">
                <DropdownMenuItem onClick={() => onStartEdit(course)} className="rounded-lg cursor-pointer py-2 text-xs font-semibold gap-2">
                  <Edit className="w-4 h-4 text-muted-foreground" /> Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPublishToggle(course.id)} className="rounded-lg cursor-pointer py-2 text-xs font-semibold gap-2">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  {course.isPublished ? "Revert to Draft" : "Publish Live"}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-muted" />
                <DropdownMenuItem onClick={() => onStartDelete(course)} className="rounded-lg cursor-pointer py-2 text-xs font-semibold text-destructive focus:bg-destructive/5 dark:focus:bg-destructive/15 gap-2">
                  <Trash2 className="w-4 h-4 text-destructive" /> Delete Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Status Badge bottom-left overlay */}
        <div className="absolute left-3 bottom-3">
          <Badge className={cn(
            "rounded-lg border px-2.5 py-0.5 text-[9px] font-bold tracking-wide uppercase shadow-sm border-none text-white",
            course.isPublished
              ? "bg-emerald-500 hover:bg-emerald-500"
              : "bg-amber-500 hover:bg-amber-500"
          )}>
            {course.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      {/* Title & Description */}
      <CardHeader className="pb-3 pt-4 px-5">
        <CardTitle className="text-lg font-bold line-clamp-1">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs mt-1 min-h-[32px]">
          {course.description}
        </CardDescription>
      </CardHeader>

      {/* Pricing and Stats Flex Row */}
      <CardContent className="px-5 pb-4 flex flex-col justify-end">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mt-1 bg-muted/30 p-2.5 rounded-xl border border-border/50">
          <span>{lessonsCount} {lessonsCount === 1 ? "Lesson" : "Lessons"}</span>
          <span>•</span>
          <span>{studentsCount} {studentsCount === 1 ? "Learner" : "Learners"}</span>
          <span>•</span>
          <span className="text-foreground font-bold">
            {course.price > 0 ? `$${course.price}` : "Free"}
          </span>
        </div>
      </CardContent>

      {/* Redesigned CTA - View Course Button only */}
      <CardFooter className="pt-3 pb-4 px-5 border-t border-border bg-muted/5 flex gap-2">
        <Link href={`/admin/course/${course.id}`} className="w-full">
          <Button
            className="w-full rounded-xl h-9 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
          >
            View Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
