"use client"

import { formatMessageContent } from "@/utils/chat-utils"
import { motion } from "framer-motion"
import { Bot, Check, Copy, RefreshCw, User, Volume2, VolumeX } from "lucide-react"
import { Message } from "../types"

interface MessageBubbleProps {
  message: Message
  speakingId: string | null
  copiedId: string | null
  onSpeak: (id: string, text: string) => void
  onCopy: (id: string, text: string) => void
  onRegenerate: () => void
}

export function MessageBubble({
  message,
  speakingId,
  copiedId,
  onSpeak,
  onCopy,
  onRegenerate,
}: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 sm:gap-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-teal-500/10">
          <Bot className="w-5 h-5" />
        </div>
      )}

      <div className={`max-w-[88%] sm:max-w-[78%] space-y-1.5 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-3xl p-5 text-sm leading-relaxed shadow-xs ${
            isUser
              ? "bg-gradient-to-r from-teal-600 to-[#0d5c53] text-white rounded-br-none"
              : "bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-100 rounded-bl-none"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap font-medium">{message.content}</p>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-100">
              {formatMessageContent(message.content)}
            </div>
          )}
        </div>

        <div className={`flex items-center gap-2 px-2 text-[11px] text-slate-400 dark:text-slate-500 ${isUser ? "justify-end" : "justify-start"}`}>
          <span>{message.timestamp}</span>

          {!isUser && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onSpeak(message.id, message.content)}
                className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                  speakingId === message.id
                    ? "text-teal-600 dark:text-teal-400 font-bold animate-pulse"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title={speakingId === message.id ? "Stop Speech" : "Listen to Pronunciation"}
              >
                {speakingId === message.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onCopy(message.id, message.content)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Copy response"
              >
                {copiedId === message.id ? <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Regenerate response"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {isUser && (
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 ml-1">
              <User className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
