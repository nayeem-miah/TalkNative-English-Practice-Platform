import * as React from "react"
import { Layers, BookOpen, Globe, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MetadataCardProps {
  level: string
  lessonsCount: number
  updatedAt?: string
}

export function MetadataCard({
  level,
  lessonsCount,
  updatedAt,
}: MetadataCardProps) {
  return (
    <Card className="border border-border/80 shadow-sm rounded-2xl overflow-hidden bg-card">
      <CardContent className="p-5 space-y-4 text-xs font-semibold text-muted-foreground">
        <h4 className="text-xs font-black text-foreground uppercase tracking-widest border-b border-border/60 pb-2">
          Course Metadata
        </h4>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground/60" /> Level
          </span>
          <span className="text-foreground font-bold">{level}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground/60" /> Lessons
          </span>
          <span className="text-foreground font-bold">{lessonsCount} Lectures</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground/60" /> Instruction
          </span>
          <span className="text-foreground font-bold">English (with Native Voice)</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground/60" /> Last Updated
          </span>
          <span className="text-foreground font-bold">
            {updatedAt 
              ? new Date(updatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) 
              : "N/A"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
