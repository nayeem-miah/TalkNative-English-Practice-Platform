"use client"

import * as React from "react"
import { 
  Users, 
  PhoneCall, 
  CreditCard, 
  TrendingUp,
  Search,
  MoreVertical,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const stats = [
  { name: "Total Users", value: "12,482", change: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Live Calls", value: "142", change: "+5%", icon: PhoneCall, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Monthly Revenue", value: "$42,850", change: "+18%", icon: CreditCard, color: "text-[#006D5B]", bg: "bg-[#006D5B]/10" },
  { name: "Success Rate", value: "98.2%", change: "+2%", icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-500/10" },
]

const recentUsers = [
  { name: "James Wilson", email: "james.w@example.com", plan: "Premium", status: "Active", joined: "2 hours ago", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" },
  { name: "Maria Garcia", email: "m.garcia@example.com", plan: "Basic", status: "Active", joined: "5 hours ago", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop" },
  { name: "David Chen", email: "chen.david@example.com", plan: "Free", status: "Inactive", joined: "1 day ago", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" },
]

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-zinc-950 px-6 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-heading font-bold text-[#1a2b3b] dark:text-white">Admin Overview</h1>
            <p className="text-muted-foreground font-medium">Monitoring platform performance and user activity.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users or calls..." className="pl-10 h-10 rounded-full border-muted/20 bg-white dark:bg-zinc-900 focus-visible:ring-primary/20" />
            </div>
            <Button className="rounded-full bg-[#006D5B] hover:bg-[#005a4b] text-white font-bold h-10 px-6 shadow-lg shadow-primary/20 transition-all active:scale-95">
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-none shadow-sm rounded-3xl bg-white dark:bg-zinc-900 overflow-hidden transition-colors border border-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold border-muted/20 bg-muted/5 text-emerald-600">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.name}</p>
                  <p className="text-3xl font-bold text-[#1a2b3b] dark:text-white tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Users Table */}
          <Card className="lg:col-span-8 border-none shadow-sm rounded-3xl bg-white dark:bg-zinc-900 overflow-hidden transition-colors border border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-muted/10">
              <CardTitle className="text-xl font-heading font-bold text-[#1a2b3b] dark:text-white">Recent Users</CardTitle>
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-muted/10 bg-muted/5">
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">User</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Plan</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Joined</th>
                      <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted/5">
                    {recentUsers.map((user) => (
                      <tr key={user.email} className="group hover:bg-muted/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 rounded-xl border border-primary/5">
                              <AvatarImage src={user.image} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-[#1a2b3b] dark:text-white text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground font-medium">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`rounded-full px-3 text-[10px] font-bold ${user.plan === 'Premium' ? 'border-primary/20 bg-primary/5 text-primary' : 'border-muted/20 text-muted-foreground'}`}>
                            {user.plan}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                            <span className="text-sm font-semibold text-[#1a2b3b] dark:text-white">{user.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{user.joined}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Activity Section */}
          <Card className="lg:col-span-4 border-none shadow-sm rounded-3xl bg-white dark:bg-zinc-900 overflow-hidden transition-colors border border-primary/5">
            <CardHeader className="p-6 border-b border-muted/10">
              <CardTitle className="text-xl font-heading font-bold text-[#1a2b3b] dark:text-white">Live Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex gap-4 group cursor-pointer">
                  <div className="h-10 w-10 rounded-xl bg-muted/5 flex-shrink-0 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#1a2b3b] dark:text-white leading-none pt-1">New subscription activated</p>
                    <p className="text-xs text-muted-foreground font-medium">Premium Plan by Alex Johnson</p>
                    <p className="text-[10px] font-bold text-[#006D5B] flex items-center gap-1 uppercase tracking-widest pt-1">
                      Just now <ArrowUpRight className="h-3 w-3" />
                    </p>
                  </div>
                </div>
              ))}
              <Button className="w-full h-12 rounded-2xl border-2 border-muted/20 font-bold text-[10px] uppercase tracking-widest hover:bg-muted/5 transition-all active:scale-95 mt-4" variant="outline">
                View Full Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
