"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, LayoutDashboard, BookOpen, Sparkles, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams ? searchParams.get("session_id") : null
  const [copied, setCopied] = React.useState(false)

  const handleCopySession = () => {
    if (!sessionId) return
    navigator.clipboard.writeText(sessionId)
    setCopied(true)
    toast.success("Session ID copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const truncatedSessionId = React.useMemo(() => {
    if (!sessionId) return "N/A"
    if (sessionId.length <= 15) return sessionId
    return `${sessionId.substring(0, 10)}...${sessionId.substring(sessionId.length - 8)}`
  }, [sessionId])

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 bg-gradient-to-br from-emerald-500/5 via-background to-background animate-in fade-in duration-700">
      <Card className="max-w-md w-full border border-border/80 bg-card/60 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden p-2">
        <CardHeader className="text-center pt-8 pb-4 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/10 animate-bounce">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" /> Payment Completed
            </span>
            <CardTitle className="text-2xl font-black text-foreground tracking-tight">
              Enrollment Confirmed!
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-8">
          <p className="text-xs text-muted-foreground font-semibold text-center leading-relaxed">
            Thank you for your purchase! Your payment has been successfully processed, and your course materials are now unlocked. You can start learning immediately.
          </p>

          {/* Details Card */}
          <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 space-y-3.5 text-xs font-semibold">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground/80">Order Status</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 shadow-sm">
                Success
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground/80">Access Duration</span>
              <span className="text-foreground font-bold">Lifetime Access</span>
            </div>

            {sessionId && (
              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-muted-foreground/80">Stripe Session ID</span>
                <button
                  onClick={handleCopySession}
                  className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border/40 px-2 py-1 rounded-lg transition-all"
                  title="Click to copy Session ID"
                >
                  <span>{truncatedSessionId}</span>
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full h-11 rounded-xl text-xs font-black uppercase tracking-widest shadow-md shadow-primary/10 gap-2">
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Button>
            </Link>

            <Link href="/courses" className="w-full">
              <Button variant="outline" className="w-full h-11 rounded-xl text-xs font-black uppercase tracking-widest gap-2 border-border/80 hover:bg-muted/50">
                <BookOpen className="w-4 h-4" /> Browse Courses
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[85vh] w-full flex flex-col items-center justify-center p-6 text-center">
          <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground font-bold mt-4 text-xs uppercase tracking-wider">Verifying payment details...</p>
        </div>
      }
    >
      <SuccessContent />
    </React.Suspense>
  )
}
