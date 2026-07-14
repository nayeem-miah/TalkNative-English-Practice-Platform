/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useUpdateUserStatusMutation } from "@/redux/api/auth-api"
import { useGetReportsQuery } from "@/redux/api/call-api"
import type { CallReport } from "@/types/moderation"
import {
  AlertTriangle,
  Ban,
  ChevronLeft,
  ChevronRight,
  Download,
  MailWarning,
  MoreVertical,
  RefreshCw,
  ShieldAlert,
  Trash2,
  UserCheck,
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import {
  formatDate,
  formatReason,
  getInitials,
  getReportsFromResponse,
} from "@/utils/moderation-utils"

import { ModerationStats } from "./components/ModerationStats"
import { StatusActionModal } from "./components/StatusActionModal"
import { WarnUserModal } from "./components/WarnUserModal"

export default function ModerationPage() {
  const [reasonFilter, setReasonFilter] = React.useState("ALL")
  const [statusReport, setStatusReport] = React.useState<CallReport | null>(null)

  // Custom states for middle-ground actions (dismiss and warn)
  const [dismissedReportIds, setDismissedReportIds] = React.useState<string[]>([])
  const [warnReport, setWarnReport] = React.useState<CallReport | null>(null)
  const [warnMessage, setWarnMessage] = React.useState("")

  const {
    data: reportsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetReportsQuery(undefined)
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation()

  const reports = React.useMemo(() => getReportsFromResponse(reportsResponse), [reportsResponse])
  const reasons = React.useMemo(
    () => Array.from(new Set(reports.map((report) => report.reason).filter(Boolean))),
    [reports]
  )
  const filteredReports = React.useMemo(
    () =>
      reports.filter(
        (report) =>
          (reasonFilter === "ALL" || report.reason === reasonFilter) &&
          !dismissedReportIds.includes(report.id)
      ),
    [reasonFilter, reports, dismissedReportIds]
  )

  const handleDismissReport = (reportId: string) => {
    setDismissedReportIds((prev) => [...prev, reportId])
    toast.success("Report successfully dismissed.")
  }

  const handleSendWarning = (message: string) => {
    if (!message.trim()) {
      toast.error("Warning message cannot be empty.")
      return
    }
    toast.success(`Warning successfully sent to ${warnReport?.reported?.name || "user"}.`)
    if (warnReport) {
      setDismissedReportIds((prev) => [...prev, warnReport.id])
    }
    setWarnReport(null)
    setWarnMessage("")
  }

  const totalReports = reports.length
  const uniqueReporters = new Set(reports.map((report) => report.reporterId).filter(Boolean)).size
  const uniqueReportedUsers = new Set(reports.map((report) => report.reportedId).filter(Boolean)).size
  const selectedStatusAction = statusReport?.reported?.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
  const isActivatingUser = selectedStatusAction === "ACTIVE"

  const handleExport = () => {
    const rows = filteredReports.map((report) => ({
      id: report.id,
      reason: report.reason,
      description: report.description || "",
      reporter: report.reporter?.email || report.reporter?.name || report.reporterId,
      reported: report.reported?.email || report.reported?.name || report.reportedId,
      callId: report.callId || "",
      createdAt: report.createdAt || "",
    }))

    const csv = [
      ["ID", "Reason", "Description", "Reporter", "Reported", "Call ID", "Created At"],
      ...rows.map((row) => [
        row.id,
        row.reason,
        row.description,
        row.reporter,
        row.reported,
        row.callId,
        row.createdAt,
      ]),
    ]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "moderation-reports.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleUpdateReportedStatus = async () => {
    if (!statusReport?.reportedId) return

    try {
      await updateUserStatus({
        userId: statusReport.reportedId,
        status: selectedStatusAction,
      }).unwrap()
      toast.success(
        `${statusReport.reported?.name || "Reported user"} ${
          isActivatingUser ? "activated" : "suspended"
        } successfully`
      )
      setStatusReport(null)
      refetch()
    } catch (err: any) {
      toast.error(
        err?.data?.message || `Failed to ${isActivatingUser ? "activate" : "suspend"} reported user.`
      )
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Moderation Reports</h1>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Review and manage reported community content and safety protocols.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={reasonFilter} onValueChange={(val) => setReasonFilter(val || "ALL")}>
            <SelectTrigger className="h-10 rounded-lg border border-border bg-background px-4 text-[10px] font-bold uppercase tracking-widest text-foreground cursor-pointer focus-visible:ring-0 min-w-[140px]">
              <SelectValue placeholder="All Reasons" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-border bg-card z-50">
              <SelectItem value="ALL">All Reasons</SelectItem>
              {reasons.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {formatReason(reason)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-lg border-border bg-background hover:bg-muted transition-all"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh reports"
          >
            <RefreshCw className={cn("h-4 w-4 text-muted-foreground", isFetching && "animate-spin")} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-lg border-border bg-background hover:bg-muted transition-all"
            onClick={handleExport}
            disabled={filteredReports.length === 0}
            title="Export reports"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <ModerationStats
        totalReports={totalReports}
        reportedUsers={uniqueReportedUsers}
        reporters={uniqueReporters}
        isLoading={isLoading}
      />

      <Card className="border-border bg-card shadow-none rounded-xl overflow-hidden">
        <CardHeader className="p-6 border-b border-border bg-card">
          <CardTitle className="text-lg font-bold text-foreground">Recent User Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border bg-muted/30">
                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Reported User
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Reason
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Reporter
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Description
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Date
                </th>
                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <p className="text-muted-foreground font-bold mt-4">Retrieving reports...</p>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center px-6">
                      <AlertTriangle className="h-10 w-10 text-destructive/80 mb-3" />
                      <p className="text-foreground font-bold">Failed to load reports</p>
                      <p className="text-muted-foreground text-sm">
                        Please try refreshing the moderation queue.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center px-6">
                      <ShieldAlert className="h-10 w-10 text-muted-foreground/50 mb-3" />
                      <p className="text-foreground font-bold">No reports found</p>
                      <p className="text-muted-foreground text-sm">
                        There are no moderation reports matching this filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const isReportedSuspended = report.reported?.status === "SUSPENDED"

                  return (
                    <tr key={report.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-8 py-5 min-w-[240px]">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-lg border border-border shadow-sm">
                            <AvatarImage
                              src={report.reported?.profilePicture || ""}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                              {getInitials(report.reported?.name, report.reported?.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="font-bold text-foreground text-sm">
                              {report.reported?.name || "Unknown user"}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-medium">
                              {report.reported?.email || report.reportedId}
                            </p>
                            {report.reported?.status && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[9px] font-black px-2 py-0 rounded-md uppercase tracking-tighter shadow-sm",
                                  isReportedSuspended
                                    ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
                                    : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                                )}
                              >
                                {report.reported.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 min-w-[180px]">
                        <Badge
                          variant="outline"
                          className="bg-destructive/5 text-destructive border-destructive/20 text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-tighter shadow-sm"
                        >
                          {formatReason(report.reason)}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 min-w-[220px]">
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-foreground">
                            {report.reporter?.name || "Unknown reporter"}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-medium">
                            {report.reporter?.email || report.reporterId}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-5 min-w-[260px] max-w-[360px]">
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">
                          {report.description || "No description provided."}
                        </p>
                      </td>
                      <td className="px-8 py-5 min-w-[170px] text-xs text-muted-foreground/80 font-bold uppercase tracking-tighter">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="px-8 py-5 text-right min-w-[140px]">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-muted/80 focus:outline-none cursor-pointer flex items-center justify-center mx-auto">
                                <MoreVertical className="h-4.5 w-4.5 text-muted-foreground" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent className="w-48 p-1.5 rounded-xl border border-border bg-card shadow-lg" align="end">
                            <DropdownMenuItem
                              onClick={() => setStatusReport(report)}
                              className="rounded-lg cursor-pointer py-2 text-xs font-semibold gap-2"
                              disabled={isUpdatingStatus}
                            >
                              {isReportedSuspended ? (
                                <UserCheck className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Ban className="h-4 w-4 text-rose-500" />
                              )}
                              {isReportedSuspended ? "Activate User" : "Suspend User"}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setWarnReport(report)
                                setWarnMessage("")
                              }}
                              className="rounded-lg cursor-pointer py-2 text-xs font-semibold gap-2"
                            >
                              <MailWarning className="h-4 w-4 text-amber-500" />
                              Warn User
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1 bg-muted" />

                            <DropdownMenuItem
                              onClick={() => handleDismissReport(report.id)}
                              className="rounded-lg cursor-pointer py-2 text-xs font-semibold text-muted-foreground hover:text-foreground gap-2"
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                              Dismiss Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </CardContent>
        <div className="p-6 border-t border-border flex items-center justify-between bg-muted/20">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Showing {filteredReports.length.toLocaleString()} of {totalReports.toLocaleString()} reports
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-border bg-background shadow-sm hover:bg-muted"
              disabled
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-border bg-primary text-primary-foreground font-bold shadow-md"
              disabled
            >
              <span className="text-[10px] font-bold">1</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-border bg-background transition-all hover:bg-muted"
              disabled
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <StatusActionModal
        report={statusReport}
        onClose={() => setStatusReport(null)}
        isLoading={isUpdatingStatus}
        onConfirm={handleUpdateReportedStatus}
      />

      <WarnUserModal
        report={warnReport}
        onClose={() => {
          setWarnReport(null)
          setWarnMessage("")
        }}
        onConfirm={handleSendWarning}
        warnMessage={warnMessage}
        setWarnMessage={setWarnMessage}
      />
    </div>
  )
}
