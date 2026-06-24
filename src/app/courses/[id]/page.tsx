/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { useGetCourseByIdQuery } from "@/redux/api/course-api"
import {
  useCreateCheckoutSessionMutation,
  useEnrollFreeMutation
} from "@/redux/api/enrollment-api"
import { getCookie, removeCookie } from "@/utils/cookie"
import { toast } from "sonner"

// Import modular sub-components
import { EnrollmentCard } from "./components/enrollment-card"
import { MarkdownRenderer } from "./components/markdown-renderer"
import { MetadataCard } from "./components/metadata-card"
import { ReviewsTab } from "./components/reviews-tab"
import { SyllabusList } from "./components/syllabus-list"
import { VideoPlayer } from "./components/video-player"

// Reusable states
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingState } from "@/components/ui/loading-state"

interface PageProps {
  params: Promise<{ id: string }>
}

const isTokenExpired = (token: string): boolean => {
  try {
    const payloadPart = token.split(".")[1]
    if (!payloadPart) return true

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload)
    if (!exp) return false

    return exp * 1000 < Date.now()
  } catch (e) {
    return true
  }
}

export function CourseDetailsPage({ params }: PageProps) {
  // Resolve dynamic route params for Next.js 16
  const { id } = React.use(params)

  // API Queries & Mutations
  const { data: courseResponse, isLoading, refetch } = useGetCourseByIdQuery(id)
  const [enrollFree, { isLoading: isEnrollingFree }] = useEnrollFreeMutation()
  const [createCheckoutSession, { isLoading: isCreatingSession }] = useCreateCheckoutSessionMutation()

  const course = courseResponse?.data || courseResponse
  const lessons = course?.lessons || []

  // Component States
  const [selectedLessonId, setSelectedLessonId] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<"about" | "syllabus" | "reviews">("about")
  const [completedLessonIds, setCompletedLessonIds] = React.useState<string[]>([])
  const [mounted, setMounted] = React.useState(false)

  // Auth/User query
  const { data: userResponse } = useGetMeQuery(undefined, { skip: !mounted })
  const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data
  const currentUserId = user?.id || user?._id

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Load from localStorage on mount
  React.useEffect(() => {
    if (mounted && course?.id) {
      try {
        const key = `talknative_completed_${course.id}`
        const saved = localStorage.getItem(key)
        if (saved) {
          setCompletedLessonIds(JSON.parse(saved))
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [mounted, course?.id])

  const sortedLessons = React.useMemo(() => {
    return [...lessons].sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
  }, [lessons])

  const unlockedLessonIds = React.useMemo(() => {
    const unlocked: string[] = []
    sortedLessons.forEach((lesson, index) => {
      if (index === 0) {
        unlocked.push(lesson.id)
      } else {
        const prevLesson = sortedLessons[index - 1]
        if (completedLessonIds.includes(prevLesson.id)) {
          unlocked.push(lesson.id)
        }
      }
    })
    return unlocked
  }, [sortedLessons, completedLessonIds])

  // Derived state: Automatically select active lesson if enrolled
  const activeLesson = React.useMemo(() => {
    if (!course?.isEnrolled || sortedLessons.length === 0) return null
    if (selectedLessonId) {
      return sortedLessons.find((l: any) => l.id === selectedLessonId) || sortedLessons[0]
    }
    return sortedLessons[0]
  }, [sortedLessons, selectedLessonId, course?.isEnrolled])

  const activeLessonIndex = sortedLessons.findIndex((l: any) => l.id === activeLesson?.id)
  const nextLesson = activeLessonIndex !== -1 && activeLessonIndex < sortedLessons.length - 1
    ? sortedLessons[activeLessonIndex + 1]
    : null

  const handleNextLesson = () => {
    if (!activeLesson) return
    const newCompleted = [...completedLessonIds]
    if (!newCompleted.includes(activeLesson.id)) {
      newCompleted.push(activeLesson.id)
      setCompletedLessonIds(newCompleted)
      try {
        localStorage.setItem(`talknative_completed_${course.id}`, JSON.stringify(newCompleted))
      } catch (e) {
        console.error(e)
      }
    }
    if (nextLesson) {
      setSelectedLessonId(nextLesson.id)
      toast.success("Lesson completed! Loading next video...")
    }
  }

  const handleFinishCourse = () => {
    if (!activeLesson) return
    const newCompleted = [...completedLessonIds]
    if (!newCompleted.includes(activeLesson.id)) {
      newCompleted.push(activeLesson.id)
      setCompletedLessonIds(newCompleted)
      try {
        localStorage.setItem(`talknative_completed_${course.id}`, JSON.stringify(newCompleted))
      } catch (e) {
        console.error(e)
      }
    }
    toast.success("Congratulations! You have completed this course! 🎉")
  }

  if (isLoading) {
    return <LoadingState message="Loading course details..." className="min-h-screen" />
  }

  if (!course) {
    return (
      <EmptyState
        title="Course Not Found"
        description="The course you are looking for does not exist or has been deleted."
        actionLabel="Back to Courses"
        actionHref="/courses"
        className="min-h-screen"
      />
    )
  }

  const lessonsCount = lessons.length
  const totalDuration = lessons.reduce((acc: number, l: any) => acc + (l.duration || 0), 0)

  // Helper: Format duration
  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  // Handle Enrollment action
  const handleEnrollment = async () => {
    const token = getCookie("accessToken_js") || getCookie("accessToken") || (typeof window !== "undefined" ? localStorage.getItem("accessToken") : "")

    if (!token || isTokenExpired(token)) {
      toast.info("Please login to enroll in this course.")
      // Clear expired credentials
      removeCookie("accessToken")
      removeCookie("accessToken_js")
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
        } catch (e) {}
      }
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      return
    }

    if (course.isEnrolled) return

    if (course.price === 0 || course.type === "FREE") {
      try {
        await enrollFree({ courseId: course.id }).unwrap()
        toast.success(`Successfully enrolled in ${course.title}!`)
        refetch()
      } catch (err: any) {
        if (err?.status === 401 || err?.data?.message === "jwt expired") {
          toast.error("Your session has expired. Redirecting to login...")
          removeCookie("accessToken")
          removeCookie("accessToken_js")
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("accessToken")
              localStorage.removeItem("refreshToken")
            } catch (e) {}
          }
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        } else {
          toast.error(err?.data?.message || "Failed to enroll.")
        }
      }
    } else {
      try {
        const response = await createCheckoutSession({ courseId: course.id }).unwrap()
        if (response?.data?.checkoutUrl) {
          window.location.href = response.data.checkoutUrl
        } else {
          toast.error("Checkout URL not received.")
        }
      } catch (err: any) {
        if (err?.status === 401 || err?.data?.message === "jwt expired") {
          toast.error("Your session has expired. Redirecting to login...")
          removeCookie("accessToken")
          removeCookie("accessToken_js")
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("accessToken")
              localStorage.removeItem("refreshToken")
            } catch (e) {}
          }
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        } else {
          toast.error(err?.data?.message || "Failed to start checkout.")
        }
      }
    }
  }

  const levelColors: Record<string, string> = {
    BEGINNER: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
    INTERMEDIATE: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    ADVANCED: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
  }
  const levelColor = levelColors[course.level?.toUpperCase()] || "bg-muted text-muted-foreground border-transparent"

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* Top Banner */}
      <div className="bg-muted/30 border-b border-border/60 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/courses" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={cn("rounded-lg border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider", levelColor)}>
                  {course.level}
                </Badge>
                <Badge variant="outline" className="rounded-lg border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-primary/5 text-primary border-primary/20">
                  {course.type || "FREE"}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground font-semibold">
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-muted-foreground/60" /> {lessonsCount} Lessons</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-muted-foreground/60" /> {formatDuration(totalDuration)} Total Duration</span>
                {course.averageRating > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-500 font-extrabold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {course.averageRating.toFixed(1)} ({course.totalReviews || 0})
                    </span>
                  </>
                )}
                {course.isEnrolled && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold"><CheckCircle2 className="w-4 h-4 fill-emerald-500/10" /> Enrolled</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column: Player & Syllabus */}
          <div className="lg:col-span-2 space-y-6">

            {/* Video Player */}
            <VideoPlayer
              isEnrolled={!!course.isEnrolled}
              thumbnail={course.thumbnail}
              courseTitle={course.title}
              activeVideoUrl={activeLesson?.videoUrl}
              activeVideoTitle={activeLesson?.title}
              onEnrollClick={handleEnrollment}
            />

            {/* If enrolled: Display Active Lesson Meta */}
            {course.isEnrolled && activeLesson && (
              <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-primary/5 text-primary border-primary/20">
                    Active Lesson • Order {activeLesson.order}
                  </Badge>
                  <span className="text-xs font-bold text-muted-foreground/80 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {activeLesson.duration} mins
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-foreground tracking-tight">
                  {activeLesson.title}
                </h3>
                {activeLesson.content && (
                  <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium pt-1">
                    {activeLesson.content}
                  </p>
                )}

                {/* Complete & Next Button */}
                <div className="pt-4 flex justify-end border-t border-border/50 mt-3">
                  {nextLesson ? (
                    <Button
                      onClick={handleNextLesson}
                      className="rounded-xl h-10 px-5 text-xs font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm flex items-center"
                    >
                      Complete & Next Lesson
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {completedLessonIds.includes(activeLesson.id) ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/10" />
                          Course Completed! 🎉
                        </Badge>
                      ) : (
                        <Button
                          onClick={handleFinishCourse}
                          className="rounded-xl h-10 px-5 text-xs font-bold gap-1 bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-sm flex items-center"
                        >
                          Complete Course
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="space-y-4">
              <div className="flex border-b border-border/60 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab("about")}
                  className={cn(
                    "pb-3 text-xs font-extrabold uppercase tracking-wider border-b-2 px-4 transition-all whitespace-nowrap",
                    activeTab === "about"
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  About Course
                </button>
                <button
                  onClick={() => setActiveTab("syllabus")}
                  className={cn(
                    "pb-3 text-xs font-extrabold uppercase tracking-wider border-b-2 px-4 transition-all whitespace-nowrap",
                    activeTab === "syllabus"
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Syllabus ({lessonsCount})
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={cn(
                    "pb-3 text-xs font-extrabold uppercase tracking-wider border-b-2 px-4 transition-all whitespace-nowrap",
                    activeTab === "reviews"
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Reviews ({course.totalReviews || 0})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="bg-card border border-border/80 p-6 rounded-2xl shadow-sm">
                {activeTab === "about" ? (
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-foreground tracking-tight mb-4">Course Details</h3>
                    <MarkdownRenderer content={course.description} />
                  </div>
                ) : activeTab === "syllabus" ? (
                  <div className="space-y-4">
                    <h3 className="text-base font-extrabold text-foreground tracking-tight mb-4">Course Lessons</h3>
                    <SyllabusList
                      lessons={sortedLessons}
                      isEnrolled={!!course.isEnrolled}
                      activeLessonId={activeLesson?.id}
                      onLessonClick={setSelectedLessonId}
                      unlockedLessonIds={unlockedLessonIds}
                    />
                  </div>
                ) : (
                  <ReviewsTab
                    courseId={course.id}
                    reviews={course.reviews || []}
                    averageRating={course.averageRating || 0}
                    totalReviews={course.totalReviews || 0}
                    isEnrolled={!!course.isEnrolled}
                    currentUserId={currentUserId}
                  />
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Enrollment Card & Details */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">

            {/* Enrollment Action Card */}
            <EnrollmentCard
              price={course.price}
              type={course.type}
              isEnrolled={!!course.isEnrolled}
              isEnrolling={isEnrollingFree || isCreatingSession}
              onEnroll={handleEnrollment}
            />

            {/* Sidebar Details Info Card */}
            <MetadataCard
              level={course.level}
              lessonsCount={lessonsCount}
              updatedAt={course.updatedAt}
            />

          </div>

        </div>
      </div>

    </div>
  )
}

export default CourseDetailsPage
