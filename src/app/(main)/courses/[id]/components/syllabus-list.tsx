import * as React from "react"
import { Clock, Play, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  title: string
  duration: number
  order: number
}

interface SyllabusListProps {
  lessons: Lesson[]
  isEnrolled: boolean
  activeLessonId?: string
  onLessonClick: (lessonId: string) => void
  unlockedLessonIds?: string[]
}

export function SyllabusList({
  lessons,
  isEnrolled,
  activeLessonId,
  onLessonClick,
  unlockedLessonIds,
}: SyllabusListProps) {
  if (lessons.length === 0) {
    return <p className="text-xs text-muted-foreground italic">No lessons have been added to this course yet.</p>
  }

  return (
    <div className="space-y-2.5">
      {lessons.map((lesson) => {
        const isCurrent = activeLessonId === lesson.id
        const isUnlocked = !isEnrolled 
          ? false 
          : (unlockedLessonIds ? unlockedLessonIds.includes(lesson.id) : true)

        return (
          <div
            key={lesson.id}
            onClick={() => {
              if (isUnlocked) {
                onLessonClick(lesson.id)
              }
            }}
            className={cn(
              "flex items-center justify-between p-3.5 rounded-xl border transition-all",
              isUnlocked ? "cursor-pointer" : "opacity-75 cursor-not-allowed",
              isUnlocked && isCurrent
                ? "bg-primary/5 border-primary text-primary"
                : "border-border/60 hover:bg-muted/30"
            )}
          >
            <div className="flex items-center gap-3.5">
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black border",
                isCurrent && isUnlocked
                  ? "bg-primary text-primary-foreground border-none"
                  : "bg-muted text-muted-foreground border-border/60"
              )}>
                {lesson.order}
              </div>
              <div className="space-y-0.5">
                <p className={cn("text-xs font-extrabold leading-tight", isCurrent && isUnlocked ? "text-primary" : "text-foreground")}>
                  {lesson.title}
                </p>
                <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lesson.duration} mins
                </span>
              </div>
            </div>
            
            <div>
              {isUnlocked ? (
                <Play className={cn("w-4 h-4", isCurrent ? "text-primary animate-pulse" : "text-muted-foreground/60")} />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground/60" />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
