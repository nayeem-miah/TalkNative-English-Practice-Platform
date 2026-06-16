/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ArrowLeft, Clock, Edit, GripVertical, PlayCircle, Plus, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { useGetCourseByIdQuery } from "@/redux/api/course-api"
import {
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useGetLessonsByCourseQuery,
  useUpdateLessonMutation
} from "@/redux/api/lesson-api"
import { CourseUpdateModal } from "../components/course-update-modal"

export default function CourseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  // API Queries and Mutations
  const { data: courseResponse, isLoading: isCourseLoading, error: courseError } = useGetCourseByIdQuery(courseId)
  const { data: lessonsResponse, isLoading: isLessonsLoading } = useGetLessonsByCourseQuery(courseId)

  const [createLesson] = useCreateLessonMutation()
  const [updateLesson] = useUpdateLessonMutation()
  const [deleteLesson] = useDeleteLessonMutation()

  const course = courseResponse?.data
  const lessons = lessonsResponse?.data || []

  // Modals & form state
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false)
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<any | null>(null) // null = creating
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    duration: 15,
    order: 1
  })

  const handleOpenAddLesson = () => {
    setEditingLesson(null)
    setLessonForm({
      title: "",
      content: "",
      videoUrl: "",
      duration: 15,
      order: lessons.length + 1
    })
    setIsLessonModalOpen(true)
  }

  const handleOpenEditLesson = (lesson: any) => {
    setEditingLesson(lesson)
    setLessonForm({
      title: lesson.title,
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || 0,
      order: lesson.order || 1
    })
    setIsLessonModalOpen(true)
  }

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lessonForm.title.trim()) {
      toast.error("Lesson title is required")
      return
    }
    if (!lessonForm.content.trim()) {
      toast.error("Lesson content / description is required")
      return
    }

    try {
      if (editingLesson) {
        // Update lesson
        await updateLesson({
          id: editingLesson.id,
          title: lessonForm.title,
          content: lessonForm.content,
          videoUrl: lessonForm.videoUrl,
          duration: Number(lessonForm.duration) || 0,
          order: Number(lessonForm.order) || 1
        }).unwrap()
        toast.success("Lesson updated successfully!")
      } else {
        // Create lesson
        await createLesson({
          courseId,
          title: lessonForm.title,
          content: lessonForm.content,
          videoUrl: lessonForm.videoUrl,
          duration: Number(lessonForm.duration) || 0,
          order: Number(lessonForm.order) || 1
        }).unwrap()
        toast.success("Lesson created successfully!")
      }
      setIsLessonModalOpen(false)
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save lesson.")
    }
  }

  const handleDeleteLesson = async (id: string) => {
    if (confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) {
      try {
        await deleteLesson(id).unwrap()
        toast.success("Lesson deleted successfully!")
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete lesson.")
      }
    }
  }

  // Sort lessons by their order
  const sortedLessons = [...lessons].sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

  if (isCourseLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 min-h-[400px]">
        <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        <p className="text-muted-foreground font-semibold mt-4">Loading course details...</p>
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4 min-h-[400px] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-destructive">Course Not Found</h2>
        <p className="text-muted-foreground">The course you are looking for does not exist or has been deleted.</p>
        <Button onClick={() => router.push('/admin/course')} className="rounded-xl">
          Back to Course List
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/course')}
            className="text-muted-foreground hover:text-primary -ml-2 h-8 px-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Button>

          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{course.title}</h1>
              <Badge
                className={cn(
                  "rounded-full px-3 text-white border-none select-none font-bold text-[10px] tracking-wide uppercase",
                  course.isPublished ? "bg-emerald-500 hover:bg-emerald-500" : "bg-amber-500 hover:bg-amber-500"
                )}
              >
                {course.isPublished ? "Published" : "Draft"}
              </Badge>
              <Badge className="rounded-full px-3 border border-border bg-background text-foreground text-[10px] font-bold tracking-wide uppercase select-none">
                {course.level}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-3xl text-base">{course.description}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setIsEditCourseModalOpen(true)}
            variant="outline"
            className="rounded-xl h-11 px-6 shadow-sm border-border/50 font-semibold"
          >
            <Edit className="w-4 h-4 mr-2 text-muted-foreground" /> Edit Course
          </Button>

          <CourseUpdateModal
            open={isEditCourseModalOpen}
            onOpenChange={setIsEditCourseModalOpen}
            course={course}
          />
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Lessons Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Course Lessons</h2>
            <p className="text-muted-foreground mt-1">Manage and organize the curriculum for this course.</p>
          </div>

          <Button
            onClick={handleOpenAddLesson}
            className="gap-2 shadow-lg hover:shadow-primary/25 transition-all text-base h-11 px-6 rounded-xl font-semibold"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Lesson
          </Button>
        </div>

        {/* Lesson List */}
        <div className="space-y-3">
          {isLessonsLoading ? (
            <div className="flex flex-col items-center justify-center p-16 border rounded-3xl bg-muted/5 border-border/40 min-h-[200px]">
              <div className="h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <p className="text-muted-foreground text-sm font-semibold mt-3">Loading lessons...</p>
            </div>
          ) : sortedLessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl bg-muted/20 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <PlayCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">No lessons yet</h3>
              <p className="text-muted-foreground mb-6">Start building your course curriculum by adding the first lesson.</p>
              <Button onClick={handleOpenAddLesson} className="rounded-xl">Add First Lesson</Button>
            </div>
          ) : (
            sortedLessons.map((lesson: any, index: number) => (
              <div
                key={lesson.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing p-1">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className=" w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-lg">
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
                        <span className="text-primary/80 text-xs font-semibold bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                          Video Lesson
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-12 sm:pl-0">
                  <Button
                    onClick={() => handleOpenEditLesson(lesson)}
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-lg border-border/50 font-semibold"
                  >
                    <Edit className="w-4 h-4 mr-2 text-muted-foreground" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="h-9 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Unified Lesson Dialog (Create / Edit) */}
      <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingLesson ? "Edit Lesson" : "Add New Lesson"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingLesson ? "Update this lesson module details below." : "Create a new lesson module for this course."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveLesson} className="grid gap-5 py-2">
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
              <Button type="button" variant="outline" onClick={() => setIsLessonModalOpen(false)} className="rounded-xl h-11">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl h-11 px-8 font-semibold shadow-lg hover:shadow-primary/10">
                {editingLesson ? "Save Changes" : "Add Lesson"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
