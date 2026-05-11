"use client"

import * as React from "react"
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Globe,
  Download,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const analyticsStats = [
  { name: "Total Active Users", value: "12,842", change: "+14.2%", icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { name: "Avg. Session Time", value: "42m 12s", change: "+5.8%", icon: Clock, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { name: "New Signups", value: "2,401", change: "+22.1%", icon: TrendingUp, color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800" },
  { name: "Partner Match Rate", value: "94.3%", change: "+2.4%", icon: Globe, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10" },
]

export default function AnalyticsPage() {
  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">Platform performance and user engagement metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-background border border-border rounded-lg p-1 flex shadow-sm">
            <Button variant="ghost" size="sm" className="h-8 rounded-md text-[10px] font-bold uppercase tracking-widest bg-muted text-foreground">7 Days</Button>
            <Button variant="ghost" size="sm" className="h-8 rounded-md text-[10px] font-bold uppercase tracking-widest px-4 text-muted-foreground hover:text-foreground transition-colors">30 Days</Button>
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-border bg-background hover:bg-muted transition-all shadow-sm">
             <Calendar className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat) => (
          <Card key={stat.name} className="border-border bg-card shadow-none rounded-xl transition-all hover:border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 text-[9px] font-black px-2 py-0 rounded-full">
                  {stat.change}
                </Badge>
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
        <Card className="lg:col-span-8 border-border bg-card shadow-none rounded-xl overflow-hidden">
           <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between bg-card">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-foreground">Engagement Trends</CardTitle>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Weekly Active Users Distribution</p>
              </div>
              <Button variant="ghost" className="text-[9px] font-bold uppercase tracking-widest gap-2 bg-muted/50 hover:bg-muted h-9 px-5 rounded-lg border border-border transition-all">
                <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export Data
              </Button>
           </CardHeader>
           <CardContent className="p-10 h-[380px] flex items-end justify-between relative px-12 gap-4">
              {[40, 70, 55, 90, 65, 85, 50].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                   <div className="w-full bg-muted/30 border border-border rounded-lg transition-all group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5 relative cursor-pointer" style={{ height: `${h * 2.5}px` }}>
                      <div className="absolute -top-10 left-1/2 -translate-y-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 pointer-events-none whitespace-nowrap z-10 shadow-xl">
                         {h * 124} sessions
                      </div>
                   </div>
                   <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Day {i + 1}</span>
                </div>
              ))}
           </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-border bg-card shadow-none rounded-xl overflow-hidden">
           <CardHeader className="p-6 border-b border-border bg-card">
              <CardTitle className="text-lg font-bold text-foreground">Language Distribution</CardTitle>
           </CardHeader>
           <CardContent className="p-8 space-y-10">
              <div className="relative h-56 w-56 mx-auto">
                 <div className="absolute inset-0 rounded-full border-[18px] border-muted/20" />
                 <div className="absolute inset-0 rounded-full border-[18px] border-primary border-t-transparent border-l-transparent rotate-[35deg] drop-shadow-sm transition-transform duration-1000" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-4xl font-bold text-foreground leading-none">82%</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2 max-w-[80px]">Match Success</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                 {[
                   { name: "Spanish", value: "43%", color: "bg-emerald-500" },
                   { name: "English", value: "40%", color: "bg-primary" },
                   { name: "Mandarin", value: "12%", color: "bg-zinc-400" },
                   { name: "Others", value: "5%", color: "bg-zinc-200 dark:bg-zinc-800" },
                 ].map((lang) => (
                   <div key={lang.name} className="space-y-1 group cursor-default">
                      <div className="flex items-center gap-2">
                         <div className={`h-2.5 w-2.5 rounded-full ${lang.color} transition-transform group-hover:scale-125 shadow-sm`} />
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{lang.name}</span>
                      </div>
                      <span className="text-base font-bold text-foreground block ml-4 leading-none tracking-tighter">{lang.value}</span>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
