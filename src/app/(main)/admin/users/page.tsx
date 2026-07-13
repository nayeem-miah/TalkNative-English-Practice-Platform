/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useGetUserByIdQuery, useGetallUsrsQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation, useDeleteUserMutation } from "@/redux/api/auth-api"
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Languages,
  Mail,
  Phone,
  Search,
  Shield,
  UserCheck,
  UserX,
  Users,
  Trash2
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { PaginationControls } from "@/components/ui/pagination-controls"

export default function UsersPage() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const limit = 10

  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [roleConfirmData, setRoleConfirmData] = React.useState<{ userId: string; name: string; currentRole: string; newRole: "ADMIN" | "USER" } | null>(null)
  const [statusConfirmData, setStatusConfirmData] = React.useState<{ userId: string; name: string; currentStatus: string; newStatus: "ACTIVE" | "SUSPENDED" } | null>(null)

  // Bulk Actions State
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([])

  const { data: usersResponse, isLoading } = useGetallUsrsQuery({
    page: currentPage,
    limit,
    searchTerm,
    status: statusFilter,
  })


  const { data: userDetailsResponse, isLoading: isDetailsLoading } = useGetUserByIdQuery(
    selectedUserId ?? "",
    { skip: !selectedUserId }
  )

  const userDetail = userDetailsResponse?.data || userDetailsResponse

  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation()
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const responseData = usersResponse?.data || usersResponse
  const users = responseData?.data || []
  const meta = responseData?.meta
  const totalUsersCount = meta?.total ?? 0
  const totalPage = meta?.totalPage ?? 1

  // Reset selection on page, search or filter change
  React.useEffect(() => {
    setSelectedUserIds([])
  }, [currentPage, searchTerm, statusFilter])

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUserIds.length} selected user(s)?`)) {
      try {
        await Promise.all(selectedUserIds.map(id => deleteUser(id).unwrap()))
        toast.success("Selected users deleted successfully")
        setSelectedUserIds([])
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete selected users")
      }
    }
  }

  const handleBulkSuspend = async () => {
    if (window.confirm(`Are you sure you want to suspend ${selectedUserIds.length} selected user(s)?`)) {
      try {
        await Promise.all(selectedUserIds.map(id => updateUserStatus({ userId: id, status: "SUSPENDED" }).unwrap()))
        toast.success("Selected users suspended successfully")
        setSelectedUserIds([])
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to suspend selected users")
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">Manage and monitor all platform accounts and activity.</p>
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
              <SelectTrigger className="h-10 text-xs font-semibold rounded-xl border border-border bg-background px-4 py-1 cursor-pointer focus-visible:ring-0 min-w-[120px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-border bg-card z-50">
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{totalUsersCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-xl">
              <UserCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <h3 className="text-2xl font-bold">{meta?.activeUsers ?? users.filter((u: any) => u.status === 'ACTIVE').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-destructive/10 p-3 rounded-xl">
              <UserX className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Suspended</p>
              <h3 className="text-2xl font-bold">{meta?.suspendedUsers ?? users.filter((u: any) => u.status === 'SUSPENDED').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Admins</p>
              <h3 className="text-2xl font-bold">{meta?.adminUsers ?? users.filter((u: any) => u.role === 'ADMIN').length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card shadow-none rounded-xl overflow-hidden">
        <CardHeader className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-11 h-12 rounded-xl border-border bg-muted/20 transition-all focus:ring-primary/10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border bg-muted/30">
                <th className="w-12 px-6 py-5">
                  <input
                    type="checkbox"
                    checked={users.length > 0 && selectedUserIds.length === users.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUserIds(users.map((u: any) => u.id || u._id))
                      } else {
                        setSelectedUserIds([])
                      }
                    }}
                    className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary accent-primary cursor-pointer transition-all"
                  />
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">User Identity</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Role</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Onboarding</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Account State</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                      <p className="text-muted-foreground font-bold mt-4">Retrieving users...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-10 w-10 text-muted-foreground/50 mb-3" />
                      <p className="text-foreground font-bold">No users found</p>
                      <p className="text-muted-foreground text-sm">No accounts match your active search terms.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user: any) => {
                  const joinedDate = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"
                  const uId = user.id || user._id

                  return (
                    <tr key={uId} className="group hover:bg-muted/25 transition-colors cursor-default">
                      <td className="w-12 px-6 py-6">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(uId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUserIds([...selectedUserIds, uId])
                            } else {
                              setSelectedUserIds(selectedUserIds.filter((id) => id !== uId))
                            }
                          }}
                          className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary accent-primary cursor-pointer transition-all"
                        />
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-11 w-11 rounded-xl border border-border shadow-sm">
                            <AvatarImage src={user.profilePicture || ""} className="object-cover" />
                            <AvatarFallback className="font-bold bg-muted text-muted-foreground">
                              {user.name ? user.name[0]?.toUpperCase() : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <p className="font-bold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">{user.name}</p>
                            <p className="text-[11px] text-muted-foreground font-medium tracking-tight leading-none">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-tighter shadow-sm",
                          (user.role || "USER") === "ADMIN"
                            ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20"
                            : "bg-muted text-muted-foreground border-transparent"
                        )}>
                          {user.role || "USER"}
                        </Badge>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-xs font-bold text-muted-foreground/60 tracking-tighter uppercase">{joinedDate}</span>
                      </td>
                      <td className="px-6 py-6">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-tighter shadow-sm",
                          (user.status || "ACTIVE") === "ACTIVE" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" :
                          (user.status || "ACTIVE") === "INACTIVE" ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20" :
                          "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
                        )}>
                          {user.status || "ACTIVE"}
                        </Badge>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Tooltip wrapper for View Details */}
                          <div className="relative group/tooltip">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 transition-all"
                              onClick={() => {
                                setSelectedUserId(user.id || user._id)
                                setIsDetailsOpen(true)
                              }}
                            >
                              <Eye className="h-4.5 w-4.5" />
                            </Button>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 text-[9px] font-black tracking-wider uppercase text-white bg-zinc-950 dark:bg-zinc-800 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-30">
                              View Details
                            </span>
                          </div>

                          {/* Tooltip wrapper for Change Role */}
                          <div className="relative group/tooltip">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 transition-all"
                              disabled={isUpdatingRole}
                              onClick={() => {
                                const newRole = user.role === "ADMIN" ? "USER" : "ADMIN"
                                setRoleConfirmData({
                                  userId: user.id || user._id,
                                  name: user.name || "User",
                                  currentRole: user.role || "USER",
                                  newRole,
                                })
                              }}
                            >
                              <Shield className="h-4.5 w-4.5" />
                            </Button>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 text-[9px] font-black tracking-wider uppercase text-white bg-zinc-950 dark:bg-zinc-800 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-30">
                              {user.role === "ADMIN" ? "Demote Role" : "Promote to Admin"}
                            </span>
                          </div>

                          {/* Tooltip wrapper for Suspend / Active */}
                          <div className="relative group/tooltip">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-10 w-10 rounded-xl transition-all",
                                (user.status || "ACTIVE") === "SUSPENDED"
                                  ? "hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600"
                                  : "hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600"
                              )}
                              disabled={isUpdatingStatus}
                              onClick={() => {
                                const newStatus = (user.status || "ACTIVE") === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
                                setStatusConfirmData({
                                  userId: user.id || user._id,
                                  name: user.name || "User",
                                  currentStatus: user.status || "ACTIVE",
                                  newStatus,
                                })
                              }}
                            >
                              {(user.status || "ACTIVE") === "SUSPENDED" ? (
                                <UserCheck className="h-4.5 w-4.5" />
                              ) : (
                                <UserX className="h-4.5 w-4.5" />
                              )}
                            </Button>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 text-[9px] font-black tracking-wider uppercase text-white bg-zinc-950 dark:bg-zinc-800 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-30">
                              {(user.status || "ACTIVE") === "SUSPENDED" ? "Unsuspend" : "Suspend Account"}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </CardContent>
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Global Registry • {isLoading ? "..." : totalUsersCount.toLocaleString()} total accounts monitored
          </p>
        </div>
      </Card>

      {/* Bulk Actions Floating Banner */}
      {selectedUserIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl px-6 py-4 flex items-center justify-between gap-8 min-w-[320px] sm:min-w-[480px] animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">
              {selectedUserIds.length}
            </span>
            <p className="text-xs font-bold text-foreground">Accounts Selected</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 text-xs font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer"
              disabled={isUpdatingStatus}
              onClick={handleBulkSuspend}
            >
              <UserX className="h-3.5 w-3.5 mr-1.5" /> Suspend
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-9 px-4 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              disabled={isDeleting}
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-xs font-bold rounded-xl hover:bg-muted text-muted-foreground transition-all cursor-pointer"
              onClick={() => setSelectedUserIds([])}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPage}
        totalItems={totalUsersCount}
        limit={limit}
        onPageChange={setCurrentPage}
      />

      {/* User Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={(open) => {
        setIsDetailsOpen(open)
        if (!open) {
          setSelectedUserId(null)
        }
      }}>
        <DialogContent className="sm:max-w-md bg-card border border-border p-6 rounded-2xl animate-in fade-in-0 duration-200">
          <DialogHeader className="flex flex-col items-center text-center space-y-4 mb-2">
            {isDetailsLoading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <p className="text-muted-foreground font-bold mt-3 text-xs uppercase tracking-wider">Loading details...</p>
              </div>
            ) : userDetail ? (
              <>
                <div className="relative group">
                  <Avatar className="h-24 w-24 rounded-2xl border-2 border-border shadow-md transition-all duration-300 group-hover:scale-105">
                    <AvatarImage src={userDetail.profilePicture || ""} className="object-cover" />
                    <AvatarFallback className="text-2xl font-bold bg-muted text-muted-foreground">
                      {userDetail.name ? userDetail.name[0]?.toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-1">
                  <DialogTitle className="text-xl font-bold text-foreground tracking-tight flex items-center justify-center gap-1.5">
                    {userDetail.name}
                    {userDetail.isVerified && (
                      <span title="Verified User">
                        <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                      </span>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground font-medium">{userDetail.email}</DialogDescription>
                </div>

                <div className="flex items-center justify-center gap-3 mt-1.5 w-full">
                  <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-lg border border-border/60">
                    <span className="text-[9px] uppercase font-black text-muted-foreground/70">Role:</span>
                    <span className="text-[9px] font-black text-primary uppercase tracking-wider">
                      {userDetail.role || "USER"}
                    </span>
                  </div>

                  <Badge variant="outline" className={cn(
                    "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm border",
                    (userDetail.status || "ACTIVE") === "ACTIVE" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" :
                    (userDetail.status || "ACTIVE") === "INACTIVE" ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20" :
                    "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
                  )}>
                    {userDetail.status || "ACTIVE"}
                  </Badge>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Failed to load user details.</p>
            )}
          </DialogHeader>

          {!isDetailsLoading && userDetail && (
            <div className="space-y-4 py-3 text-xs font-semibold text-muted-foreground border-t border-border mt-2">

              {/* Bio Section */}
              {userDetail.bio ? (
                <div className="bg-muted/20 border border-border/80 p-3 rounded-xl text-center italic text-foreground/85 font-medium">
                  "{userDetail.bio}"
                </div>
              ) : (
                <div className="bg-muted/10 border border-border/40 p-2.5 rounded-xl text-center text-[11px] text-muted-foreground/60 font-medium italic">
                  No bio provided
                </div>
              )}

              {/* Language and Practice Stats */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-muted/25 border border-border/80 p-3 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground/70">
                    <Languages className="w-3.5 h-3.5" />
                    <span className="text-[9px] uppercase font-extrabold tracking-wider">Languages</span>
                  </div>
                  <div className="text-[11px] text-foreground font-extrabold leading-tight">
                    {userDetail.nativeLanguage || "N/A"} <span className="text-muted-foreground font-semibold text-[9px]">(Native)</span>
                    <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                      Learning: <span className="text-primary font-extrabold">{userDetail.learningLanguage || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/25 border border-border/80 p-3 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground/70">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[9px] uppercase font-extrabold tracking-wider">Time & Level</span>
                  </div>
                  <div className="text-[11px] text-foreground font-extrabold leading-tight">
                    {userDetail.totalMinutesSpent !== undefined && userDetail.totalMinutesSpent !== null
                      ? `${Math.floor(userDetail.totalMinutesSpent / 60)}h ${userDetail.totalMinutesSpent % 60}m`
                      : "0m"}
                    <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                      Level: <span className="text-foreground font-extrabold">{userDetail.level || "B2 Upper"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/15 border border-border/60 text-[11px]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground/60" />
                    <span className="font-semibold text-muted-foreground/80">Email</span>
                  </div>
                  <span className="font-bold text-foreground select-all">{userDetail.email}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/15 border border-border/60 text-[11px]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground/60" />
                    <span className="font-semibold text-muted-foreground/80">Phone</span>
                  </div>
                  <span className={cn(
                    "font-bold select-all",
                    userDetail.Phone ? "text-foreground" : "text-muted-foreground/50 font-normal italic"
                  )}>
                    {userDetail.Phone || "Not Provided"}
                  </span>
                </div>
              </div>

              {/* Technical IDs and Dates */}
              <div className="bg-muted/10 border border-border/40 rounded-xl p-3 space-y-2 text-[10px] font-semibold text-muted-foreground/80">
                <div className="flex items-center justify-between">
                  <span>User ID</span>
                  <span className="font-mono text-foreground select-all text-[9px] truncate max-w-[180px]">{userDetail.id || userDetail._id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Joined Date</span>
                  <span className="text-foreground">
                    {userDetail.createdAt
                      ? new Date(userDetail.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Updated</span>
                  <span className="text-foreground">
                    {userDetail.updatedAt
                      ? new Date(userDetail.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>

            </div>
          )}

          <DialogFooter className="mt-4">
            <DialogClose render={<Button variant="outline" className="w-full rounded-xl shadow-sm hover:bg-muted" />}>
              Close Details
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Change Confirmation Dialog */}
      <Dialog open={!!roleConfirmData} onOpenChange={(open) => { if (!open) setRoleConfirmData(null) }}>
        <DialogContent className="sm:max-w-md bg-card border border-border p-6 rounded-2xl animate-in fade-in-0 duration-200">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-lg font-bold text-foreground tracking-tight">
              Confirm Role Change
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-semibold leading-relaxed">
              Are you sure you want to change <span className="text-foreground font-bold">{roleConfirmData?.name}</span>'s role from <span className="text-foreground font-bold">{roleConfirmData?.currentRole}</span> to <span className="text-primary font-bold">{roleConfirmData?.newRole}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="rounded-xl text-xs font-semibold h-10 px-4"
              onClick={() => setRoleConfirmData(null)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              disabled={isUpdatingRole}
              className="rounded-xl text-xs font-bold h-10 px-6 bg-primary text-primary-foreground hover:opacity-90 transition-all active:scale-95 shadow-md shadow-primary/10"
              onClick={async () => {
                if (!roleConfirmData) return
                try {
                  await updateUserRole({ userId: roleConfirmData.userId, role: roleConfirmData.newRole }).unwrap()
                  toast.success(`Changed ${roleConfirmData.name || "user"}'s role to ${roleConfirmData.newRole}`)
                } catch (err: any) {
                  toast.error(err?.data?.message || "Failed to change role.")
                } finally {
                  setRoleConfirmData(null)
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={!!statusConfirmData} onOpenChange={(open) => { if (!open) setStatusConfirmData(null) }}>
        <DialogContent className="sm:max-w-md bg-card border border-border p-6 rounded-2xl animate-in fade-in-0 duration-200">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-lg font-bold text-foreground tracking-tight">
              {statusConfirmData?.newStatus === "SUSPENDED" ? "Suspend User" : "Activate User"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-semibold leading-relaxed">
              Are you sure you want to change <span className="text-foreground font-bold">{statusConfirmData?.name}</span>'s status to <span className={cn("font-bold", statusConfirmData?.newStatus === "SUSPENDED" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400")}>{statusConfirmData?.newStatus}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="rounded-xl text-xs font-semibold h-10 px-4"
              onClick={() => setStatusConfirmData(null)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              disabled={isUpdatingStatus}
              className={cn(
                "rounded-xl text-xs font-bold h-10 px-6 text-white hover:opacity-90 transition-all active:scale-95 shadow-md",
                statusConfirmData?.newStatus === "SUSPENDED"
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10"
              )}
              onClick={async () => {
                if (!statusConfirmData) return
                try {
                  await updateUserStatus({ userId: statusConfirmData.userId, status: statusConfirmData.newStatus }).unwrap()
                  toast.success(`User is now ${statusConfirmData.newStatus.toLowerCase()}`)
                } catch (err: any) {
                  toast.error(err?.data?.message || "Failed to update status.")
                } finally {
                  setStatusConfirmData(null)
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
