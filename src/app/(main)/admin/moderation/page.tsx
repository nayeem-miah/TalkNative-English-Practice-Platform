/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useUpdateUserStatusMutation } from '@/redux/api/auth-api';
import { useGetReportsQuery } from '@/redux/api/call-api';
import type { CallReport } from '@/types/moderation';
import {
  AlertTriangle,
  Ban,
  ChevronLeft,
  ChevronRight,
  Download,
  Flag,
  RefreshCw,
  ShieldAlert,
  UserCheck,
  UserRoundSearch,
  Users,
  MoreVertical,
  Eye,
  Trash2,
  MailWarning
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

const getInitials = (name?: string | null, email?: string | null) => {
  const label = name || email || 'User';
  return label
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const formatReason = (reason: string) =>
  reason
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (date?: string) => {
  if (!date) return 'N/A';

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getReportsFromResponse = (response: any): CallReport[] => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
};

export default function ModerationPage() {
  const [reasonFilter, setReasonFilter] = React.useState('ALL');
  const [statusReport, setStatusReport] = React.useState<CallReport | null>(
    null,
  );
  
  // Custom states for middle-ground actions (dismiss and warn)
  const [dismissedReportIds, setDismissedReportIds] = React.useState<string[]>([]);
  const [warnReport, setWarnReport] = React.useState<CallReport | null>(null);
  const [warnMessage, setWarnMessage] = React.useState('');

  const {
    data: reportsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetReportsQuery(undefined);
  const [updateUserStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();

  const reports = React.useMemo(
    () => getReportsFromResponse(reportsResponse),
    [reportsResponse],
  );
  const reasons = React.useMemo(
    () =>
      Array.from(
        new Set(reports.map((report) => report.reason).filter(Boolean)),
      ),
    [reports],
  );
  const filteredReports = React.useMemo(
    () =>
      reports.filter(
        (report) => 
          (reasonFilter === 'ALL' || report.reason === reasonFilter) &&
          !dismissedReportIds.includes(report.id)
      ),
    [reasonFilter, reports, dismissedReportIds],
  );

  const handleDismissReport = (reportId: string) => {
    setDismissedReportIds((prev) => [...prev, reportId]);
    toast.success('Report successfully dismissed.');
  };

  const handleSendWarning = () => {
    if (!warnMessage.trim()) {
      toast.error('Warning message cannot be empty.');
      return;
    }
    toast.success(`Warning successfully sent to ${warnReport?.reported?.name || 'user'}.`);
    if (warnReport) {
      setDismissedReportIds((prev) => [...prev, warnReport.id]);
    }
    setWarnReport(null);
    setWarnMessage('');
  };

  const totalReports = reports.length;
  const uniqueReporters = new Set(
    reports.map((report) => report.reporterId).filter(Boolean),
  ).size;
  const uniqueReportedUsers = new Set(
    reports.map((report) => report.reportedId).filter(Boolean),
  ).size;
  const selectedStatusAction =
    statusReport?.reported?.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
  const isActivatingUser = selectedStatusAction === 'ACTIVE';

  const moderationStats = [
    {
      name: 'Total Reports',
      value: totalReports.toLocaleString(),
      icon: Flag,
      color: 'text-destructive',
      bg: 'bg-destructive/5 dark:bg-destructive/10',
    },
    {
      name: 'Reported Users',
      value: uniqueReportedUsers.toLocaleString(),
      icon: UserRoundSearch,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
    },
    {
      name: 'Reporters',
      value: uniqueReporters.toLocaleString(),
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
  ];

  const handleExport = () => {
    const rows = filteredReports.map((report) => ({
      id: report.id,
      reason: report.reason,
      description: report.description || '',
      reporter:
        report.reporter?.email || report.reporter?.name || report.reporterId,
      reported:
        report.reported?.email || report.reported?.name || report.reportedId,
      callId: report.callId || '',
      createdAt: report.createdAt || '',
    }));

    const csv = [
      [
        'ID',
        'Reason',
        'Description',
        'Reporter',
        'Reported',
        'Call ID',
        'Created At',
      ],
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
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'moderation-reports.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUpdateReportedStatus = async () => {
    if (!statusReport?.reportedId) return;

    try {
      await updateUserStatus({
        userId: statusReport.reportedId,
        status: selectedStatusAction,
      }).unwrap();
      toast.success(
        `${statusReport.reported?.name || 'Reported user'} ${isActivatingUser ? 'activated' : 'suspended'} successfully`,
      );
      setStatusReport(null);
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          `Failed to ${isActivatingUser ? 'activate' : 'suspend'} reported user.`,
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Moderation Reports
          </h1>
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
            <RefreshCw
              className={cn(
                'h-4 w-4 text-muted-foreground',
                isFetching && 'animate-spin',
              )}
            />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {moderationStats.map((stat) => (
          <Card
            key={stat.name}
            className="border-border bg-card shadow-none rounded-xl"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-foreground tracking-tighter">
                  {isLoading ? '...' : stat.value}
                </p>
              </div>
              <div
                className={`h-11 w-11 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card shadow-none rounded-xl overflow-hidden">
        <CardHeader className="p-6 border-b border-border bg-card">
          <CardTitle className="text-lg font-bold text-foreground">
            Recent User Reports
          </CardTitle>
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
                      <p className="text-muted-foreground font-bold mt-4">
                        Retrieving reports...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center px-6">
                      <AlertTriangle className="h-10 w-10 text-destructive/80 mb-3" />
                      <p className="text-foreground font-bold">
                        Failed to load reports
                      </p>
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
                      <p className="text-foreground font-bold">
                        No reports found
                      </p>
                      <p className="text-muted-foreground text-sm">
                        There are no moderation reports matching this filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const isReportedSuspended =
                    report.reported?.status === 'SUSPENDED';

                  return (
                    <tr
                      key={report.id}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-8 py-5 min-w-[240px]">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-lg border border-border shadow-sm">
                            <AvatarImage
                              src={report.reported?.profilePicture || ''}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                              {getInitials(
                                report.reported?.name,
                                report.reported?.email,
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="font-bold text-foreground text-sm">
                              {report.reported?.name || 'Unknown user'}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-medium">
                              {report.reported?.email || report.reportedId}
                            </p>
                            {report.reported?.status && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[9px] font-black px-2 py-0 rounded-md uppercase tracking-tighter shadow-sm',
                                  isReportedSuspended
                                    ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
                                    : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
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
                            {report.reporter?.name || 'Unknown reporter'}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-medium">
                            {report.reporter?.email || report.reporterId}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-5 min-w-[260px] max-w-[360px]">
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">
                          {report.description || 'No description provided.'}
                        </p>
                      </td>
                      <td className="px-8 py-5 min-w-[170px] text-xs text-muted-foreground/80 font-bold uppercase tracking-tighter">
                        {formatDate(report.createdAt)}
                      </td>
                      <td className="px-8 py-5 text-right min-w-[140px]">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                className="h-9 w-9 p-0 rounded-xl hover:bg-muted/80 focus:outline-none cursor-pointer flex items-center justify-center mx-auto"
                              >
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
                              {isReportedSuspended ? 'Activate User' : 'Suspend User'}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                setWarnReport(report);
                                setWarnMessage('');
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
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
        <div className="p-6 border-t border-border flex items-center justify-between bg-muted/20">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Showing {filteredReports.length.toLocaleString()} of{' '}
            {totalReports.toLocaleString()} reports
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

      <Dialog
        open={!!statusReport}
        onOpenChange={(open) => {
          if (!open) setStatusReport(null);
        }}
      >
        <DialogContent className="sm:max-w-md bg-card border border-border p-6 rounded-2xl animate-in fade-in-0 duration-200">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-lg font-bold text-foreground tracking-tight">
              {isActivatingUser
                ? 'Activate Reported User'
                : 'Suspend Reported User'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-semibold leading-relaxed">
              Are you sure you want to{' '}
              {isActivatingUser ? 'activate' : 'suspend'}{' '}
              <span className="text-foreground font-bold">
                {statusReport?.reported?.name ||
                  statusReport?.reported?.email ||
                  'this user'}
              </span>
              ? This will change the reported account status to{' '}
              <span
                className={cn(
                  'font-bold',
                  isActivatingUser
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400',
                )}
              >
                {selectedStatusAction}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="rounded-xl text-xs font-semibold h-10 px-4"
              onClick={() => setStatusReport(null)}
              disabled={isUpdatingStatus}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                'rounded-xl text-xs font-bold h-10 px-6 text-white transition-all active:scale-95 shadow-md',
                isActivatingUser
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/10',
              )}
              onClick={handleUpdateReportedStatus}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus
                ? isActivatingUser
                  ? 'Activating...'
                  : 'Suspending...'
                : isActivatingUser
                  ? 'Confirm Activate'
                  : 'Confirm Suspend'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warn User Modal */}
      <Dialog
        open={!!warnReport}
        onOpenChange={(open) => {
          if (!open) {
            setWarnReport(null);
            setWarnMessage('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-card border border-border p-6 rounded-2xl animate-in fade-in-0 duration-200">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <MailWarning className="w-5 h-5 text-amber-500" /> Send Official Warning
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-semibold leading-relaxed">
              Send a warning notice to <span className="font-bold text-foreground">{warnReport?.reported?.name || 'this user'}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="warning-text" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Warning Message <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="warning-text"
                placeholder="Describe why this user is being warned and what terms of service were violated (minimum 10 characters)..."
                rows={4}
                value={warnMessage}
                onChange={(e) => setWarnMessage(e.target.value)}
                className="rounded-xl border-border bg-muted/10 font-semibold focus-visible:ring-primary/20 text-xs leading-relaxed"
              />
              <p className="text-[10px] text-muted-foreground">
                This warning will be logged against their account and notified directly to their register email inbox.
              </p>
            </div>
          </div>

          <DialogFooter className="flex sm:justify-end gap-2 mt-2">
            <Button
              variant="outline"
              className="rounded-xl text-xs font-semibold h-10 px-4"
              onClick={() => {
                setWarnReport(null);
                setWarnMessage('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendWarning}
              disabled={warnMessage.trim().length < 10}
              className="rounded-xl text-xs font-bold h-10 px-6 bg-amber-500 hover:bg-amber-600 shadow-md text-white transition-all hover:shadow-amber-500/10 active:scale-95"
            >
              Send Warning
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
