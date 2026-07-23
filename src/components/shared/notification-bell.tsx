"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Bell, BellOff, CheckCheck, Loader2, Trash2 } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import {
  notificationApi,
  useClearAllNotificationsApiMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllNotificationsReadMutation,
} from "@/redux/api/notification-api"
import { useAppDispatch } from "@/redux/hooks"
import { NotificationItem } from "./notification-item"




export function NotificationBell() {
  const [open, setOpen]           = React.useState(false)
  const [sortOrder, setSortOrder] = React.useState<"desc" | "asc">("desc")
  const panelRef = React.useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()


  const { data: unreadData } = useGetUnreadCountQuery()
  const unreadCount = unreadData?.data?.count ?? 0

  const queryArgs = React.useMemo(
    () => ({ page: 1, limit: 20, sortOrder }),
    [sortOrder]
  )
  const { data, isFetching } = useGetNotificationsQuery(queryArgs, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  })

  const notifications = data?.data ?? []

  const [markAllRead_, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation()
  const [clearAll_,    { isLoading: isClearing }]   = useClearAllNotificationsApiMutation()

  const handleMarkAllRead = async () => {
    if (isMarkingAll || unreadCount === 0) return
    try {
      dispatch(
        notificationApi.util.updateQueryData("getNotifications", queryArgs, (draft) => {
          draft.data?.forEach((n) => { n.isRead = true })
        })
      )
      dispatch(
        notificationApi.util.updateQueryData("getUnreadCount", undefined, (draft) => {
          if (draft?.data) draft.data.count = 0
        })
      )

      await markAllRead_().unwrap()
    } catch {
      toast.error("Failed to mark all as read")
    }
  }

  const handleClearAll = async () => {
    if (isClearing) return
    try {
      dispatch(
        notificationApi.util.updateQueryData("getNotifications", queryArgs, (draft) => {
          if (draft) draft.data = []
        })
      )
      dispatch(
        notificationApi.util.updateQueryData("getUnreadCount", undefined, (draft) => {
          if (draft?.data) draft.data.count = 0
        })
      )

      await clearAll_().unwrap()
      toast.success("All notifications cleared")
    } catch {
      toast.error("Failed to clear notifications")
    }
  }

  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const badgeCount = Math.min(unreadCount, 99)

  return (
    <div className="relative" ref={panelRef}>
      <button
        id="notification-bell-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        className={cn(
          "relative flex items-center justify-center w-9 h-9 rounded-full",
          "transition-all duration-200",
          "hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/30",
          open && "bg-muted/70"
        )}
      >
        <Bell className="w-5 h-5" />
        <AnimatePresence>
          {badgeCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold px-1 shadow-sm"
            >
              {badgeCount > 99 ? "99+" : badgeCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="notification-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn(
              "absolute right-0 top-12 z-[60]",
              "w-[360px] max-h-[520px] flex flex-col",
              "bg-background/95 backdrop-blur-xl",
              "border border-border/60 rounded-2xl",
              "shadow-2xl shadow-black/10 dark:shadow-black/30"
            )}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setSortOrder((p) => (p === "desc" ? "asc" : "desc"))}
                title={sortOrder === "desc" ? "Newest first" : "Oldest first"}
                className="px-2 py-1 text-[10px] font-bold rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground transition-colors"
              >
                {sortOrder === "desc" ? "Newest ↑" : "Oldest ↑"}
              </button>
            </div>

            {notifications.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-muted/20">
                <button
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0 || isMarkingAll}
                  className={cn(
                    "flex items-center gap-1.5 text-[11px] font-semibold transition-colors",
                    unreadCount > 0 && !isMarkingAll
                      ? "text-primary hover:text-primary/80"
                      : "text-muted-foreground/40 cursor-not-allowed"
                  )}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  {isMarkingAll ? "Marking…" : "Mark all read"}
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className={cn(
                    "flex items-center gap-1.5 text-[11px] font-semibold transition-colors",
                    isClearing
                      ? "text-muted-foreground/40 cursor-not-allowed"
                      : "text-destructive/70 hover:text-destructive"
                  )}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {isClearing ? "Clearing…" : "Clear all"}
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2">
              {isFetching ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 gap-3 text-muted-foreground">
                  <BellOff className="w-10 h-10 opacity-25" />
                  <p className="text-sm font-semibold">No notifications yet</p>
                  <p className="text-xs opacity-60 text-center max-w-[200px]">
                    We&apos;ll notify you when something happens
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      queryArgs={queryArgs}
                      onClose={() => setOpen(false)}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-border/30 px-4 py-2.5">
                <p className="text-center text-[11px] text-muted-foreground/50 font-medium">
                  Showing latest {notifications.length} of {data?.meta?.total ?? notifications.length}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
