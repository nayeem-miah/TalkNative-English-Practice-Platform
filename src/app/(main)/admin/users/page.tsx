/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PaginationControls } from "@/components/ui/pagination-controls"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useGetUserByIdQuery, useGetallUsrsQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation } from "@/redux/api/auth-api"
import {
  Eye,
  Filter,
  Search,
  Shield,
  UserCheck,
  UserX,
  Users
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { UserStats } from "./components/UserStats"
import { UserDetailsModal } from "./components/UserDetailsModal"
import { RoleConfirmModal } from "./components/RoleConfirmModal"
import { StatusConfirmModal } from "./components/StatusConfirmModal"

export default function UsersPage() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const limit = 10

  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [roleConfirmData, setRoleConfirmData] = React.useState<{ userId: string; name: string; currentRole: string; newRole: "ADMIN" | "USER" } | null>(null)
  const [statusConfirmData, setStatusConfirmData] = React.useState<{ userId: string; name: string; currentStatus: string; newStatus: "ACTIVE" | "SUSPENDED" } | null>(null)

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

  const responseData = usersResponse?.data || usersResponse
  const users = responseData?.data || []
  const meta = responseData?.meta
  const totalUsersCount = meta?.total ?? 0
  const totalPage = meta?.totalPage ?? 1

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
      <UserStats
        totalUsersCount={totalUsersCount}
        activeUsersCount={meta?.activeUsers ?? users.filter((u: any) => u.status === 'ACTIVE').length}
        suspendedUsersCount={meta?.suspendedUsers ?? users.filter((u: any) => u.status === 'SUSPENDED').length}
        adminUsersCount={meta?.adminUsers ?? users.filter((u: any) => u.role === 'ADMIN').length}
      />

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

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPage}
        totalItems={totalUsersCount}
        limit={limit}
        onPageChange={setCurrentPage}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open)
          if (!open) setSelectedUserId(null)
        }}
        isLoading={isDetailsLoading}
        userDetail={userDetail}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedUserId(null)
        }}
      />

      {/* Role Change Confirmation Dialog */}
      <RoleConfirmModal
        data={roleConfirmData}
        onClose={() => setRoleConfirmData(null)}
        isLoading={isUpdatingRole}
        onConfirm={async () => {
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
      />

      {/* Status Change Confirmation Dialog */}
      <StatusConfirmModal
        data={statusConfirmData}
        onClose={() => setStatusConfirmData(null)}
        isLoading={isUpdatingStatus}
        onConfirm={async () => {
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
      />
    </div>
  )
}
