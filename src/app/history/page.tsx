import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { History, Search, Filter, Calendar, PlayCircle, MoreVertical } from "lucide-react"

export default function HistoryPage() {
  const sessions = [
    { id: 1, title: "Casual Small Talk", date: "May 10, 2026", duration: "12m", score: "85%", partner: "Sarah (US)" },
    { id: 2, title: "Business Negotiation", date: "May 08, 2026", duration: "25m", score: "72%", partner: "Marco (IT)" },
    { id: 3, title: "Coffee Shop Order", date: "May 07, 2026", duration: "8m", score: "94%", partner: "Yuki (JP)" },
    { id: 4, title: "Job Interview Prep", date: "May 05, 2026", duration: "20m", score: "68%", partner: "Alex (UK)" },
    { id: 5, title: "Travel Directions", date: "May 03, 2026", duration: "15m", score: "88%", partner: "Elena (ES)" },
  ];

  return (
    <div className="container px-4 md:px-8 py-12 mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-heading font-bold">Session History</h1>
        <p className="text-muted-foreground">Review your past conversations and track your progress over time.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search sessions..." />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">
            <Calendar className="mr-2 h-4 w-4" /> Filter by Date
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none">
            <Filter className="mr-2 h-4 w-4" /> All Topics
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id} className="border-none shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-shadow overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                <div className="h-16 w-16 shrink-0 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary">
                  <PlayCircle className="h-8 w-8 group-hover:scale-110 transition-transform cursor-pointer" />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-lg mb-1">{session.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      With {session.partner} • {session.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Date</p>
                    <p className="text-sm font-medium">{session.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Fluency Score</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-primary">{session.score}</p>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px]">Top 10%</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <Button size="sm" variant="outline">View Feedback</Button>
                   <Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Button variant="ghost" className="text-muted-foreground">Load older sessions</Button>
      </div>
    </div>
  )
}
