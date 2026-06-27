"use client"

import * as React from "react"
import { Megaphone, Bell, Calendar, ArrowRight, ShieldAlert, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock Data
const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "System Maintenance Scheduled",
    content: "We will be performing scheduled maintenance on our servers this Sunday from 2:00 AM to 4:00 AM UTC. During this time, the video calling feature might be temporarily unavailable. We apologize for any inconvenience.",
    date: "Oct 24, 2026",
    type: "system", // system, feature, promotion
    isUrgent: true,
  },
  {
    id: 2,
    title: "New IELTS Speaking Course Available!",
    content: "We are thrilled to announce that our new advanced IELTS Speaking course is now live. Enhance your vocabulary and pronunciation with native speakers starting today. Check the course catalog for more details.",
    date: "Oct 20, 2026",
    type: "feature",
    isUrgent: false,
  },
  {
    id: 3,
    title: "50% Off Weekend Subscription Plan",
    content: "Upgrade to our premium weekend plan and get 50% off for the first 3 months. Valid until the end of this month. Don't miss out on unlimited practice sessions!",
    date: "Oct 15, 2026",
    type: "promotion",
    isUrgent: false,
  },
  {
    id: 4,
    title: "Updated Privacy Policy",
    content: "We have updated our privacy policy to better protect your data and comply with the latest regulations. Please take a moment to review the changes on our policy page.",
    date: "Oct 01, 2026",
    type: "system",
    isUrgent: false,
  },
]

export default function UserAnnouncementsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" /> Announcements
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">Stay updated with the latest news, features, and system alerts.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
          <Bell className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">{ANNOUNCEMENTS.length} Updates</span>
        </div>
      </div>

      <div className="space-y-6">
        {ANNOUNCEMENTS.map((announcement) => {
          const isSystem = announcement.type === "system"
          const isFeature = announcement.type === "feature"
          const isPromo = announcement.type === "promotion"
          
          return (
            <Card 
              key={announcement.id} 
              className={cn(
                "p-6 sm:p-8 border rounded-2xl shadow-sm transition-all hover:shadow-md relative overflow-hidden group",
                announcement.isUrgent 
                  ? "border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10" 
                  : "border-zinc-200/80 dark:border-zinc-800/80 bg-card hover:border-primary/30"
              )}
            >
              {announcement.isUrgent && (
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                   <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-8 py-1 rotate-45 translate-x-[30%] translate-y-[50%] shadow-sm">
                      Urgent
                   </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="shrink-0">
                  <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center border shadow-sm",
                    isSystem ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300" :
                    isFeature ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                    "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400"
                  )}>
                    {isSystem && <ShieldAlert className="h-5.5 w-5.5" />}
                    {isFeature && <Star className="h-5.5 w-5.5" />}
                    {isPromo && <Megaphone className="h-5.5 w-5.5" />}
                  </div>
                </div>
                
                <div className="space-y-3 flex-1">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                        isSystem ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-transparent" :
                        isFeature ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50" :
                        "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200/50"
                      )}>
                        {announcement.type}
                      </Badge>
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {announcement.date}
                      </span>
                    </div>
                    <h2 className={cn(
                      "text-xl font-bold tracking-tight",
                      announcement.isUrgent ? "text-red-600 dark:text-red-400" : "text-foreground group-hover:text-primary transition-colors"
                    )}>
                      {announcement.title}
                    </h2>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {announcement.content}
                  </p>
                  
                  {isPromo && (
                    <div className="pt-2">
                      <span className="inline-flex items-center text-sm font-bold text-orange-600 dark:text-orange-400 cursor-pointer hover:underline underline-offset-4">
                        Claim Offer <ArrowRight className="ml-1.5 h-4 w-4" />
                      </span>
                    </div>
                  )}
                  {isFeature && (
                    <div className="pt-2">
                      <span className="inline-flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline underline-offset-4">
                        Explore Now <ArrowRight className="ml-1.5 h-4 w-4" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
