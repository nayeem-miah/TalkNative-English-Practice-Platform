"use client"

import * as React from "react"
import { Star, ArrowRight, LayoutDashboard, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"

export default function FeedbackPage() {
  const [rating, setRating] = React.useState(4)

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-zinc-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {/* Soft Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <Card className="z-10 w-full max-w-lg border-none shadow-2xl rounded-[40px] p-8 sm:p-12 text-center bg-white dark:bg-zinc-900 transition-colors">
        <div className="space-y-10">
          {/* Header Profile */}
          <div className="space-y-4">
            <div className="relative mx-auto h-24 w-24 rounded-full border-4 border-[#006D5B]/20 p-1">
              <div className="relative h-full w-full rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Sofia"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-heading font-bold text-[#1a2b3b] dark:text-white">Conversation with Sofia</h1>
              <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary/40 animate-pulse" />
                Call Duration: 24:12
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
                  className="transition-transform active:scale-90"
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
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Private Notes (Only visible to you):</label>
            <Textarea
              placeholder="Add keywords you learned, common mistakes, or things to follow up on next time..."
              className="min-h-[120px] rounded-2xl bg-[#f8faff] dark:bg-zinc-800/50 border-none focus-visible:ring-primary/20 resize-none p-4 transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button className="w-full h-14 rounded-2xl bg-[#006D5B] hover:bg-[#005a4b] text-white font-bold text-lg gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95">
              Find Next Partner
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="block w-full">
              <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-muted/20 font-bold text-lg gap-3 hover:bg-muted/10 transition-all active:scale-95">
                <LayoutDashboard className="h-5 w-5" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <button className="text-xs font-bold text-destructive/60 hover:text-destructive flex items-center gap-2 mx-auto uppercase tracking-widest transition-colors">
            <Flag className="h-3 w-3" />
            Report User
          </button>
        </div>
      </Card>
    </div>
  )
}
