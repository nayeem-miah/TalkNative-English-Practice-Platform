"use client"

import * as React from "react"
import { 
  Users, 
  PhoneCall, 
  ShieldCheck,
  Server,
  Bell,
  ArrowUpRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const systemStats = [
  { name: "Active Sessions", value: "1,284", status: "Live", icon: PhoneCall, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { name: "Daily Signups", value: "452", change: "+12.5%", icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { name: "Safety Health", value: "98.4%", target: "Target: 99%", icon: ShieldCheck, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10" },
  { name: "Server Load", value: "34%", status: "Optimal", icon: Server, color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800" },
]

const liveActivity = [
  { id: 1, type: "New Match", title: "English & Spanish", description: "User_842 and User_119 started a call.", time: "2m ago", icon: PhoneCall, iconColor: "text-emerald-500", iconBg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { id: 2, type: "Report Filed", title: "Safety Alert", description: "Session #FF829 under AI review.", time: "14m ago", icon: ShieldCheck, iconColor: "text-destructive", iconBg: "bg-destructive/5 dark:bg-destructive/10" },
  { id: 3, type: "Milestone", title: "C1 Assessment", description: "User_429 completed advanced test.", time: "45m ago", icon: ShieldCheck, iconColor: "text-blue-500", iconBg: "bg-blue-50 dark:bg-blue-500/10" },
]

export default function AdminDashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">System Overview</h1>
          <p className="text-sm text-muted-foreground font-medium">Platform performance and activity metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Operational</span>
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-border bg-background hover:bg-muted transition-colors">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => (
          <Card key={stat.name} className="border-border bg-card shadow-none rounded-xl transition-all hover:border-primary/20">
            <CardContent className="p-6 space-y-5">
               <div className="flex items-center justify-between">
                  <div className={`h-11 w-11 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-5.5 w-5.5" />
                  </div>
                  {stat.change && (
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" /> {stat.change}
                    </div>
                  )}
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{stat.name}</p>
                  <p className="text-3xl font-bold text-foreground tracking-tighter">{stat.value}</p>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Usage Analytics */}
        <Card className="lg:col-span-8 border-border bg-card shadow-none rounded-xl overflow-hidden">
           <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-foreground">Usage Trends</CardTitle>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Weekly Active Users Distribution</p>
              </div>
              <div className="flex gap-1 bg-muted/50 p-1 rounded-lg border border-border">
                 <Button variant="ghost" size="sm" className="h-7 px-3 rounded-md text-[10px] font-bold uppercase bg-background shadow-sm border border-border text-foreground">24h</Button>
                 <Button variant="ghost" size="sm" className="h-7 px-3 rounded-md text-[10px] font-bold uppercase text-muted-foreground">7d</Button>
              </div>
           </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-10 h-[380px] flex items-end justify-center">
              <div className="w-full h-full relative group">
                 {/* Theme-aware Curve */}
                 <svg viewBox="0 0 1000 300" className="w-full h-full text-muted/20 fill-none stroke-[2] stroke-primary drop-shadow-sm">
                   <path d="M0,250 Q200,280 400,200 T800,100 T1000,50" />
                 </svg>
                 <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4 pt-4 border-t border-border">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:59</span>
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* Real-time Activity */}
        <Card className="lg:col-span-4 border-border bg-card shadow-none rounded-xl overflow-hidden">
           <CardHeader className="p-6 border-b border-border">
              <CardTitle className="text-lg font-bold text-foreground">Live Activity</CardTitle>
           </CardHeader>
           <CardContent className="p-0">
              <div className="divide-y divide-border">
                {liveActivity.map((activity) => (
                  <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-muted/30 transition-colors group cursor-default">
                     <div className={`h-10 w-10 rounded-lg ${activity.iconBg} flex items-center justify-center ${activity.iconColor} flex-shrink-0 shadow-sm`}>
                        <activity.icon className="h-5 w-5" />
                     </div>
                     <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                           <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{activity.type}</p>
                           <p className="text-[9px] text-muted-foreground/60 font-bold uppercase">{activity.time}</p>
                        </div>
                        <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{activity.title}</h4>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{activity.description}</p>
                     </div>
                  </div>
                ))}
              </div>
           </CardContent>
           <div className="p-6 border-t border-border text-center">
              <Button variant="link" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors h-auto p-0">
                 Access Full History Monitor
              </Button>
           </div>
        </Card>
      </div>
    </div>
  )
}
