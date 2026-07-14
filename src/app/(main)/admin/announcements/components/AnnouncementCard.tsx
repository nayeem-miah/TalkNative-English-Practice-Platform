/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Edit,
  Megaphone,
  MoreVertical,
  ShieldAlert,
  Star,
  Trash,
} from "lucide-react"

interface AnnouncementCardProps {
  announcement: any
  onEdit: (announcement: any) => void
  onDelete: (id: string) => void
}

export function AnnouncementCard({
  announcement,
  onEdit,
  onDelete,
}: AnnouncementCardProps) {
  const isSystem = announcement.category === "SYSTEM_ALERT"
  const isFeature = announcement.category === "FEATURE_UPDATE"
  const isPromo = announcement.category === "PROMOTION"
  const displayDate = new Date(announcement.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })

  return (
    <Card
      className={cn(
        "p-5 border shadow-sm rounded-xl transition-all relative overflow-hidden flex flex-col sm:flex-row gap-5",
        announcement.isUrgent
          ? "border-red-200 dark:border-red-900/50 bg-red-50/10 dark:bg-red-900/5"
          : "border-border bg-card"
      )}
    >
      <div className="shrink-0 flex sm:flex-col items-center sm:items-start justify-between gap-4">
        <div
          className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center border shadow-sm shrink-0",
            isSystem
              ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
              : isFeature
              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400"
          )}
        >
          {isSystem && <ShieldAlert className="h-5.5 w-5.5" />}
          {isFeature && <Star className="h-5.5 w-5.5" />}
          {isPromo && <Megaphone className="h-5.5 w-5.5" />}
        </div>
      </div>

      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                isSystem
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-transparent"
                  : isFeature
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50"
                  : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200/50"
              )}
            >
              {announcement.category?.replace("_", " ")}
            </Badge>
            {announcement.status === "DRAFT" && (
              <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded">
                Draft
              </span>
            )}
            {announcement.isUrgent && (
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-100 px-2 py-0.5 rounded">
                Urgent
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 shrink-0">
            <Calendar className="h-3.5 w-3.5" /> {displayDate}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-foreground truncate">{announcement.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {announcement.content}
          </p>
        </div>
      </div>

      <div className="shrink-0 flex sm:flex-col items-center justify-end gap-2 border-t sm:border-t-0 sm:border-l border-border/50 pt-4 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(announcement)}
          className="h-8 w-8 text-zinc-500 hover:text-primary hover:bg-primary/10 rounded-lg"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(announcement.id)}
          className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
        >
          <Trash className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:text-foreground rounded-lg"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
