/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Bell, BookOpen, Heart, Megaphone, MessageSquare, Phone, X } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  notificationApi,
  useDeleteNotificationMutation,
  useMarkNotificationReadMutation,
} from "@/redux/api/notification-api"
import { useAppDispatch } from "@/redux/hooks"
import { Notification, NotificationType } from "@/types/notification"

// Icon components for each type
const TYPE_ICONS: Record<NotificationType, React.ComponentType<any>> = {
  LIKE: Heart,
  COMMENT: MessageSquare,
  ENROLLMENT: BookOpen,
  ANNOUNCEMENT: Megaphone,
  CALL: Phone,
  SYSTEM: Bell,
}

// Styling classes for each type
const TYPE_STYLES: Record<
  NotificationType,
  { iconColor: string; bg: string }
> = {
  LIKE:         { iconColor: "text-rose-500",    bg: "bg-rose-50 dark:bg-rose-950/30" },
  COMMENT:      { iconColor: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-950/30" },
  ENROLLMENT:   { iconColor: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  ANNOUNCEMENT: { iconColor: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-950/30" },
  CALL:         { iconColor: "text-purple-500",  bg: "bg-purple-50 dark:bg-purple-950/30" },
  SYSTEM:       { iconColor: "text-slate-500",   bg: "bg-slate-50 dark:bg-slate-800/30" },
}

interface NotificationItemProps {
  notification: Notification
  queryArgs: { page: number; limit: number; sortOrder: "asc" | "desc" }
}

export function NotificationItem({
  notification,
  queryArgs,
}: NotificationItemProps) {
  const dispatch = useAppDispatch()

  const [markRead,    { isLoading: isMarking }] = useMarkNotificationReadMutation()
  const [deleteNotif, { isLoading: isDeleting }] = useDeleteNotificationMutation()

  const IconComponent = TYPE_ICONS[notification.type] ?? TYPE_ICONS.SYSTEM
  const styleConfig = TYPE_STYLES[notification.type] ?? TYPE_STYLES.SYSTEM

  const sender = (notification as any).sender
  const senderName = sender?.name || "User"
  const profilePic = sender?.profilePicture || sender?.image

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
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDeleting) return
    try {
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
        "group relative flex items-start gap-3 py-3.5 px-4 cursor-pointer",
        "transition-all duration-200 hover:bg-muted/50 border-b border-border/40 last:border-b-0",
        !notification.isRead && "bg-primary/[0.02] dark:bg-primary/[0.04]"
      )}
    >
      {!notification.isRead && (
        <span className="absolute top-4.5 right-4 w-2 h-2 rounded-full bg-primary shrink-0" />
      )}

      {profilePic && notification.type !== "SYSTEM" ? (
        <Avatar className="h-9 w-9 border border-border/80 shrink-0">
          <AvatarImage src={profilePic} alt={senderName} />
          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
            {senderName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div
          className={cn(
            "shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
            styleConfig.bg,
            styleConfig.iconColor
          )}
        >
          <IconComponent className="w-4.5 h-4.5" />
        </div>
      )}

      <div className="flex-1 min-w-0 pr-5">
        <p className={cn(
          "text-sm font-bold leading-tight truncate text-zinc-900 dark:text-zinc-100",
          !notification.isRead && "font-extrabold"
        )}>
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
          "absolute top-3.5 right-3.5 p-1 rounded-md",
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
