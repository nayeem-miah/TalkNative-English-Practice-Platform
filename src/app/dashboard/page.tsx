"use client"

import * as React from "react"
import {
  Phone,
  Clock,
  Star,
  ArrowRight,
  ExternalLink,
  Award,
  Video,
  ChevronRight,
  TrendingUp,
  Settings,
  Bell
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { useGetCallHistoryQuery } from "@/redux/api/call-api"
import { removeCookie } from "@/utils/cookie"

export default function UserDashboardPage() {
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
      window.location.href = "/login?redirect=/dashboard"
    }
  }, [mounted, isUserLoading, isLoggedIn])

  if (!mounted || isUserLoading || isHistoryLoading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground font-semibold text-sm">Loading your command center...</p>
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

  // Calculate Statistics dynamically
  const totalSessions = calls.length
  // Sum up durations of all calls in the history (in seconds)
  const totalSeconds = calls.reduce((acc: number, call: any) => {
    if (call.duration) {
      return acc + call.duration
    }
    if (call.startTime && call.endTime) {
      const diffMs = new Date(call.endTime).getTime() - new Date(call.startTime).getTime()
      return acc + Math.floor(diffMs / 1000)
    }
    return acc
  }, 0)
  
  const totalMinutes = Math.floor(totalSeconds / 60)
  const practiceTimeHours = (totalSeconds / 3600).toFixed(1)

  // Map call history into recent partners format
  const recentPartners = calls.slice(0, 3).map((call: any) => {
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
      time: new Date(call.startTime).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }),
      image: partner?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
    }
  })

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-heading font-bold text-zinc-900 dark:text-white tracking-tight">
              Good Morning, {user?.name || "Learner"}
            </h1>
            <p className="text-muted-foreground font-medium">Welcome back to your language learning command center.</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border-emerald-500/20 px-4 py-1.5 rounded-full font-bold text-xs">
              <TrendingUp className="h-3.5 w-3.5 mr-2" />
              +12.5% Performance
            </Badge>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm rounded-xl bg-white dark:bg-zinc-900 transition-colors border border-zinc-100 dark:border-zinc-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shadow-sm">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Sessions</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalSessions}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-xl bg-white dark:bg-zinc-900 transition-colors border border-zinc-100 dark:border-zinc-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 shadow-sm">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Practice Time</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalSeconds}s ({totalMinutes}m / {practiceTimeHours}h)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-xl bg-white dark:bg-zinc-900 transition-colors border border-zinc-100 dark:border-zinc-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 shadow-sm">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg. Rating</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">5.0</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-xl bg-zinc-900 text-white dark:bg-zinc-800 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-primary">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Current Rank</p>
                <p className="text-2xl font-bold">Expert</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Workspace Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Professional CTA */}
            <Card className="border-none shadow-md rounded-2xl bg-[#006D5B] text-white p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Video className="h-48 w-48" />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="space-y-3">
                  <h2 className="text-3xl font-heading font-bold tracking-tight">Ready for your next interaction?</h2>
                  <p className="text-white/80 max-w-lg text-lg font-medium leading-relaxed">Connect with verified native speakers instantly and start sharpening your conversation skills.</p>
                </div>
                <Link href="/live-call" className="inline-block">
                  <Button className="h-14 px-10 rounded-xl bg-white text-[#006D5B] hover:bg-zinc-100 font-bold text-lg gap-3 transition-all active:scale-95 shadow-lg shadow-black/10">
                    <Video className="h-6 w-6" />
                    Start Practice Session
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Structured Table Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Interactions</h3>
                  <p className="text-sm text-muted-foreground font-medium">Your last 3 practice sessions</p>
                </div>
                <Link href="/history" className="text-sm font-bold text-primary flex items-center gap-2 hover:underline tracking-tight">
                  Full History <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
              
              {recentPartners.length === 0 ? (
                <Card className="border-none shadow-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <CardContent className="p-8 text-center space-y-3">
                    <Phone className="h-10 w-10 text-muted-foreground mx-auto opacity-45" />
                    <p className="text-sm text-muted-foreground font-bold">No sessions practiced yet. Start your first session now!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {recentPartners.map((partner: any) => (
                    <Card key={partner.id} className="border-none shadow-sm rounded-xl bg-white dark:bg-zinc-900 hover:shadow-md transition-all border border-zinc-100 dark:border-zinc-800 group">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <Avatar className="h-14 w-14 rounded-xl border-2 border-zinc-50 dark:border-zinc-800">
                            <AvatarImage src={partner.image} className="object-cover" />
                            <AvatarFallback>{partner.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">{partner.name}</p>
                            <p className="text-xs text-muted-foreground font-bold flex items-center gap-2 mt-1">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              {partner.language}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-10">
                          <div className="hidden sm:block text-right">
                            <p className="text-base font-bold text-zinc-900 dark:text-white">{partner.duration}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Session Length</p>
                          </div>
                          <div className="text-right">
                            <div className="flex gap-0.5 mb-1 justify-end">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < partner.rating ? 'fill-orange-400 text-orange-400' : 'text-zinc-200 dark:text-zinc-800'}`} />
                              ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{partner.time}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-primary/5 hover:text-primary transition-colors">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Analytics */}
          <div className="lg:col-span-4 space-y-8">
            {/* Progress Analytics */}
            <Card className="border-none shadow-sm rounded-2xl bg-white dark:bg-zinc-900 p-8 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-zinc-900 dark:text-white uppercase text-xs tracking-widest">Progress Metrics</h3>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-muted-foreground">Weekly Target</span>
                    <span className="text-[#006D5B]">85% achieved</span>
                  </div>
                  <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-[#006D5B] rounded-full shadow-inner" />
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 shadow-sm flex-shrink-0">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">Conversation Master</p>
                      <p className="text-xs text-muted-foreground font-medium mt-1">5 more sessions for next rank</p>
                    </div>
                  </div>
                  <Button className="w-full h-11 rounded-xl bg-zinc-900 text-white dark:bg-zinc-800 hover:bg-zinc-800 font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98]" variant="outline">
                    View Achievements
                  </Button>
                </div>
              </div>
            </Card>

            {/* Resource Cards */}
            <div className="space-y-4 px-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Curated Resources</h3>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="group cursor-pointer bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="h-28 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 opacity-30 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors leading-tight">Mastering Daily Idioms: A Guide for Advanced Learners</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Reading • 5 min</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
