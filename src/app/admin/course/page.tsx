/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { BookOpen, Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"

// Modular Sub-components
import { CourseCard } from "./components/course-card"
import { CourseCreateModal } from "./components/course-create-modal"
import { CourseUpdateModal } from "./components/course-update-modal"
import { DeleteConfirmModal } from "./components/delete-confirm-modal"
import { FilterBar } from "./components/filter-bar"
import { StatsOverview } from "./components/stats-overview"
import { Course } from "./types"

// RTK Query API Hooks
import {
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation
} from "@/redux/api/course-api"
import { LoadingState } from "@/components/ui/loading-state"
import { EmptyState } from "@/components/ui/empty-state"

export default function AdminCoursePage() {
  // RTK Query hooks
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [levelFilter, setLevelFilter] = useState("ALL")
  const [sortBy, setSortBy] = useState("NEWEST")

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 6

  // Reset page to 1 on filter/sort changes
  const handleSetSearchTerm = (val: string) => {
    setSearchTerm(val)
    setCurrentPage(1)
  }
  const handleSetStatusFilter = (val: string) => {
    setStatusFilter(val)
    setCurrentPage(1)
  }
  const handleSetLevelFilter = (val: string) => {
    setLevelFilter(val)
    setCurrentPage(1)
  }
  const handleSetSortBy = (val: string) => {
    setSortBy(val)
    setCurrentPage(1)
  }

  // Fetch paginated courses list
  const { data: coursesResponse, isLoading } = useGetCoursesQuery({
    page: currentPage,
    limit: limit,
    level: levelFilter,
    searchTerm: searchTerm
  })


  const [updateCourse] = useUpdateCourseMutation()
  const [deleteCourse] = useDeleteCourseMutation()

  // Modals & Popups state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState<Course | null>(null)

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)


  // Course data (Paginated Page)
  const courses: Course[] = coursesResponse?.data || []

  // Global Statistics from backend
  const stats = coursesResponse?.stats
  const totalCoursesCount = coursesResponse?.meta?.total ?? 0
  const totalCourses = stats?.totalCourses ?? 0
  const publishedCourses = stats?.publishedCourses ?? 0
  const draftCourses = stats?.draftCourses ?? 0
  const totalStudents = stats?.totalStudents ?? 0
  const totalRevenue = stats?.totalRevenue ?? 0



  const handleStartCreate = () => {
    setIsCreateOpen(true)
  }

  const handleStartEdit = (course: Course) => {
    setSelectedCourseForEdit(course)
    setIsUpdateOpen(true)
  }

  const handlePublishToggle = async (courseId: string) => {
    const targetCourse = courses.find(c => c.id === courseId)
    if (!targetCourse) return

    const formData = new FormData()
    formData.append("title", targetCourse.title)
    formData.append("description", targetCourse.description)
    formData.append("level", targetCourse.level)
    formData.append("type", targetCourse.type)
    formData.append("price", targetCourse.price.toString())
    formData.append("isPublished", (!targetCourse.isPublished).toString())

    try {
      await updateCourse({ id: courseId, formData }).unwrap()
      toast.success(`Course status updated.`)
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status.")
    }
  }

  const handleStartDelete = (course: Course) => {
    setCourseToDelete(course)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse(courseToDelete.id).unwrap()
        toast.success(`Course "${courseToDelete.title}" deleted successfully.`)
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete course.")
      }
    }
    setIsDeleteConfirmOpen(false)
    setCourseToDelete(null)
  }

  // Filter & Sort Logic (Local filter on status after fetching)
  const filteredCourses = courses
    .filter(course => {
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && course.isPublished) ||
        (statusFilter === "DRAFT" && !course.isPublished);

      return matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "NEWEST") {
        return (b.updatedAt || "").localeCompare(a.updatedAt || "");
      }
      if (sortBy === "OLDEST") {
        return (a.updatedAt || "").localeCompare(b.updatedAt || "");
      }
      if (sortBy === "MOST_STUDENTS") {
        return (b.studentsCount ?? 0) - (a.studentsCount ?? 0);
      }
      if (sortBy === "HIGHEST_REVENUE") {
        return (b.revenue ?? 0) - (a.revenue ?? 0);
      }
      return 0;
    });

  return (
    <div className="p-6 md:p-8 space-y-8">

      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Course Management
          </h1>
          <p className="text-muted-foreground mt-1 text-base">Create, monitor, and scale English training curriculum.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger render={
            <Button onClick={handleStartCreate} className="gap-2 rounded-xl h-10 px-4 bg-primary text-primary-foreground font-medium">
              <Plus className="w-4 h-4" />
              Create Course
            </Button>
          } />

          <CourseCreateModal
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
          />
        </Dialog>
      </div>

      {/* Summary Statistics Panel */}
      <StatsOverview
        totalCourses={totalCourses}
        publishedCourses={publishedCourses}
        draftCourses={draftCourses}
        totalStudents={totalStudents}
        totalRevenue={totalRevenue}
      />

      {/* Filter and Search Bar Container */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={handleSetSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={handleSetStatusFilter}
        levelFilter={levelFilter}
        setLevelFilter={handleSetLevelFilter}
        sortBy={sortBy}
        setSortBy={handleSetSortBy}
      />

      {/* Redesigned Course Cards Grid */}
      {isLoading ? (
        <LoadingState message="Retrieving courses..." className="border rounded-3xl bg-muted/5 border-border/40 min-h-[300px] p-16" />
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          title="No matches found"
          description="No courses match your active search terms or filtering parameters."
          actionLabel="Reset All Filters"
          onActionClick={() => { handleSetSearchTerm(""); handleSetStatusFilter("ALL"); handleSetLevelFilter("ALL"); }}
          className="border-2 border-dashed rounded-2xl bg-muted/5 border-border text-center min-h-[300px] p-16"
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onStartEdit={handleStartEdit}
                onPublishToggle={handlePublishToggle}
                onStartDelete={handleStartDelete}
              />
            ))}
          </div>

          {/* Premium Pagination controls */}
          {coursesResponse?.meta?.totalPage && coursesResponse.meta.totalPage > 1 && (
            <div className="flex items-center justify-between border-t border-border/40 px-4 py-4 sm:px-6 mt-8">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="rounded-xl"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, coursesResponse.meta.totalPage))}
                  disabled={currentPage === coursesResponse.meta.totalPage}
                  variant="outline"
                  className="rounded-xl"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{(currentPage - 1) * limit + 1}</span> to{" "}
                    <span className="font-semibold text-foreground">
                      {Math.min(currentPage * limit, totalCoursesCount)}
                    </span>{" "}
                    of <span className="font-semibold text-foreground">{totalCoursesCount}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-xl gap-1" aria-label="Pagination">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-xl border-border/50 hover:bg-muted"
                    >
                      <span className="sr-only">Previous</span>
                      &larr;
                    </Button>
                    {Array.from({ length: coursesResponse.meta.totalPage }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        className={`h-9 w-9 rounded-xl p-0 font-semibold text-xs transition-all ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/95 border-none"
                            : "border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, coursesResponse.meta.totalPage))}
                      disabled={currentPage === coursesResponse.meta.totalPage}
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-xl border-border/50 hover:bg-muted"
                    >
                      <span className="sr-only">Next</span>
                      &rarr;
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Safety Delete Guard Modal */}
      <DeleteConfirmModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        courseTitle={courseToDelete?.title}
        onConfirm={handleConfirmDelete}
      />

      {/* Edit/Update Course Modal */}
      <CourseUpdateModal
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        course={selectedCourseForEdit}
      />

    </div>
  )
}
