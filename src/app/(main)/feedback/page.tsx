/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Flag, LayoutDashboard, Loader2, Star } from "lucide-react"
import Image from "next/image"
import * as React from "react"

import { Textarea } from "@/components/ui/textarea"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { useCreateReportMutation, useCreateReviewMutation } from "@/redux/api/call-api"
import { removeCookie } from "@/utils/cookie"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

function FeedbackContent() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse call info from query string
  const partnerId = searchParams?.get("partnerId") || ""
  const partnerName = searchParams?.get("partnerName") || "Speaking Partner"
  const partnerAvatar = searchParams?.get("partnerAvatar") || ""
  const durationSec = Number(searchParams?.get("duration") || 0)

  const [rating, setRating] = React.useState(0)
  const [notes, setNotes] = React.useState("")

  // Reporting Modal States
  const [isReporting, setIsReporting] = React.useState(false)
  const [reportReason, setReportReason] = React.useState("INAPPROPRIATE_BEHAVIOR")
  const [reportDesc, setReportDesc] = React.useState("")

  const { data: userResponse, isLoading: isUserLoading } = useGetMeQuery(undefined, { skip: !mounted })
  const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data
  const isLoggedIn = !!user && (userResponse?.success !== false)

  const [createReport, { isLoading: isReportingSubmitting }] = useCreateReportMutation()
  const [createReview] = useCreateReviewMutation()

  React.useEffect(() => {
    if (mounted && !isUserLoading && !isLoggedIn) {
      removeCookie("accessToken")
      removeCookie("refreshToken")
      window.location.href = "/login?redirect=/feedback"
    }
  }, [mounted, isUserLoading, isLoggedIn])

  if (!mounted || isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground font-semibold text-sm">Loading feedback screen...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground font-semibold text-sm">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Format seconds to MM:SS
  const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle saving feedback (notes and rating)
  const handleSubmitFeedback = async (action: "next" | "dashboard") => {
    // If no feedback given (rating is 0 and notes are empty), skip everything and redirect
    if (rating === 0 && !notes.trim()) {
      if (action === "next") {
        router.push("/live-call?autoStart=true")
      } else {
        router.push("/dashboard")
      }
      return
    }

    // If the user typed any private notes, save them in localStorage
    if (notes.trim()) {
      try {
        const savedNotes = JSON.parse(localStorage.getItem("talknative_call_notes") || "[]")
        savedNotes.push({
          partnerName,
          date: new Date().toLocaleDateString(),
          rating: rating || 5, // fallback if they wrote notes but no star rating
          notes: notes.trim()
        })
        localStorage.setItem("talknative_call_notes", JSON.stringify(savedNotes))
      } catch (e) {
        console.error("Failed to save feedback notes locally", e)
      }
    }

    // Call backend API to persist review in MongoDB
    if (partnerId) {
      try {
        await createReview({
          revieweeId: partnerId,
          rating: rating || 5, // fallback if they wrote notes but no star rating
          notes: notes.trim()
        }).unwrap()
      } catch (err) {
        console.error("Failed to persist feedback in database", err)
      }
    }

    toast.success("Feedback saved successfully!")

    if (action === "next") {
      router.push("/live-call?autoStart=true")
    } else {
      router.push("/dashboard")
    }
  }

  // Handle reporting a user
  const handleReportUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partnerId) {
      toast.error("No partner found to report!")
      return
    }
    if (!user) {
      toast.error("You must be logged in to report a user!")
      return
    }

    try {
      await createReport({
        reporterId: user.id || user._id,
        reportedId: partnerId,
        reason: reportReason,
        description: reportDesc
      }).unwrap()

      toast.success("User reported successfully. Our admins will investigate.")
      setIsReporting(false)
      setReportDesc("")
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit report. Please try again.")
    }
  }

  // Default avatar fallback
  const avatarSrc = partnerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="z-10 w-full max-w-lg border border-border/60 bg-card shadow-sm rounded-3xl p-8 sm:p-12 text-center">
        {!isReporting ? (
          <div className="space-y-10">
            {/* Header Profile */}
            <div className="space-y-4">
              <div className="relative mx-auto h-24 w-24 rounded-full border-4 border-[#006D5B]/20 p-1">
                <div className="relative h-full w-full rounded-full overflow-hidden">
                  <Image
                    src={avatarSrc}
                    alt={partnerName}
                    fill
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-heading font-bold text-[#1a2b3b] dark:text-white">
                  Conversation with {partnerName}
                </h1>
                <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary/40 animate-pulse" />
                  Call Duration: {formatDuration(durationSec)}
                </p>
              </div>
            </div>

            <hr className="border-muted/30" />

            {/* Rating Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-heading font-bold text-[#1a2b3b] dark:text-white">How was your conversation?</h2>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform active:scale-90 cursor-pointer"
                  >
                    <Star
                      className={`h-8 w-8 sm:h-10 sm:w-10 ${star <= rating ? 'fill-[#2af5d1] text-[#2af5d1]' : 'text-zinc-200 dark:text-zinc-700'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-3 text-left">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
                Private Notes (Only visible to you):
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add keywords you learned, common mistakes, or things to follow up on next time..."
                className="min-h-[120px] rounded-2xl bg-[#f8faff] dark:bg-zinc-800/50 border-none focus-visible:ring-primary/20 resize-none p-4 transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => handleSubmitFeedback("next")}
                className="w-full h-14 rounded-2xl bg-[#006D5B] hover:bg-[#005a4b] text-white font-bold text-lg gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95 cursor-pointer"
              >
                Find Next Partner
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmitFeedback("dashboard")}
                className="w-full h-14 rounded-2xl border-2 border-muted/20 font-bold text-lg gap-3 hover:bg-muted/10 transition-all active:scale-95 bg-transparent dark:text-white cursor-pointer"
              >
                <LayoutDashboard className="h-5 w-5" />
                Back to Dashboard
              </Button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-muted/20">
              {partnerId ? (
                <button
                  onClick={() => setIsReporting(true)}
                  className="text-xs font-bold text-destructive/60 hover:text-destructive flex items-center gap-1.5 uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <Flag className="h-3.5 w-3.5" />
                  Report User
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={() => router.push("/dashboard")}
                className="text-xs font-bold text-muted-foreground hover:text-[#006D5B] uppercase tracking-widest transition-colors cursor-pointer"
              >
                Skip Feedback
              </button>
            </div>
          </div>
        ) : (
          /* Reporting Sub-Interface */
          <form onSubmit={handleReportUser} className="space-y-8 text-left">
            <div className="text-center space-y-2">
              <Flag className="h-12 w-12 text-destructive mx-auto animate-bounce" />
              <h2 className="text-2xl font-heading font-bold text-[#1a2b3b] dark:text-white">Report {partnerName}</h2>
              <p className="text-sm text-muted-foreground">
                Help us keep TalkNative safe and constructive. Please tell us what happened.
              </p>
            </div>

            <hr className="border-muted/30" />

            {/* Reason Select */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Reason for Report</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full h-12 rounded-xl bg-white dark:bg-zinc-800 border border-muted/20 dark:border-zinc-700/50 p-3 text-sm font-semibold transition-colors focus-visible:ring-primary/20 text-zinc-900 dark:text-white"
              >
                <option value="INAPPROPRIATE_BEHAVIOR" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Inappropriate Behavior / Bullying</option>
                <option value="OFFENSIVE_LANGUAGE" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Offensive Language / Hate Speech</option>
                <option value="SPAM_ADVERTISEMENT" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Spam or Self-Promotion</option>
                <option value="POOR_AUDIO_QUALITY" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Silent / Intentional Disconnection</option>
                <option value="OTHER" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Other Issues</option>
              </select>
            </div>

            {/* Description Area */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Description / Details</label>
              <Textarea
                required
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                placeholder="Please describe the conversation or behavior in detail..."
                className="min-h-[100px] rounded-xl bg-[#f8faff] dark:bg-zinc-800/50 border-none focus-visible:ring-primary/20 resize-none p-4 transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsReporting(false)
                  setReportDesc("")
                }}
                className="flex-1 h-12 rounded-xl border-2 border-muted/20 font-bold hover:bg-muted/10 transition-all dark:text-white bg-transparent cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isReportingSubmitting}
                className="flex-1 h-12 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold gap-2 cursor-pointer"
              >
                {isReportingSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <FeedbackContent />
    </React.Suspense>
  )
}
