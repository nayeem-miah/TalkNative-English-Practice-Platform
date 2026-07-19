/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useAuth } from "@/hooks/use-auth"
import { useGenerateAiTutorResponseMutation } from "@/redux/api/ai-tutor-api"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, Loader2 } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { Message } from "../types"
import { ChatHeader } from "./ChatHeader"
import { EmptyStateHero } from "./EmptyStateHero"
import { GuestLimitModal } from "./GuestLimitModal"
import { InputDock } from "./InputDock"
import { MessageBubble } from "./MessageBubble"

const GUEST_DAILY_LIMIT = 5

export function AiTutorClient() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [speakingId, setSpeakingId] = React.useState<string | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [showLimitModal, setShowLimitModal] = React.useState(false)
  const [guestSentCount, setGuestSentCount] = React.useState(0)

  const { isLoggedIn, mounted } = useAuth()
  const [generateAiTutorResponse, { isLoading: isApiLoading }] = useGenerateAiTutorResponseMutation()
  const isLoading = isSubmitting || isApiLoading

  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const getTodayStorageKey = () => {
    const todayStr = new Date().toISOString().split("T")[0]
    return `ai_tutor_guest_usage_${todayStr}`
  }

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(getTodayStorageKey())
      if (stored) {
        setGuestSentCount(parseInt(stored, 10) || 0)
      }
    }
  }, [mounted, isLoggedIn])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input])

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim()
    if (!messageContent || isLoading) return


    const isGuest = mounted && !isLoggedIn
    if (isGuest) {
      if (guestSentCount >= GUEST_DAILY_LIMIT) {
        setShowLimitModal(true)
        return
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInput("")
    setIsSubmitting(true)

    // Update guest usage count if not logged in
    if (isGuest) {
      const newCount = guestSentCount + 1
      setGuestSentCount(newCount)
      if (typeof window !== "undefined") {
        localStorage.setItem(getTodayStorageKey(), newCount.toString())
      }
    }

    try {
      const historyPayload = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const res = await generateAiTutorResponse({
        message: messageContent,
        history: historyPayload,
      }).unwrap()

      const replyText = res?.data?.reply || (res as any)?.reply

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyText || "I'm sorry, I could not generate a response right now. Please try again!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // If guest just reached their daily limit after this response, pop up the soft login modal
      if (isGuest && guestSentCount + 1 >= GUEST_DAILY_LIMIT) {
        setTimeout(() => setShowLimitModal(true), 1200)
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to connect to AI Tutor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSpeak = (id: string, text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.error("Text-to-Speech is not supported in your browser")
      return
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
      return
    }

    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*#_]/g, "")
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = "en-US"
    utterance.rate = 0.95

    utterance.onend = () => setSpeakingId(null)
    utterance.onerror = () => setSpeakingId(null)

    setSpeakingId(id)
    window.speechSynthesis.speak(utterance)
  }

  const handleNewChat = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setSpeakingId(null)
    setMessages([])
    setInput("")
    toast.info("Started a new chat session")
  }

  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")
    if (lastUserMsg) {
      handleSend(lastUserMsg.content)
    }
  }

  const isGuestMode = mounted && !isLoggedIn
  const guestRemaining = Math.max(0, GUEST_DAILY_LIMIT - guestSentCount)

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-slate-50/60 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl w-full mx-auto flex flex-col flex-1 h-full bg-white dark:bg-slate-900/80 sm:border-x border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-xl">
        <ChatHeader
          onNewChat={handleNewChat}
          isGuest={isGuestMode}
          guestRemaining={guestRemaining}
        />

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {messages.length === 0 ? (
            <EmptyStateHero onSelectPrompt={handleSend} disabled={isLoading} />
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  speakingId={speakingId}
                  copiedId={copiedId}
                  onSpeak={handleSpeak}
                  onCopy={handleCopy}
                  onRegenerate={handleRegenerate}
                />
              ))}
            </AnimatePresence>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start items-center"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-500/10">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 rounded-3xl rounded-bl-none px-5 py-3.5 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
                <span className="font-medium">AI Tutor is thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 sticky bottom-0 z-20">
          <InputDock
            input={input}
            setInput={setInput}
            onSend={handleSend}
            isLoading={isLoading}
            textareaRef={textareaRef}
          />
        </div>
      </div>

      {/* Guest Limit Modal */}
      <GuestLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  )
}
