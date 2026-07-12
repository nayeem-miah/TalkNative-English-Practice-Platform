"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Award, BookOpen, Compass, TrendingUp } from "lucide-react"

export function LearningSidebar() {
  return (
    <div className="lg:col-span-4 space-y-8">
      {/* Weekly Target Progress */}
      <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm rounded-2xl bg-white dark:bg-zinc-900/60 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-xs tracking-wider uppercase">Learning Progress</h3>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-400">Weekly Target</span>
              <span className="text-primary font-bold">85% achieved</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-primary rounded-full" />
            </div>
          </div>

          <div className="pt-5 border-t border-zinc-150 dark:border-zinc-850 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500 dark:text-amber-400 flex-shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Weekly Streak</p>
                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">5 target days completed</p>
              </div>
            </div>
            <Button className="w-full h-9 rounded-lg font-bold text-[11px] uppercase tracking-wider cursor-pointer" variant="outline">
              View Progress Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Recommended Resources */}
      <div className="space-y-4 px-1">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recommended Resources</h3>
        <div className="space-y-3">
          <div className="group cursor-pointer bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
              <BookOpen className="h-3 w-3" />
              Speaking Guide
            </div>
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-primary leading-snug">
              Mastering Daily Idioms: A Practical Guide for Advanced Learners
            </p>
          </div>

          <div className="group cursor-pointer bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
              <Compass className="h-3 w-3" />
              Pronunciation
            </div>
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 leading-snug">
              Understanding Intonation Patterns in Conversational English
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
