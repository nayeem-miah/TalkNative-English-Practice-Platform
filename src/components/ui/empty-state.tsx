import * as React from "react"
import Link from "next/link"
import { LucideIcon, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onActionClick?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon = BookOpen,
  title,
  description,
  actionLabel,
  actionHref,
  onActionClick,
  className,
}: EmptyStateProps) {
  return (
    <div className={`min-h-[400px] w-full bg-background flex flex-col items-center justify-center p-6 text-center ${className || ""}`}>
      <Icon className="w-12 h-12 text-muted-foreground/60 mb-4" />
      <h3 className="text-xl font-bold text-foreground tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-xs font-semibold leading-relaxed">{description}</p>
      
      {(actionLabel && (actionHref || onActionClick)) && (
        <div className="mt-6">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="outline" className="rounded-xl font-bold text-xs">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={onActionClick} className="rounded-xl font-bold text-xs">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
