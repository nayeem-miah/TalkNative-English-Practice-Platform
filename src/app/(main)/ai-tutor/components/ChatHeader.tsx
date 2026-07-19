"use client"

import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"

interface ChatHeaderProps {
  onNewChat: () => void
  isGuest?: boolean
  guestRemaining?: number
}

export function ChatHeader({ onNewChat, isGuest, guestRemaining = 5 }: ChatHeaderProps) {
  return (
    <header className="px-3 sm:px-6 py-2.5 sm:py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between z-10 gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 dark:border-teal-400/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-xs sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
              TalkNative AI Tutor
            </h1>
            {isGuest && (
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 shrink-0 whitespace-nowrap">
                Guest: {guestRemaining}/5 left
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">
            Your 24/7 Interactive English Coach
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="h-8 sm:h-9 px-2 sm:px-3 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[11px] sm:text-xs flex items-center gap-1 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="font-semibold">New Chat</span>
        </Button>
      </div>
    </header>
  )
}
