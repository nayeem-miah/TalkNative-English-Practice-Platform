import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserX, Shield } from "lucide-react"

interface UserStatsProps {
  totalUsersCount: number
  activeUsersCount: number
  suspendedUsersCount: number
  adminUsersCount: number
}

export function UserStats({
  totalUsersCount,
  activeUsersCount,
  suspendedUsersCount,
  adminUsersCount,
}: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <h3 className="text-2xl font-bold">{totalUsersCount}</h3>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-emerald-500/10 p-3 rounded-xl">
            <UserCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Users</p>
            <h3 className="text-2xl font-bold">{activeUsersCount}</h3>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-destructive/10 p-3 rounded-xl">
            <UserX className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Suspended</p>
            <h3 className="text-2xl font-bold">{suspendedUsersCount}</h3>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-blue-500/10 p-3 rounded-xl">
            <Shield className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Admins</p>
            <h3 className="text-2xl font-bold">{adminUsersCount}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
