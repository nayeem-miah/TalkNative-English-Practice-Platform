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

// Extractor function for YouTube Video ID
const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export function LessonCard({ lesson, index, onEdit, onDelete, onWatchVideo }: LessonCardProps) {
  const youtubeId = getYoutubeId(lesson.videoUrl);

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Grip Handle with Hover Feedback */}
        <div className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing hover:bg-muted p-1.5 rounded-lg transition-colors select-none shrink-0">
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Lesson Index Badge */}
        <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-sm shrink-0 select-none">
          {lesson.order || index + 1}
        </div>

        {/* Inline YouTube Thumbnail Preview */}
        {youtubeId ? (
          <div 
            onClick={() => onWatchVideo(lesson.videoUrl)}
            className="relative w-20 h-12 sm:w-24 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-border/80 shadow-sm group/thumb cursor-pointer select-none transition-transform active:scale-95"
            title="Watch Inline Preview"
          >
            <img 
              src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} 
              alt="Lesson thumbnail" 
              className="w-full h-full object-cover transition-transform group-hover/thumb:scale-105" 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity opacity-85 group-hover/thumb:opacity-100">
              <PlayCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        ) : (
          <div className="w-20 h-12 sm:w-24 sm:h-14 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border/50 select-none">
            <PlayCircle className="w-5 h-5 text-muted-foreground/40" />
          </div>
        )}

        {/* Content Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors truncate">
            {lesson.title}
          </h4>
          {lesson.content && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-xl">
              {lesson.content}
            </p>
          )}
          <div className="flex items-center gap-4 mt-1 text-[11px] font-semibold text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" /> {lesson.duration || 0} mins
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons with CSS Tooltips */}
      <div className="flex items-center gap-2 pl-12 sm:pl-0 shrink-0">
        <div className="relative group/tooltip">
          <Button
            onClick={() => onEdit(lesson)}
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-xl border-border/50 hover:bg-muted font-semibold flex items-center justify-center cursor-pointer"
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[9px] font-bold text-white bg-zinc-950 dark:bg-zinc-800 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-md z-30">
            Edit Lesson
          </span>
        </div>

        <div className="relative group/tooltip">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(lesson.id)}
            className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center justify-center cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[9px] font-bold text-white bg-rose-600 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap shadow-md z-30">
            Delete Lesson
          </span>
        </div>
      </div>
    </div>
  )
}
