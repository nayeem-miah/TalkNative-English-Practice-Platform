"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  MessageSquare, 
  Users, 
  Flag,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const moderationStats = [
  { name: "Live Calls", value: "124", icon: MessageSquare, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { name: "Total Users", value: "8.4k", icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { name: "New Reports", value: "18", icon: Flag, color: "text-destructive", bg: "bg-destructive/5 dark:bg-destructive/10" },
]

const recentReports = [
  { id: 1, user: "@marcus_dev", reason: "Inappropriate Language", reporter: "Sarah Jenkins", date: "Oct 24, 2024", status: "Pending", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" },
  { id: 2, user: "@linda_vibe", reason: "Spam Content", reporter: "David Wu", date: "Oct 23, 2024", status: "Pending", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop" },
  { id: 3, user: "@kyle_jones", reason: "Harassment", reporter: "Elena Rossi", date: "Oct 23, 2024", status: "Under Review", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" },
  { id: 4, user: "@tech_wizard", reason: "Suspicious Activity", reporter: "System Bot", date: "Oct 22, 2024", status: "New", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" },
]

export default function ModerationPage() {
  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Moderation Reports</h1>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">Review and manage reported community content and safety protocols.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10 rounded-lg border-border text-[10px] font-bold uppercase tracking-widest px-4 hover:bg-muted transition-all bg-background text-foreground">Filter Reports</Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-border bg-background hover:bg-muted transition-all">
                <Download className="h-4 w-4 text-muted-foreground" />
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {moderationStats.map((stat) => (
          <Card key={stat.name} className="border-border bg-card shadow-none rounded-xl">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground tracking-tighter">{stat.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card shadow-none rounded-xl overflow-hidden">
        <CardHeader className="p-6 border-b border-border bg-card">
          <CardTitle className="text-lg font-bold text-foreground">Recent User Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border bg-muted/30">
                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reported User</th>
                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reason</th>
                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reporter</th>
                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentReports.map((report) => (
                <tr key={report.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-lg border border-border shadow-sm">
                        <AvatarImage src={report.image} className="object-cover" />
                        <AvatarFallback className="bg-muted text-muted-foreground font-bold">{report.user[1]}</AvatarFallback>
                      </Avatar>
                      <p className="font-bold text-foreground text-sm">{report.user}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <Badge variant="outline" className="bg-destructive/5 text-destructive border-destructive/20 text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-tighter shadow-sm">
                      {report.reason}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-xs font-semibold text-muted-foreground">{report.reporter}</td>
                  <td className="px-8 py-5 text-xs text-muted-foreground/80 font-bold uppercase tracking-tighter">{report.date}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 h-9 px-4 font-bold text-[10px] uppercase rounded-lg tracking-widest">Dismiss</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/5 dark:hover:bg-destructive/10 h-9 px-4 font-bold text-[10px] uppercase rounded-lg tracking-widest">Suspend</Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
        <div className="p-6 border-t border-border flex items-center justify-between bg-muted/20">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Showing 1 to 4 of 111 reports</p>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border bg-background shadow-sm hover:bg-muted" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border bg-primary text-primary-foreground font-bold shadow-md">
              <span className="text-[10px] font-bold">1</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-border bg-background transition-all hover:bg-muted">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
