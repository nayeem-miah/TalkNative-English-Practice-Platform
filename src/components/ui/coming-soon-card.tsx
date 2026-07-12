import { BookMarked } from "lucide-react"
import { Card } from "@/components/ui/card"

export function ComingSoonCard() {
  return (
    <Card className="overflow-hidden border border-dashed border-border/80 bg-muted/5 flex flex-col justify-center items-center text-center p-8 rounded-2xl min-h-[420px] opacity-75 select-none hover:opacity-100 transition-opacity">
      <div className="p-4 rounded-full bg-muted/20 mb-4 border border-border/50">
        <BookMarked className="h-8 w-8 text-muted-foreground/50 animate-pulse" />
      </div>
      <h3 className="text-base font-extrabold text-foreground tracking-tight">More Courses Coming Soon</h3>
      <p className="text-xs text-muted-foreground max-w-[200px] mt-2 font-medium">
        We are actively designing new programs to boost your confidence. Stay tuned!
      </p>
    </Card>
  )
}
