import { Card, CardContent } from "@/components/ui/card"
import { Flag, UserRoundSearch, Users } from "lucide-react"

interface ModerationStatsProps {
  totalReports: number
  reportedUsers: number
  reporters: number
  isLoading: boolean
}

export function ModerationStats({
  totalReports,
  reportedUsers,
  reporters,
  isLoading,
}: ModerationStatsProps) {
  const stats = [
    {
      name: "Total Reports",
      value: totalReports.toLocaleString(),
      icon: Flag,
      color: "text-destructive",
      bg: "bg-destructive/5 dark:bg-destructive/10",
    },
    {
      name: "Reported Users",
      value: reportedUsers.toLocaleString(),
      icon: UserRoundSearch,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      name: "Reporters",
      value: reporters.toLocaleString(),
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card
          key={stat.name}
          className="border-border bg-card shadow-none rounded-xl"
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                {stat.name}
              </p>
              <p className="text-2xl font-bold text-foreground tracking-tighter">
                {isLoading ? "..." : stat.value}
              </p>
            </div>
            <div
              className={`h-11 w-11 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
