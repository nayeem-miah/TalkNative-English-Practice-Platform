/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Globe, Mic, Sparkles, Users } from "lucide-react"
import Image from "next/image"
import * as React from "react"

export function HeroVisual() {
  const [mounted, setMounted] = React.useState(false)
  const [activeStep, setActiveStep] = React.useState(0)

  React.useEffect(() => {
    setMounted(true)

    // Auto cycle through matching phases to simulate an active call engine
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  // Manual click cycle to let users interact directly
  const handleNextCycle = React.useCallback(() => {
    setActiveStep((prev) => (prev + 1) % 3)
  }, [])

  return (
    <motion.div
      className="relative flex items-center justify-center lg:justify-end"
      initial={mounted ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      {/* Live Matching Dashboard Card */}
      <div className="relative z-10 w-full max-w-[480px] aspect-[4/3] rounded-3xl border border-border/60 bg-card shadow-xl p-5 md:p-6 flex flex-col justify-between overflow-hidden">

        {/* Header bar: System Status */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase select-none">
              Matching Engine Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-full border border-border/30 text-[10px] font-bold text-muted-foreground select-none">
            <Users className="h-3 w-3 text-primary" />
            <span>2,418 online</span>
          </div>
        </div>

        {/* Call simulation core */}
        <div className="flex-1 flex flex-col justify-center my-2 relative">
          <AnimatePresence mode="wait">

            {/* Stage 0: Scanning / Searching */}
            {activeStep === 0 && (
              <motion.div
                key="matching"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center space-y-4"
              >
                <div className="relative flex items-center justify-center h-20 w-20">
                  <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping duration-1000" />
                  <div className="absolute inset-2 rounded-full bg-primary/10 animate-ping duration-1000 delay-300" />
                  <div className="relative h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
                    <Globe className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">Searching for partner...</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Filtering for topic: Hobbies & Culture</p>
                </div>
              </motion.div>
            )}

            {/* Stage 1: Matched / Establishing Connection */}
            {activeStep === 1 && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center space-y-4"
              >
                <div className="flex items-center gap-6 select-none">
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-full bg-muted border border-border/80 flex items-center justify-center font-bold text-xs">
                      YOU
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground">BD 🇧🇩</span>
                  </div>

                  <div className="h-0.5 w-12 bg-gradient-to-r from-primary to-emerald-500 animate-pulse" />

                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 border-2 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center" />
                    <span className="text-[9px] font-bold text-muted-foreground">UK 🇬🇧</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Match Found!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Initializing secure speech room...</p>
                </div>
              </motion.div>
            )}

            {/* Stage 2: Connected / Live Conversation */}
            {activeStep === 2 && (
              <motion.div
                key="connected"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 w-full px-2"
              >
                {/* Active Partner Cards Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Local User Box */}
                  <div className="bg-muted/20 border border-border/40 rounded-xl p-3 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-extrabold text-xs text-primary">
                      BD
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">You (Speaking)</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] text-muted-foreground font-semibold">Microphone active</span>
                      </div>
                    </div>
                  </div>

                  {/* Remote Matched Partner Box */}
                  <div className="bg-muted/20 border border-border/40 rounded-xl p-3 flex items-center gap-3">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                      alt="Sarah from London"
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover border border-border/60"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">Sarah 🇬🇧</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                        <span className="text-[9px] text-muted-foreground font-semibold">Listening...</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversation Catalyst Icebreaker Topic */}
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-3 flex gap-2.5 items-start">
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5 animate-bounce-slow" />
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-primary tracking-wider uppercase">Conversation Catalyst</p>
                    <p className="text-[11px] font-semibold text-foreground/90 leading-relaxed">
                      "What is your favorite travel destination, and what makes it special to you?"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Bottom control bar: Simulated actions */}
        <div className="flex items-center justify-between border-t border-border/40 pt-3.5">
          <div className="flex items-center gap-2">
            <button className="h-8.5 w-8.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center transition-colors hover:bg-emerald-500/20 select-none">
              <Mic className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </button>
            <span className="text-[10px] font-mono font-extrabold text-muted-foreground bg-muted/40 px-2 py-1 rounded border border-border/20 select-none">
              {activeStep === 2 ? "01:24 min" : "00:00"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNextCycle}
              className="h-8.5 px-3.5 rounded-full bg-primary text-primary-foreground font-bold text-[11px] shadow-sm flex items-center gap-1.5 active:scale-[0.96] transition-all hover:opacity-95 select-none"
            >
              <span>Next Match</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Subtle modern offset accent outline frame */}
      <div className="absolute -bottom-3 -left-3 lg:-bottom-4 lg:-right-4 h-full w-full max-w-[480px] border border-primary/10 rounded-3xl -z-10 animate-pulse-slow" />
    </motion.div>
  )
}
