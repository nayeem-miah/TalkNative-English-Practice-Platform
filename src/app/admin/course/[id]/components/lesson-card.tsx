/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Clock, Edit, GripVertical, PlayCircle, Trash2 } from "lucide-react"

interface LessonCardProps {
  lesson: any
  index: number
  onEdit: (lesson: any) => void
  onDelete: (id: string) => void
  onWatchVideo: (url: string) => void
}

export function LessonCard({ lesson, index, onEdit, onDelete, onWatchVideo }: LessonCardProps) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing p-1">
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-lg">
          {lesson.order || index + 1}
        </div>
        <div>
          <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {lesson.title}
          </h4>
          {lesson.content && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5 max-w-xl">
              {lesson.content}
            </p>
          )}
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-4 h-4 text-muted-foreground" /> {lesson.duration || 0} mins
            </span>
            {lesson.videoUrl && (
              <button
                type="button"
                onClick={() => onWatchVideo(lesson.videoUrl)}
                className="flex items-center gap-1 text-primary hover:text-primary/95 text-[11px] font-bold bg-primary/10 hover:bg-primary/15 px-2 py-0.5 rounded-md border border-primary/20 transition-all cursor-pointer shadow-sm select-none"
              >
                <PlayCircle className="w-3.5 h-3.5" /> Watch Video
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-12 sm:pl-0">
        <Button
          onClick={() => onEdit(lesson)}
          variant="outline"
          size="sm"
          className="h-9 rounded-lg border-border/50 font-semibold"
        >
          <Edit className="w-4 h-4 mr-2 text-muted-foreground" /> Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(lesson.id)}
          className="h-9 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
