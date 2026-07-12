import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EnrollmentCardProps {
  price: number
  type: string
  isEnrolled: boolean
  isEnrolling: boolean
  onEnroll: () => void
}

export function EnrollmentCard({
  price,
  type,
  isEnrolled,
  isEnrolling,
  onEnroll,
}: EnrollmentCardProps) {
  return (
    <Card className="border border-border/80 shadow-md rounded-2xl overflow-hidden bg-card">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-black text-muted-foreground/70">Course Fee</span>
          <div className="text-3xl font-black text-foreground">
            {price > 0 ? `$${price}` : "Free"}
          </div>
        </div>

        <Button
          disabled={isEnrolled || isEnrolling}
          onClick={onEnroll}
          className={cn(
            "w-full rounded-xl h-11 text-xs font-black uppercase tracking-widest shadow-sm",
            isEnrolled
              ? "bg-emerald-500 text-white hover:bg-emerald-500 cursor-default"
              : "bg-primary text-primary-foreground hover:bg-primary/95 transition-all active:scale-98"
          )}
        >
          {isEnrolled ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 fill-white/10" /> Enrolled
            </span>
          ) : isEnrolling ? (
            <div className="h-4.5 w-4.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
          ) : (
            price === 0 || type === "FREE" ? "Enroll in Free Course" : "Enroll Now"
          )}
        </Button>
        
        <p className="text-[10px] text-muted-foreground font-semibold text-center leading-normal">
          {isEnrolled 
            ? "Start practicing English from the left dashboard syllabus." 
            : "Instant lifetime access to video material, exercises, and native guides."}
        </p>
      </CardContent>
    </Card>
  )
}
