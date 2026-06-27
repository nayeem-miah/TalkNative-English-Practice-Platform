"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle2, Layers, Users, DollarSign } from "lucide-react"

interface StatsOverviewProps {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalStudents: number
  totalRevenue: number
}

export function StatsOverview({
  totalCourses,
  publishedCourses,
  draftCourses,
  totalStudents,
  totalRevenue,
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* Total Courses */}
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Total Courses</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <BookOpen className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalCourses}</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">Active courses on platform</p>
        </CardContent>
      </Card>

      {/* Published Courses */}
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Published</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{publishedCourses}</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">Visible to student users</p>
        </CardContent>
      </Card>

      {/* Draft Courses */}
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Drafts</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <Layers className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{draftCourses}</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">Work-in-progress drafts</p>
        </CardContent>
      </Card>

      {/* Total Students */}
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Enrollments</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <Users className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {totalStudents.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">Total registered learners</p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="rounded-2xl border border-border bg-card shadow-sm col-span-2 sm:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Total Revenue</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <DollarSign className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ${totalRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">Net course purchase value</p>
        </CardContent>
      </Card>
    </div>
  )
}
