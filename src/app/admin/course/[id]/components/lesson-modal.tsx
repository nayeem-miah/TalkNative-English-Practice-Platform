/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

const lessonSchema = z.object({
  title: z.string().trim().min(1, "Lesson title is required").max(100, "Title is too long"),
  content: z.string().trim().min(1, "Lesson content / description is required"),
  videoUrl: z.string().trim().url("Invalid video URL").optional().or(z.literal("")),
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
    duration: 15,
    order: 1
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (editingLesson) {
        setLessonForm({
          title: editingLesson.title,
          content: editingLesson.content || "",
          videoUrl: editingLesson.videoUrl || "",
          duration: editingLesson.duration || 15,
          order: editingLesson.order || 1
        })
      } else {
        setLessonForm({
          title: "",
          content: "",
          videoUrl: "",
          duration: 15,
          order: defaultOrder
        })
      }
    }
  }, [open, editingLesson, defaultOrder])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = lessonSchema.safeParse({
      ...lessonForm,
      duration: Number(lessonForm.duration),
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
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingLesson ? "Edit Lesson" : "Add New Lesson"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {editingLesson ? "Update this lesson module details below." : "Create a new lesson module for this course."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="lesson-title" className="text-sm font-semibold">Lesson Title *</Label>
            <Input
              id="lesson-title"
              placeholder="e.g. Lesson 1: Introduction to English Sounds"
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lesson-content" className="text-sm font-semibold">Content / Description *</Label>
            <Textarea
              id="lesson-content"
              placeholder="In this lesson, we will cover the core phonetic sounds..."
              value={lessonForm.content}
              onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
              className="rounded-xl min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lesson-video" className="text-sm font-semibold">Video URL (Optional)</Label>
            <Input
              id="lesson-video"
              placeholder="https://youtube.com/example-video"
              value={lessonForm.videoUrl}
              onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-duration" className="text-sm font-semibold">Duration (Minutes)</Label>
              <Input
                id="lesson-duration"
                type="number"
                min="1"
                placeholder="e.g. 15"
                value={lessonForm.duration || ""}
                onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-order" className="text-sm font-semibold">Sort Order</Label>
              <Input
                id="lesson-order"
                type="number"
                min="1"
                placeholder="e.g. 1"
                value={lessonForm.order || ""}
                onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) || 1 })}
                className="h-12 rounded-xl"
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl h-11" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl h-11 px-8 font-semibold shadow-lg hover:shadow-primary/10" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (editingLesson ? "Save Changes" : "Add Lesson")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
