import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mic, Video, History, Star, TrendingUp, Clock } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container px-4 md:px-8 py-12 mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Welcome back, Nayeem!</h1>
          <p className="text-muted-foreground">Ready to continue your English journey today?</p>
        </div>
        <Button className="h-11 px-8 rounded-full shadow-lg shadow-primary/20">
          <Mic className="mr-2 h-4 w-4" /> Start Practice Session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Current Level" value="B2" subValue="Upper Intermediate" icon={Star} color="text-yellow-500" />
        <StatsCard title="Total Sessions" value="48" subValue="+12 this month" icon={Video} color="text-blue-500" />
        <StatsCard title="Fluency Score" value="76%" subValue="+5% improvement" icon={TrendingUp} color="text-emerald-500" />
        <StatsCard title="Practice Time" value="12.5h" subValue="2.4h this week" icon={Clock} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="font-heading">Recent Activity</CardTitle>
            <CardDescription>Your last 5 practice sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <History className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Job Interview Simulation</p>
                    <p className="text-xs text-muted-foreground">May 10, 2026 • 15 minutes</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Excellent Progress
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="font-heading">Goals & Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Daily Practice (15m)</span>
                <span className="font-bold">12/15m</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[80%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weekly Vocabulary (50 words)</span>
                <span className="font-bold">32/50</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[64%]" />
              </div>
            </div>
            <Button variant="outline" className="w-full">View All Goals</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({ title, value, subValue, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-xl shadow-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg bg-muted`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{subValue}</p>
        </div>
      </CardContent>
    </Card>
  )
}
