/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useGetAllEnrollmentsQuery } from "@/redux/api/enrollment-api"
import {
  BadgeCheck,
  Check,
  Clock,
  Copy,
  CreditCard,
  Filter,
  Gift,
  GraduationCap,
  Search,
  ShieldAlert
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

// Reusable states
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingState } from "@/components/ui/loading-state"
import { PaginationControls } from "@/components/ui/pagination-controls"

export default function AdminEnrollmentPage() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const limit = 10

  const { data: enrollmentResponse, isLoading } = useGetAllEnrollmentsQuery({
    page: currentPage,
    limit,
    searchTerm,
    paymentStatus: statusFilter,
  })

  const responseData = enrollmentResponse?.data || enrollmentResponse
  const enrollments = responseData?.data || []
  const meta = responseData?.meta
  const totalEnrollments = meta?.total ?? 0
  const totalPage = meta?.totalPage ?? 1

  const handleCopyTransactionId = (txId: string) => {
    if (!txId) return
    navigator.clipboard.writeText(txId)
    setCopiedId(txId)
    toast.success("Transaction ID copied!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Handle page resets when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Enrollment Registry</h1>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Monitor and audit all student course purchases and enrollment activities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-muted-foreground/60" />
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val || "ALL")
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-10 text-xs font-semibold rounded-xl border border-border bg-background px-4 py-1 cursor-pointer focus-visible:ring-0 min-w-[160px]">
                <SelectValue placeholder="All Payment Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-border bg-card z-50">
                <SelectItem value="ALL">All Payment Statuses</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FREE">Free</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID or course..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 w-[200px] h-9 rounded-xl border-border bg-muted/30"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
              <h3 className="text-2xl font-bold">{totalEnrollments}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-xl">
              <BadgeCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Paid Enrollments</p>
              <h3 className="text-2xl font-bold">{meta?.paidEnrollments ?? enrollments.filter((e: any) => e.paymentStatus === 'PAID').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <Gift className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Free Enrollments</p>
              <h3 className="text-2xl font-bold">{meta?.freeEnrollments ?? enrollments.filter((e: any) => e.paymentStatus === 'FREE').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-500/10 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <h3 className="text-2xl font-bold">{meta?.pendingEnrollments ?? enrollments.filter((e: any) => e.paymentStatus === 'PENDING').length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card shadow-none rounded-xl overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border bg-muted/30">
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Student Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Course Title</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Payment Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amount Paid</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Transaction ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Enrolled At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <LoadingState message="Retrieving enrollment records..." className="min-h-[250px]" />
                  </td>
                </tr>
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <EmptyState
                      icon={CreditCard}
                      title="No enrollments found"
                      description="No records match your active search terms or filters."
                      className="min-h-[250px]"
                    />
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment: any) => {
                  const enrolledDate = enrollment.enrolledAt
                    ? new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "N/A"

                  const paymentStatus = enrollment.paymentStatus || "PENDING"
                  const isPaid = paymentStatus === "PAID"
                  const isFree = paymentStatus === "FREE"

                  return (
                    <tr key={enrollment.id} className="group hover:bg-muted/20 transition-colors cursor-default">
                      {/* Student Info */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-11 w-11 rounded-xl border border-border shadow-sm">
                            <AvatarImage src={enrollment.user?.profilePicture || ""} className="object-cover" />
                            <AvatarFallback className="font-bold bg-muted text-muted-foreground">
                              {enrollment.user?.name ? enrollment.user.name[0]?.toUpperCase() : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <p className="font-bold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
                              {enrollment.user?.name || "Unknown User"}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-medium tracking-tight leading-none">
                              {enrollment.user?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Course Title */}
                      <td className="px-8 py-6 max-w-[280px]">
                        <div className="space-y-1">
                          <p className="font-bold text-foreground text-sm tracking-tight truncate" title={enrollment.course?.title}>
                            {enrollment.course?.title || "Unknown Course"}
                          </p>
                          <Badge variant="outline" className={cn(
                            "text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider gap-1",
                            (enrollment.course?.type || "FREE") === "PAID" 
                              ? "bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/50" 
                              : "bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/50"
                          )}>
                            Course: {enrollment.course?.type || "FREE"}
                          </Badge>
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="px-8 py-6">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider shadow-sm",
                          isPaid ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" :
                          isFree ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20" :
                          "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"
                        )}>
                          {paymentStatus}
                        </Badge>
                      </td>

                      {/* Amount Paid */}
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-foreground flex items-center gap-0.5">
                          {enrollment.amountPaid !== null && enrollment.amountPaid !== undefined ? (
                            `$${enrollment.amountPaid.toFixed(2)}`
                          ) : isFree ? (
                            "$0.00"
                          ) : (
                            <span className="text-muted-foreground/60 font-semibold italic">N/A</span>
                          )}
                        </span>
                      </td>

                      {/* Transaction ID */}
                      <td className="px-8 py-6">
                        {enrollment.transactionId ? (
                          <button
                            onClick={() => handleCopyTransactionId(enrollment.transactionId)}
                            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted border border-border/40 px-2 py-1 rounded-lg transition-all"
                            title="Click to copy Transaction ID"
                          >
                            <span className="truncate max-w-[120px]">{enrollment.transactionId}</span>
                            {copiedId === enrollment.transactionId ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        ) : isPaid ? (
                          <div className="flex items-center gap-1.5 text-rose-500 font-extrabold text-xs">
                            <span>N/A</span>
                            <div className="relative group/warn cursor-pointer">
                              <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[9px] font-bold tracking-normal text-white bg-rose-600 rounded-md opacity-0 group-hover/warn:opacity-100 transition-opacity pointer-events-none whitespace-normal w-44 text-center shadow-lg z-30 leading-snug">
                                WARNING: Paid enrollment is missing Transaction ID!
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/60 italic text-xs font-semibold">N/A</span>
                        )}
                      </td>

                      {/* Enrolled At */}
                      <td className="px-8 py-6 text-right">
                        <span className="text-xs font-bold text-muted-foreground/80 tracking-tight">
                          {enrolledDate}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </CardContent>

        {/* Pagination & Summary */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Audit logs • {isLoading ? "..." : totalEnrollments.toLocaleString()} enrollments monitored
          </p>
        </div>
      </Card>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPage}
        totalItems={totalEnrollments}
        limit={limit}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
