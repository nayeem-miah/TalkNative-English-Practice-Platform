"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import * as React from "react"

interface InputDockProps {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  onSend: (textToSend?: string) => void
  isLoading: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

export function InputDock({
  input,
  setInput,
  onSend,
  isLoading,
  textareaRef,
}: InputDockProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="p-3 sm:p-5 border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="relative flex flex-col bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-2.5 focus-within:border-teal-500 dark:focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all shadow-sm">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask an English question or paste a sentence to check..."
          rows={1}
          className="w-full bg-transparent border-0 resize-none focus:outline-none focus:ring-0 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-2 max-h-40 font-medium"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between gap-2 pt-1 px-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar min-w-0 flex-1 pr-1">
            <button
              type="button"
              onClick={() => setInput((prev) => (prev ? `${prev} (Grammar Fix)` : "Check grammar of: "))}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-400 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              ✨ Grammar Fix
            </button>
            <button
              type="button"
              onClick={() => setInput((prev) => (prev ? `${prev} (Explain Rule)` : "Explain grammar rule: "))}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-400 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              🔍 Explain Rule
            </button>
            <button
              type="button"
              onClick={() => setInput((prev) => (prev ? `${prev} (IELTS)` : "IELTS Speaking question on: "))}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-400 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              🎤 IELTS Practice
            </button>
          </div>

          <Button
            onClick={() => onSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white shrink-0 shadow-md shadow-teal-600/20 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
