"use client"

import * as React from "react"
import { toast } from "sonner"

import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket"
import { useAuth } from "@/hooks/use-auth"
import { useAppDispatch } from "@/redux/hooks"
import { useGetUnreadCountQuery, notificationApi } from "@/redux/api/notification-api"
import { Notification } from "@/types/notification"

const TYPE_EMOJI: Record<string, string> = {
  LIKE: "❤️",
  COMMENT: "💬",
  ENROLLMENT: "🎉",
  ANNOUNCEMENT: "📢",
  CALL: "📞",
  SYSTEM: "🔐",
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, mounted } = useAuth()
  const dispatch = useAppDispatch()

  // Keep unread count query subscribed globally so cache stays alive
  useGetUnreadCountQuery(undefined, {
    skip: !isLoggedIn || !mounted,
  })

  // ── Socket connection + real-time notification listener ─────────────
  React.useEffect(() => {
    if (!isLoggedIn || !mounted || !user?.id) return

    const socket = connectSocket(user.id)

    const handleNotification = (notification: Notification) => {
      // a) Inject notification into RTK Query getNotifications cache
      dispatch(
        notificationApi.util.updateQueryData(
          "getNotifications",
          { page: 1, limit: 20, sortOrder: "desc" },
          (draft) => {
            if (draft?.data) {
              draft.data.unshift(notification)
            }
          }
        )
      )

      // b) Increment RTK Query getUnreadCount cache
      dispatch(
        notificationApi.util.updateQueryData(
          "getUnreadCount",
          undefined,
          (draft) => {
            if (draft?.data) {
              draft.data.count += 1
            } else {
              draft.data = { count: 1 }
            }
          }
        )
      )

      // c) Show toast notification
      const emoji = TYPE_EMOJI[notification.type] ?? "🔔"
      toast(`${emoji} ${notification.title}`, {
        description: notification.message,
        duration: 5000,
      })
    }

    socket.on("notification", handleNotification)
    return () => {
      socket.off("notification", handleNotification)
    }
  }, [isLoggedIn, mounted, user?.id, dispatch])

  // ── Disconnect on logout ─────────────────────────────────────────────
  React.useEffect(() => {
    if (mounted && !isLoggedIn) {
      try {
        const s = getSocket()
        if (s.connected) disconnectSocket()
      } catch {
        // socket was never created
      }
    }
  }, [mounted, isLoggedIn])

  return <>{children}</>
}
