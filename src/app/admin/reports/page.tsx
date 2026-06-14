"use client"

import * as React from "react"
import { 
  FileText, 
  Download, 
  Search,
  PieChart,
  BarChart,
  FileSpreadsheet,
  FileCode,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const availableReports = [
  { id: 1, name: "Revenue Performance Q1", type: "Financial", date: "May 01, 2024", size: "2.4 MB", format: "PDF", icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { id: 2, name: "User Acquisition Metrics", type: "Growth", date: "Apr 28, 2024", size: "1.8 MB", format: "Excel", icon: FileSpreadsheet, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { id: 3, name: "Security Audit Log", type: "Technical", date: "Apr 25, 2024", size: "4.2 MB", format: "JSON", icon: FileCode, color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800" },
]

export default function ReportsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">System Reports</h1>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">Export and archive system-wide data reports for platform oversight.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-11 rounded-xl bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-6 shadow-lg shadow-primary/10 hover:opacity-90 transition-all active:scale-95">
            <Download className="h-4 w-4 mr-2" /> Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { title: "Financial", icon: PieChart, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
           { title: "Operations", icon: BarChart, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
           { title: "Technical", icon: FileCode, color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800" },
         ].map((cat) => (
           <Card key={cat.title} className="border-border bg-card shadow-none rounded-2xl transition-all hover:border-primary/20 cursor-pointer group">
              <CardContent className="p-4 sm:p-6 lg:p-10 flex flex-col items-center text-center space-y-5">
                 <div className={`h-16 w-16 rounded-2xl ${cat.bg} flex items-center justify-center ${cat.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                    <cat.icon className="h-8 w-8" />
                 </div>
                 <div className="space-y-1">
                    <h3 className="font-bold text-foreground text-xl tracking-tight leading-none">{cat.title}</h3>
                    <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Platform Repository</p>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      <Card className="border-border bg-card shadow-none rounded-2xl overflow-hidden">
        <CardHeader className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-8 bg-card">
           <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground tracking-tight">Archived Reports</h2>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">History and documentation</p>
           </div>
           <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
              <Input 
                placeholder="Search report archives..." 
                className="pl-11 h-12 rounded-xl border-border bg-muted/20 transition-all focus:ring-primary/5" 
              />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
             {availableReports.map((report) => (
               <div key={report.id} className="p-8 flex items-center justify-between group hover:bg-muted/20 transition-all duration-300 cursor-default">
                  <div className="flex items-center gap-8">
                     <div className={`h-14 w-14 rounded-xl ${report.bg} flex items-center justify-center ${report.color} group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-sm`}>
                        <report.icon className="h-7 w-7" />
                     </div>
                     <div className="space-y-1.5">
                        <h4 className="font-bold text-foreground text-lg tracking-tight group-hover:text-primary transition-colors">{report.name}</h4>
                        <div className="flex items-center gap-4">
                           <Badge variant="secondary" className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-2 py-0.5 rounded-md bg-muted/50 border-none">
                             {report.type}
                           </Badge>
                           <span className="h-1 w-1 rounded-full bg-border" />
                           <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{report.date}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="text-right hidden sm:block">
                        <p className="text-base font-black text-foreground tracking-tighter leading-none">{report.size}</p>
                        <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">Compressed</p>
                     </div>
                     <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-muted transition-all">
                        <Download className="h-6 w-6 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                     </Button>
                  </div>
               </div>
             ))}
          </div>
        </CardContent>
        <div className="p-8 bg-muted/20 flex justify-center border-t border-border">
           <Button variant="link" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all gap-2 hover:gap-4 duration-300">
              Access Full Data Logs Repository <ArrowRight className="h-4 w-4" />
           </Button>
        </div>
      </Card>
    </div>
  )
}
