"use client"

import { motion } from "framer-motion"
import { Bot, HelpCircle, Lightbulb, Mic, Sparkles } from "lucide-react"
import { StarterCard } from "../types"

const STARTER_CARDS: StarterCard[] = [
  {
    icon: Lightbulb,
    title: "Correct My Sentence",
    description: "Fix grammar & get detailed explanations",
    prompt: "Please correct this sentence and explain any errors: 'He don't likes going to school yesterday.'",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
  },
  {
    icon: HelpCircle,
    title: "'Since' vs 'For' Rules",
    description: "Learn time prepositions with examples",
    prompt: "Explain the difference between 'Since' and 'For' with clear real-world examples.",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Sparkles,
    title: "Business English Idioms",
    description: "5 essential phrases for workplace meetings",
    prompt: "Give me 5 essential Business English idioms with meanings and example sentences.",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Mic,
    title: "IELTS Speaking Part 1",
    description: "Practice topics with Band 8 sample answers",
    prompt: "Give me 3 popular IELTS Speaking Part 1 questions with model band 8 answers.",
    color: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
  },
]

interface EmptyStateHeroProps {
  onSelectPrompt: (prompt: string) => void
  disabled?: boolean
}

export function EmptyStateHero({ onSelectPrompt, disabled }: EmptyStateHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col items-center justify-center text-center py-8 space-y-8 max-w-3xl mx-auto"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
          <Bot className="w-10 h-10" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
        </div>
      </div>

      <div className="space-y-2 max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          What English practice would you like to do?
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Ask any grammar questions, get instant sentence corrections, practice IELTS speaking, or expand your vocabulary.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left pt-2">
        {STARTER_CARDS.map((card, idx) => {
          const IconComp = card.icon
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPrompt(card.prompt)}
              disabled={disabled}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-400/50 transition-all text-left group flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
