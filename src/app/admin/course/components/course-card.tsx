"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Edit, ExternalLink, Trash2, MoreVertical, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
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
  const progressVal = course.progress ?? 0
  const formattedUpdatedDate = course.updatedAt ? new Date(course.updatedAt).toISOString().split("T")[0] : ""

  return (
    <Card className="overflow-hidden border border-border shadow-sm flex flex-col rounded-2xl bg-card relative">
      {/* Card Header Media & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={thumbnailSrc}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        
        {/* Badge Overlay */}
        <div className="absolute inset-0 p-3 flex justify-between items-start bg-black/30">
          {/* Level Badge */}
          <Badge className="rounded-lg border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-background text-foreground border-border">
            {course.level}
          </Badge>

          {/* Status Badge */}
          <Badge className={cn(
            "rounded-lg border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
            course.isPublished ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/40" : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/40"
          )}>
            {course.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>

        {/* Action Dropdown Menu */}
        <div className="absolute right-3 bottom-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 rounded-xl bg-background hover:bg-muted text-foreground flex items-center justify-center shadow-md cursor-pointer border border-border focus:outline-none">
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

      {/* Title & Description */}
      <CardHeader className="pb-3 pt-4 px-5">
        <CardTitle className="text-lg font-bold line-clamp-1">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs mt-1 min-h-[32px]">
          {course.description}
        </CardDescription>
      </CardHeader>

      {/* Pricing and Stats Grid */}
      <CardContent className="px-5 pb-4 flex-grow flex flex-col justify-end">
        <div className="grid grid-cols-3 gap-2 text-center bg-muted/30 p-2.5 rounded-xl border border-border text-xs mb-4">
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase">Lessons</p>
            <p className="font-bold text-foreground mt-0.5">{lessonsCount}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase">Learners</p>
            <p className="font-bold text-foreground mt-0.5">{studentsCount}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase">Price</p>
            <p className="font-bold text-foreground mt-0.5">
              {course.price > 0 ? `$${course.price}` : "Free"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 bg-muted/20 p-2 rounded-xl border border-border/50">
          <div className="flex justify-between items-center text-[10px] font-medium">
            <span className="text-muted-foreground">Class Progress Avg</span>
            <span className="font-bold text-foreground">{progressVal}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${progressVal}%` }}
            />
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 mt-3.5">
          <Globe className="w-3 h-3 text-muted-foreground" /> Last Updated: {formattedUpdatedDate}
        </p>
      </CardContent>

      {/* Redesigned CTAs */}
      <CardFooter className="pt-3 pb-4 px-5 border-t border-border bg-muted/5 flex gap-2">
        <Link href={`/admin/course/${course.id}`} className="flex-1">
          <Button variant="outline" className="w-full rounded-xl h-9 text-xs font-bold border-border hover:bg-muted">
            Manage Lessons
          </Button>
        </Link>
        <Button 
          onClick={() => onStartEdit(course)} 
          variant="ghost" 
          className="flex-1 rounded-xl h-9 text-xs font-bold border border-border text-foreground hover:bg-muted"
        >
          View Course
        </Button>
      </CardFooter>
    </Card>
  )
}
