"use client"

import * as React from "react"
import {
  Phone,
  Clock,
  Star,
  LayoutDashboard,
  Video,
  ChevronLeft,
  Calendar,
  Sparkles
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { useGetCallHistoryQuery } from "@/redux/api/call-api"
import { removeCookie } from "@/utils/cookie"

export default function CallHistoryPage() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const { data: userResponse, isLoading: isUserLoading } = useGetMeQuery(undefined, { skip: !mounted })
  const { data: callHistoryResponse, isLoading: isHistoryLoading } = useGetCallHistoryQuery(undefined, { skip: !mounted })

  const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data
  const calls = callHistoryResponse?.data || []
  const isLoggedIn = !!user && (userResponse?.success !== false)

  React.useEffect(() => {
    if (mounted && !isUserLoading && !isLoggedIn) {
      removeCookie("accessToken")
      removeCookie("refreshToken")
      window.location.href = "/login?redirect=/history"
    }
  }, [mounted, isUserLoading, isLoggedIn])

  if (!mounted || isUserLoading || isHistoryLoading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground font-semibold text-sm">Retrieving speaking history...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground font-semibold text-sm">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Map call history into recent partners format
  const mappedCalls = calls.map((call: any) => {
    const isCaller = call.callerId === user?.id
    const partner = isCaller ? call.callee : call.caller
    
    // Calculate call duration
    let durationStr = "0s"
    if (call.startTime && call.endTime) {
      const diffMs = new Date(call.endTime).getTime() - new Date(call.startTime).getTime()
      const totalSec = Math.floor(diffMs / 1000)
      if (totalSec >= 60) {
        durationStr = `${Math.floor(totalSec / 60)}m`
      } else {
        durationStr = `${totalSec}s`
      }
    }

    return {
      id: call.id,
      name: partner?.name || "Speaking Partner",
      language: isCaller ? `${user?.learningLanguage || 'English'} (Practice)` : `${user?.nativeLanguage || 'Bengali'} (Native)`,
      duration: durationStr,
      rating: 5, // Fallback rating
      dateStr: new Date(call.startTime).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      timeStr: new Date(call.startTime).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit"
      }),
      image: partner?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
    }
  })

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-primary hover:underline gap-1.5 mb-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-heading font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              Speaking History
            </h1>
            <p className="text-muted-foreground font-medium">Review your complete record of practice interactions.</p>
          </div>
          <Link href="/live-call">
            <Button className="h-11 px-5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm gap-2 transition-all shadow-sm">
              <Video className="h-4 w-4" />
              Find Partner
            </Button>
          </Link>
        </div>

        {/* Call Log Cards */}
        {mappedCalls.length === 0 ? (
          <Card className="border-none shadow-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-12 text-center">
            <CardContent className="space-y-4">
              <Phone className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No interactions recorded</h3>
                <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
                  Start connecting with speaking partners to practice English and begin building your learning timeline.
                </p>
              </div>
              <Link href="/live-call" className="inline-block pt-2">
                <Button className="h-11 px-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm gap-2 shadow-sm">
                  Start First Session
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {mappedCalls.map((partner: any) => (
              <Card key={partner.id} className="border-none shadow-sm rounded-2xl bg-white dark:bg-zinc-900 hover:shadow-md transition-all border border-zinc-100 dark:border-zinc-800 group overflow-hidden">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  {/* Left Column: Avatar & Profile */}
                  <div className="flex items-center gap-5">
                    <Avatar className="h-16 w-16 rounded-full border-2 border-zinc-50 dark:border-zinc-800 flex-shrink-0">
                      <AvatarImage src={partner.image} className="object-cover" />
                      <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">{partner.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                        {partner.name}
                      </p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {partner.language}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Date, Duration, Rating */}
                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6 sm:gap-12 border-t sm:border-t-0 pt-4 sm:pt-0 border-zinc-100 dark:border-zinc-800">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {partner.dateStr}
                      </p>
                      <p className="text-xs text-muted-foreground font-semibold">
                        at {partner.timeStr}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">{partner.duration}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mt-0.5">Duration</p>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="flex gap-0.5 justify-end">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < partner.rating ? 'fill-orange-400 text-orange-400' : 'text-zinc-200 dark:text-zinc-800'}`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Conversation Quality</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
