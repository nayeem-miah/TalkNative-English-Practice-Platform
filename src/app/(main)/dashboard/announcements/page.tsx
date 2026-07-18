/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowRight, Bell, Calendar, Megaphone, ShieldAlert, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useGetAnnouncementFeedQuery } from "@/redux/api/announcement-api"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

export default function UserAnnouncementsPage() {
  const { data: apiData, isLoading } = useGetAnnouncementFeedQuery(undefined)
  const announcements = apiData?.data || (apiData as any)?.result || []

  const [activeFilter, setActiveFilter] = React.useState("ALL") // "ALL", "URGENT", "SYSTEM", "PROMO"
  const [readIds, setReadIds] = React.useState<string[]>([])

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("talknative_read_announcements")
      if (saved) {
        setReadIds(JSON.parse(saved))
      }
    } catch {}
  }, [])

  // Clean data to resolve template issues dynamically on frontend
  const cleanAnnouncements = React.useMemo(() => {
    return announcements.map((ann: any) => {
      let category = ann.category
      let isUrgent = ann.isUrgent
      const title = ann.title || ""
      const content = ann.content || ""


      const isMaintenance = title.toLowerCase().includes("maintenance") ||
                            title.toLowerCase().includes("server") ||
                            content.toLowerCase().includes("maintenance") ||
                            content.toLowerCase().includes("downtime")

      if (isMaintenance) {
        category = "SYSTEM_ALERT"
        isUrgent = false
      }

      return {
        ...ann,
        category,
        isUrgent
      }
    })
  }, [announcements])

  const filteredAnnouncements = React.useMemo(() => {
    return cleanAnnouncements.filter((ann: any) => {
      if (activeFilter === "URGENT") return ann.isUrgent
      if (activeFilter === "SYSTEM") return ann.category === "SYSTEM_ALERT"
      if (activeFilter === "PROMO") return ann.category === "PROMOTION"
      return true
    })
  }, [cleanAnnouncements, activeFilter])

  const markAllAsRead = () => {
    const allIds = cleanAnnouncements.map((a: any) => a.id)
    setReadIds(allIds)
    try {
      localStorage.setItem("talknative_read_announcements", JSON.stringify(allIds))
    } catch {}
    toast.success("All announcements marked as read")
  }

  const markSingleAsRead = (id: string) => {
    if (readIds.includes(id)) return
    const updated = [...readIds, id]
    setReadIds(updated)
    try {
      localStorage.setItem("talknative_read_announcements", JSON.stringify(updated))
    } catch {}
  }

  const unreadCount = cleanAnnouncements.filter((a: any) => !readIds.includes(a.id)).length

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans flex items-center gap-2.5">
            <Megaphone className="h-7 w-7 text-primary" /> Announcements
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
            Stay updated with the latest news, features, and system alerts.
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-wider shadow-sm",
            unreadCount > 0
              ? "bg-[#006D5B] text-white hover:bg-[#005a4b] cursor-pointer"
              : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-650 cursor-not-allowed border border-border/50"
          )}
          title="Click to mark all updates as read"
        >
          <Bell className={cn("h-4.5 w-4.5", unreadCount > 0 ? "animate-swing" : "")} />
          <span>{unreadCount > 0 ? `${unreadCount} New Updates` : "All Read"}</span>
        </button>
      </div>

      {/* Tab Filter Control */}
      <div className="flex flex-wrap items-center gap-2 bg-zinc-100/60 dark:bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/60 w-fit shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveFilter("ALL")}
          className={cn(
            "h-8 rounded-lg text-[11px] font-black px-3.5 tracking-wider uppercase cursor-pointer transition-all",
            activeFilter === "ALL"
              ? "bg-white dark:bg-zinc-800 text-primary shadow-xs font-black"
              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-transparent"
          )}
        >
          All ({cleanAnnouncements.length})
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveFilter("URGENT")}
          className={cn(
            "h-8 rounded-lg text-[11px] font-black px-3.5 tracking-wider uppercase cursor-pointer transition-all",
            activeFilter === "URGENT"
              ? "bg-red-500/10 text-red-600 dark:text-red-400 font-black"
              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-transparent"
          )}
        >
          Urgent ({cleanAnnouncements.filter((a: any) => a.isUrgent).length})
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveFilter("SYSTEM")}
          className={cn(
            "h-8 rounded-lg text-[11px] font-black px-3.5 tracking-wider uppercase cursor-pointer transition-all",
            activeFilter === "SYSTEM"
              ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-black"
              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-transparent"
          )}
        >
          System ({cleanAnnouncements.filter((a: any) => a.category === "SYSTEM_ALERT").length})
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveFilter("PROMO")}
          className={cn(
            "h-8 rounded-lg text-[11px] font-black px-3.5 tracking-wider uppercase cursor-pointer transition-all",
            activeFilter === "PROMO"
              ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 font-black"
              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-transparent"
          )}
        >
          Promotional ({cleanAnnouncements.filter((a: any) => a.category === "PROMOTION").length})
        </Button>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center p-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-card">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-zinc-250 dark:border-zinc-800 rounded-2xl bg-card">
            <Megaphone className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-bold text-muted-foreground">No matching updates found.</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement: any) => {
            const isSystem = announcement.category === "SYSTEM_ALERT"
            const isFeature = announcement.category === "FEATURE_UPDATE"
            const isPromo = announcement.category === "PROMOTION"
            const isRead = readIds.includes(announcement.id)
            const displayDate = new Date(announcement.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })

            return (
              <Card
                key={announcement.id}
                onClick={() => markSingleAsRead(announcement.id)}
                className={cn(
                  "p-6 sm:p-8 border rounded-2xl shadow-sm transition-all hover:shadow-md relative overflow-hidden group cursor-pointer",
                  announcement.isUrgent
                    ? "border-red-200 dark:border-red-950 bg-red-50/20 dark:bg-red-950/10"
                    : "border-zinc-200/80 dark:border-zinc-800/80 bg-card hover:border-primary/40"
                )}
              >
                {announcement.isUrgent && (
                  <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                     <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-8 py-1 rotate-45 translate-x-[30%] translate-y-[50%] shadow-sm">
                        Urgent
                     </div>
                  </div>
                )}

                {/* Unread badge dot */}
                {!isRead && (
                  <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-blue-500 animate-pulse" title="New Announcement" />
                )}

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="shrink-0">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105 duration-200",
                      isSystem ? "bg-zinc-150 dark:bg-zinc-850 border-zinc-200 dark:border-zinc-700 text-zinc-650 dark:text-zinc-300" :
                      isFeature ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                      "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400"
                    )}>
                      {isSystem && <ShieldAlert className="h-5.5 w-5.5" />}
                      {isFeature && <Star className="h-5.5 w-5.5" />}
                      {isPromo && <Megaphone className="h-5.5 w-5.5" />}
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                          isSystem ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700" :
                          isFeature ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-250" :
                          "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-250"
                        )}>
                          {announcement.category?.replace("_", " ")}
                        </Badge>
                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> {displayDate}
                        </span>
                      </div>
                      <h2 className={cn(
                        "text-xl font-bold tracking-tight",
                        announcement.isUrgent ? "text-red-600 dark:text-red-400" : "text-foreground group-hover:text-[#006D5B] dark:group-hover:text-emerald-400 transition-colors"
                      )}>
                        {announcement.title}
                      </h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {announcement.content}
                    </p>

                    {isPromo && (
                      <div className="pt-2">
                        <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 hover:underline underline-offset-4">
                          Claim Offer <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </span>
                      </div>
                    )}
                    {isFeature && (
                      <div className="pt-2">
                        <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4">
                          Explore Now <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
