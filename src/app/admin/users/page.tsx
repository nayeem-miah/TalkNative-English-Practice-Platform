"use client"

import * as React from "react"
import { 
  Users, 
  Search, 
  UserPlus, 
  Filter,
  Download,
  Eye,
  AlertTriangle,
  UserX,
  ChevronLeft,
  ChevronRight,
  TrendingUp, 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const userStats = [
  { name: "Total Users", value: "12,842", change: "+16%", icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { name: "Live Now", value: "843", change: "Practicing", icon: Users, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { name: "Avg. Fluency", value: "Level B2", change: "Median", icon: TrendingUp, color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800" },
  { name: "Security Alerts", value: "0.4%", change: "-2%", icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10" },
]

const usersList = [
  { id: 1, name: "Elena Rodriguez", email: "elena.r@fluentflow.com", joined: "Oct 12, 2023", level: "B2 Upper", sessions: "142h", status: "Active", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" },
  { id: 2, name: "Marcus Chen", email: "m.chen@provider.net", joined: "Jan 05, 2024", level: "C1 Advanced", sessions: "89h", status: "Warned", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" },
  { id: 3, name: "Sarah Jenkins", email: "sarah.j@fluentflow.com", joined: "Mar 22, 2024", level: "A1 Beginner", sessions: "12h", status: "Suspended", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" },
]

export default function UsersPage() {
  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">Manage and monitor all platform accounts and activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-lg border-border text-[10px] font-bold uppercase tracking-widest px-4 hover:bg-muted bg-background transition-all">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground/60" /> Advanced Filter
          </Button>
          <Button className="h-10 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-6 shadow-lg shadow-primary/10 hover:opacity-90 transition-all active:scale-95">
            <UserPlus className="h-4 w-4 mr-2" /> Add New User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat) => (
          <Card key={stat.name} className="border-border bg-card shadow-none rounded-xl transition-all hover:border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm`}>
                  <stat.icon className="h-5.5 w-5.5" />
                </div>
                <Badge variant="ghost" className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-0">
                  {stat.change}
                </Badge>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{stat.name}</p>
                <p className="text-2xl font-black text-foreground tracking-tighter">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card shadow-none rounded-xl overflow-hidden">
        <CardHeader className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input 
              placeholder="Search users..." 
              className="pl-11 h-12 rounded-xl border-border bg-muted/20 transition-all focus:ring-primary/10"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 rounded-xl border-border bg-background gap-2 font-bold text-[10px] uppercase tracking-widest px-5 hover:bg-muted transition-all text-foreground">
              <Download className="h-4 w-4 text-muted-foreground" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border bg-muted/30">
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">User Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Proficiency</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">History</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Onboarding</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Account State</th>
                <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usersList.map((user) => (
                <tr key={user.id} className="group hover:bg-muted/20 transition-colors cursor-default">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-11 w-11 rounded-xl border border-border shadow-sm">
                        <AvatarImage src={user.image} className="object-cover" />
                        <AvatarFallback className="font-bold bg-muted text-muted-foreground">{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground font-medium tracking-tight leading-none">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-foreground tracking-tight">{user.level}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-muted-foreground/80 tracking-tighter uppercase">{user.sessions}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-muted-foreground/60 tracking-tighter uppercase">{user.joined}</span>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-tighter shadow-sm",
                      user.status === "Active" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" :
                      user.status === "Warned" ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20" :
                      "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
                    )}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 transition-all">
                        <Eye className="h-4.5 w-4.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 transition-all">
                        <AlertTriangle className="h-4.5 w-4.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 transition-all">
                        <UserX className="h-4.5 w-4.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
        <div className="p-8 border-t border-border flex items-center justify-between bg-muted/20">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Registry • 12,842 total accounts monitored</p>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border bg-background hover:bg-muted transition-all shadow-sm" disabled>
              <ChevronLeft className="h-4.5 w-4.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border bg-primary text-primary-foreground font-black text-[10px] shadow-lg shadow-primary/10">1</Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border bg-background hover:bg-muted transition-all shadow-sm">
              <ChevronRight className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
