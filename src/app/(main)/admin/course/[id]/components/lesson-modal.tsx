/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

// Custom SVG YouTube icon as brand icons were removed in Lucide v1.x
const Youtube = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
)

const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/

// Extractor function for YouTube Video ID
const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const lessonSchema = z.object({
  title: z.string().trim().min(1, "Lesson title is required").max(100, "Title is too long"),
  content: z.string().trim().min(1, "Lesson content / description is required").max(500, "Content cannot exceed 500 characters"),
  videoUrl: z.string().trim().optional()
    .refine(val => !val || youtubeRegex.test(val), {
      message: "Must be a valid YouTube URL (e.g. https://www.youtube.com/watch?v=...)"
    }),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  order: z.number().min(1, "Sort order must be at least 1"),
})

interface LessonModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingLesson: any | null
  courseId: string
  defaultOrder: number
  onSave: (payload: any) => Promise<void>
}

export function LessonModal({ open, onOpenChange, editingLesson, defaultOrder, onSave }: LessonModalProps) {
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    order: 1
  })

  // Separate hours/minutes duration states
  const [durationHours, setDurationHours] = useState(0)
  const [durationMinutes, setDurationMinutes] = useState(15)

  // Real-time video validation states
  const [videoUrlError, setVideoUrlError] = useState("")

  const handleHoursChange = (val: string) => {
    const digits = val.replace(/\D/g, "")
    setDurationHours(digits ? parseInt(digits) : 0)
  }

  const handleMinutesChange = (val: string) => {
    const digits = val.replace(/\D/g, "")
    const numeric = digits ? parseInt(digits) : 0
    setDurationMinutes(Math.min(59, numeric))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Options for insert position dropdown
  const maxOrder = editingLesson ? Math.max(defaultOrder - 1, 1) : defaultOrder
  const orderOptions = Array.from({ length: maxOrder }, (_, i) => i + 1)

  const youtubeId = getYoutubeId(lessonForm.videoUrl)

  useEffect(() => {
    if (open) {
      setVideoUrlError("")
      if (editingLesson) {
        setLessonForm({
          title: editingLesson.title,
          content: editingLesson.content || "",
          videoUrl: editingLesson.videoUrl || "",
          order: editingLesson.order || 1
        })
        const totalMins = editingLesson.duration || 15
        setDurationHours(Math.floor(totalMins / 60))
        setDurationMinutes(totalMins % 60)

        // Validate initial video URL if any
        if (editingLesson.videoUrl && !youtubeRegex.test(editingLesson.videoUrl)) {
          setVideoUrlError("Please enter a valid YouTube URL")
        }
      } else {
        setLessonForm({
          title: "",
          content: "",
          videoUrl: "",
          order: defaultOrder
        })
        setDurationHours(0)
        setDurationMinutes(15)
      }
    }
  }, [open, editingLesson, defaultOrder])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const totalDuration = durationHours * 60 + durationMinutes

    const result = lessonSchema.safeParse({
      ...lessonForm,
      duration: totalDuration,
      order: Number(lessonForm.order),
    })

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Validation failed"
      toast.error(firstError)
      return
    }

    try {
      setIsSubmitting(true)
      await onSave(result.data)
      onOpenChange(false)
    } catch {
      // Errors handled by parent component's toast notifications
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-2xl bg-card border border-border p-6 shadow-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-extrabold tracking-tight">
            {editingLesson ? "Edit Lesson" : "Add New Lesson"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-medium">
            {editingLesson ? "Update this lesson module details below." : "Create a new lesson module for this course."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-5 py-2">
          {/* Title - Required */}
          <div className="space-y-2">
            <Label htmlFor="lesson-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Lesson Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="lesson-title"
              placeholder="e.g. Lesson 1: Introduction to English Sounds"
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              className="h-12 rounded-xl border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-sm font-semibold"
              required
            />
          </div>

          {/* Description - Required */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="lesson-content" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Content / Description <span className="text-rose-500">*</span>
              </Label>
              <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1", lessonForm.content.length > 500 ? "text-rose-500" : "text-muted-foreground/60")}>
                {lessonForm.content.length} / 500 chars
              </span>
            </div>
            <Textarea
              id="lesson-content"
              placeholder="In this lesson, we will cover the core phonetic sounds..."
              value={lessonForm.content}
              onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
              maxLength={500}
              className="rounded-xl min-h-[90px] border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-xs leading-relaxed font-semibold"
              required
            />
          </div>

          {/* YouTube Video URL - Optional */}
          <div className="space-y-2">
            <Label htmlFor="lesson-video" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              YouTube Video URL (Optional)
            </Label>
            <div className="relative">
              <Youtube className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors", youtubeId && !videoUrlError ? "text-rose-600" : "text-muted-foreground/50")} />
              <Input
                id="lesson-video"
                placeholder="e.g. https://www.youtube.com/watch?v=example"
                value={lessonForm.videoUrl}
                onChange={(e) => {
                  const val = e.target.value
                  setLessonForm(prev => ({ ...prev, videoUrl: val }))
                  if (!val) {
                    setVideoUrlError("")
                  } else if (!youtubeRegex.test(val)) {
                    setVideoUrlError("Please enter a valid YouTube URL")
                  } else {
                    setVideoUrlError("")
                  }
                }}
                className={cn(
                  "h-12 pl-11 rounded-xl border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-sm font-semibold",
                  videoUrlError && "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive"
                )}
              />
            </div>
            {videoUrlError && (
              <p className="text-[10px] font-bold text-destructive mt-1.5 px-1 animate-in slide-in-from-top-1 duration-200">
                {videoUrlError}
              </p>
            )}

            {/* Real-time Video Thumbnail Preview */}
            {youtubeId && !videoUrlError && (
              <div className="mt-3 p-3 rounded-xl border border-border/80 bg-muted/10 flex gap-3.5 items-center animate-in fade-in duration-300">
                <div className="relative w-24 h-14 rounded-lg overflow-hidden shrink-0 border border-border shadow-sm">
                  <Image
                  width={120}
                  height={60}
                    src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                    alt="YouTube Video Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <PlayCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">YouTube Video Preview</p>
                  <p className="text-xs font-semibold text-foreground truncate mt-1">Video ID: {youtubeId}</p>
                  <a
                    href={lessonForm.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-primary hover:underline font-bold mt-1 block"
                  >
                    Open Video Link &rarr;
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Duration & Insert Position */}
          <div className="grid grid-cols-2 gap-6 items-start">
            {/* Split Duration: Hours and Minutes in clean flex inline layout */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Duration <span className="text-rose-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={durationHours || ""}
                  onChange={(e) => handleHoursChange(e.target.value)}
                  className="h-12 w-20 text-center font-bold text-xs rounded-xl border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
                />
                <span className="text-xs font-bold text-muted-foreground/60 select-none">:</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="15"
                  value={durationMinutes || ""}
                  onChange={(e) => handleMinutesChange(e.target.value)}
                  className="h-12 w-20 text-center font-bold text-xs rounded-xl border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
                />
              </div>
              <p className="text-[10px] text-muted-foreground/80 font-bold mt-1.5 px-0.5 select-none leading-none">
                {durationHours} hrs {durationMinutes} mins total
              </p>
            </div>

            {/* Position insert select dropdown */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Insert Position <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={lessonForm.order.toString()}
                onValueChange={(val) => setLessonForm({ ...lessonForm, order: val ? (parseInt(val) || 1) : 1 })}
              >
                <SelectTrigger className="h-12 rounded-xl border border-border bg-background w-full cursor-pointer focus-visible:ring-0 text-xs font-bold">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border bg-card z-[60] max-h-48">
                  {orderOptions.map((opt) => (
                    <SelectItem key={opt} value={opt.toString()}>
                      Position {opt} {opt === maxOrder && !editingLesson ? "(End)" : opt === 1 ? "(Start)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-0 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-11 font-bold text-xs cursor-pointer bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl h-11 px-8 font-bold text-xs shadow-md shadow-primary/10 hover:shadow-primary/20 cursor-pointer flex items-center justify-center gap-1.5"
              disabled={isSubmitting || !!videoUrlError}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingLesson ? "Save Changes" : "Add Lesson"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
