/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft, Edit, PlayCircle, Plus } from "lucide-react"
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

// Local modular components
import { LessonCard } from "./components/lesson-card"
import { LessonModal } from "./components/lesson-modal"
import { MarkdownRenderer } from "./components/markdown-renderer"
import { VideoPlayerModal } from "./components/video-player-modal"

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

  // Modals & local state
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false)
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<any | null>(null) // null = creating
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null)
  const [isDescExpanded, setIsDescExpanded] = useState(false)

  const handleOpenAddLesson = () => {
    setEditingLesson(null)
    setIsLessonModalOpen(true)
  }

  const handleOpenEditLesson = (lesson: any) => {
    setEditingLesson(lesson)
    setIsLessonModalOpen(true)
  }

  const handleSaveLesson = async (payload: any) => {
    try {
      if (editingLesson) {
        await updateLesson({
          id: editingLesson.id,
          ...payload,
        }).unwrap()
        toast.success("Lesson updated successfully!")
      } else {
        await createLesson({
          courseId,
          ...payload,
        }).unwrap()
        toast.success("Lesson created successfully!")
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save lesson.")
      throw err // propagate to reject close modal if failed
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
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/course')}
          className="text-muted-foreground hover:text-primary -ml-2 h-8 px-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
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
            <Badge
              className={cn(
                "rounded-full px-3 text-white border-none select-none font-bold text-[10px] tracking-wide uppercase",
                course.type === "PAID" || (course.type as string) === "PREMIUM" ? "bg-indigo-600 hover:bg-indigo-600" : "bg-emerald-600 hover:bg-emerald-600"
              )}
            >
              {course.type || "FREE"}
            </Badge>
          </div>

          <div className="flex gap-3 shrink-0">
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
      </div>

      {/* Description Section (Full Width) */}
      <div className="border border-border/50 bg-card p-6 rounded-2xl shadow-sm relative">
        <div className={cn(
          "transition-all duration-300",
          !isDescExpanded && course.description && course.description.length > 250
            ? "max-h-24 overflow-hidden pb-8"
            : "max-h-[3000px]"
        )}>
          <MarkdownRenderer text={course.description || ""} />
        </div>

        {course.description && course.description.length > 250 && (
          <div className={cn(
            "flex justify-center",
            !isDescExpanded
              ? "absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card via-card/95 to-transparent flex items-end pb-3"
              : "mt-4"
          )}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="h-8 rounded-lg text-xs font-semibold px-4 border-border hover:bg-muted bg-background/90 text-foreground shadow-sm transition-all"
            >
              {isDescExpanded ? "Read Less" : "Read More"}
            </Button>
          </div>
        )}
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
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                onEdit={handleOpenEditLesson}
                onDelete={handleDeleteLesson}
                onWatchVideo={setActiveVideoUrl}
              />
            ))
          )}
        </div>
      </div>

      {/* Unified Lesson Dialog (Create / Edit) */}
      <LessonModal
        open={isLessonModalOpen}
        onOpenChange={setIsLessonModalOpen}
        editingLesson={editingLesson}
        courseId={courseId}
        defaultOrder={lessons.length + 1}
        onSave={handleSaveLesson}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        open={!!activeVideoUrl}
        onOpenChange={(open) => !open && setActiveVideoUrl(null)}
        videoUrl={activeVideoUrl}
      />
    </div>
  )
}
