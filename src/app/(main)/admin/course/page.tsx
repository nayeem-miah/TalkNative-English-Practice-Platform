/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Plus, Edit, ExternalLink, MoreVertical, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// Modular Sub-components
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
import { PaginationControls } from "@/components/ui/pagination-controls"

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
          <Card className="border-border bg-card shadow-none rounded-xl overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border bg-muted/30">
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Course Info</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Level & Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lessons</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Students</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Price</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCourses.map((course) => {
                    const thumbnailSrc = course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
                    const lessonsCount = course._count?.lessons ?? 0
                    const studentsCount = course.studentsCount ?? 0

                    return (
                      <tr key={course.id} className="group hover:bg-muted/20 transition-colors cursor-default">
                        {/* Course Info */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                              <Image
                                width={80}
                                height={48}
                                src={thumbnailSrc}
                                alt={course.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="space-y-0.5 max-w-[320px]">
                              <p className="font-bold text-foreground text-sm tracking-tight truncate group-hover:text-primary transition-colors" title={course.title}>
                                {course.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground font-medium tracking-tight truncate" title={course.description}>
                                {course.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Level & Type */}
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1 items-start">
                            <Badge variant="outline" className="text-[8px] font-black px-1.5 py-0.2 rounded bg-muted/65 text-muted-foreground border-transparent uppercase tracking-wider">
                              {course.level}
                            </Badge>
                            <Badge variant="outline" className="text-[8px] font-black px-1.5 py-0.2 rounded bg-primary/10 text-primary border-transparent uppercase tracking-wider">
                              {course.type || "FREE"}
                            </Badge>
                          </div>
                        </td>

                        {/* Lessons */}
                        <td className="px-8 py-6 text-sm font-bold text-muted-foreground/80">
                          {lessonsCount} {lessonsCount === 1 ? "Lesson" : "Lessons"}
                        </td>

                        {/* Students */}
                        <td className="px-8 py-6 text-sm font-bold text-muted-foreground/80">
                          {studentsCount} {studentsCount === 1 ? "Learner" : "Learners"}
                        </td>

                        {/* Price */}
                        <td className="px-8 py-6 text-sm font-bold text-foreground">
                          {course.price > 0 ? `$${course.price.toFixed(2)}` : "Free"}
                        </td>

                        {/* Status */}
                        <td className="px-8 py-6">
                          <Badge className={cn(
                            "rounded-lg border px-2.5 py-0.5 text-[9px] font-bold tracking-wide uppercase shadow-sm border-none text-white",
                            course.isPublished
                              ? "bg-emerald-500 hover:bg-emerald-500"
                              : "bg-amber-500 hover:bg-amber-500"
                          )}>
                            {course.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/course/${course.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg text-xs font-bold gap-1 border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground"
                              >
                                View Course
                              </Button>
                            </Link>

                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-8 w-8 rounded-lg bg-background hover:bg-muted text-foreground flex items-center justify-center border border-border/80 cursor-pointer focus:outline-none">
                                <MoreVertical className="w-4 h-4" />
                              </DropdownMenuTrigger>

                              <DropdownMenuContent className="w-48 p-1.5 rounded-xl border border-border bg-card shadow-lg" align="end">
                                <DropdownMenuItem onClick={() => handleStartEdit(course)} className="rounded-lg cursor-pointer py-2 text-xs font-semibold gap-2">
                                  <Edit className="w-4 h-4 text-muted-foreground" /> Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePublishToggle(course.id)} className="rounded-lg cursor-pointer py-2 text-xs font-semibold gap-2">
                                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                  {course.isPublished ? "Revert to Draft" : "Publish Live"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 bg-muted" />
                                <DropdownMenuItem onClick={() => handleStartDelete(course)} className="rounded-lg cursor-pointer py-2 text-xs font-semibold text-destructive focus:bg-destructive/5 dark:focus:bg-destructive/15 gap-2">
                                  <Trash2 className="w-4 h-4 text-destructive" /> Delete Course
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Premium Pagination controls */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={coursesResponse?.meta?.totalPage || 1}
            totalItems={totalCoursesCount}
            limit={limit}
            onPageChange={setCurrentPage}
          />
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
