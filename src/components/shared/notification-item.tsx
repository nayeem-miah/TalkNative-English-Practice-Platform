"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/redux/hooks"
import {
  notificationApi,
  useDeleteNotificationMutation,
  useMarkNotificationReadMutation,
} from "@/redux/api/notification-api"
import { Notification, NotificationType } from "@/types/notification"

const TYPE_CONFIG: Record<
  NotificationType,
  { emoji: string; color: string; bg: string }
> = {
  LIKE:         { emoji: "❤️", color: "text-rose-500",    bg: "bg-rose-50 dark:bg-rose-950/40" },
  COMMENT:      { emoji: "💬", color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-950/40" },
  ENROLLMENT:   { emoji: "🎉", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  ANNOUNCEMENT: { emoji: "📢", color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-950/40" },
  CALL:         { emoji: "📞", color: "text-purple-500",  bg: "bg-purple-50 dark:bg-purple-950/40" },
  SYSTEM:       { emoji: "🔐", color: "text-slate-500",   bg: "bg-slate-50 dark:bg-slate-800/40" },
}

interface NotificationItemProps {
  notification: Notification
  queryArgs: { page: number; limit: number; sortOrder: "asc" | "desc" }
  onClose: () => void
}

export function NotificationItem({
  notification,
  queryArgs,
  onClose,
}: NotificationItemProps) {
  const dispatch = useAppDispatch()
  const router   = useRouter()

  const [markRead,    { isLoading: isMarking }] = useMarkNotificationReadMutation()
  const [deleteNotif, { isLoading: isDeleting }] = useDeleteNotificationMutation()

  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.SYSTEM

  const handleClick = async () => {
    if (!notification.isRead && !isMarking) {
      try {
        dispatch(
          notificationApi.util.updateQueryData("getNotifications", queryArgs, (draft) => {
            const item = draft.data?.find((n) => n.id === notification.id)
            if (item) item.isRead = true
          })
        )

        dispatch(
          notificationApi.util.updateQueryData("getUnreadCount", undefined, (draft) => {
            if (draft?.data && draft.data.count > 0) {
              draft.data.count -= 1
            }
          })
        )

        await markRead(notification.id).unwrap()
      } catch { }
    }
    if (notification.link) {
      onClose()
      router.push(notification.link)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDeleting) return
    try {
      // Optimistic update for notifications list cache
      dispatch(
        notificationApi.util.updateQueryData("getNotifications", queryArgs, (draft) => {
          if (draft?.data) {
            draft.data = draft.data.filter((n) => n.id !== notification.id)
          }
        })
      )
      if (!notification.isRead) {
        dispatch(
          notificationApi.util.updateQueryData("getUnreadCount", undefined, (draft) => {
            if (draft?.data && draft.data.count > 0) {
              draft.data.count -= 1
            }
          })
        )
      }

      await deleteNotif(notification.id).unwrap()
    } catch {
      toast.error("Failed to delete notification")
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      onClick={handleClick}
      className={cn(
        "group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer",
        "transition-all duration-200 hover:bg-muted/60",
        notification.isRead
          ? "opacity-55"
          : "bg-primary/[0.03] dark:bg-primary/[0.06]"
      )}
    >
      {!notification.isRead && (
        <span className="absolute top-3.5 right-3 w-2 h-2 rounded-full bg-primary shrink-0" />
      )}

      <div
        className={cn(
          "shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base",
          config.bg
        )}
      >
        {config.emoji}
      </div>

      <div className="flex-1 min-w-0 pr-5">
        <p className={cn("text-sm font-semibold leading-tight truncate", config.color)}>
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <p className="text-[10px] text-muted-foreground/50 mt-1 font-medium">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="Delete notification"
        className={cn(
          "absolute top-2.5 right-2 p-1 rounded-md",
          "opacity-0 group-hover:opacity-100",
          "hover:bg-destructive/10 hover:text-destructive",
          "transition-all duration-150",
          isDeleting && "opacity-50 cursor-not-allowed"
        )}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}
