/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Send } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { useGetMessagesQuery, useGetUserTicketQuery, useMarkTicketReadMutation } from "@/redux/api/chat-api"
import { formatMessageContent } from "@/utils/chat-utils"
import { Socket, io } from "socket.io-client"

export default function SupportClient() {
  const [inputValue, setInputValue] = React.useState("")
  const [messages, setMessages] = React.useState<any[]>([])
  const [socket, setSocket] = React.useState<Socket | null>(null)
  const [isOtherTyping, setIsOtherTyping] = React.useState(false)

  const endOfMessagesRef = React.useRef<HTMLDivElement>(null)
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Fetch current user
  const { data: userData } = useGetMeQuery()
  const user = (userData as any)?.data || (userData as any)?.result

  // Fetch active ticket for the user
  const { data: ticketData, refetch: refetchTicket } = useGetUserTicketQuery()
  const ticket = (ticketData as any)?.data || (ticketData as any)?.result
  const ticketId = ticket?.id

  // Fetch message history if ticket exists
  const { data: historyData } = useGetMessagesQuery(ticketId, { skip: !ticketId })
  const [markTicketRead] = useMarkTicketReadMutation()

  React.useEffect(() => {
    if (ticketId && ticket?.unreadCount > 0) {
      markTicketRead(ticketId).unwrap().then(() => {
        refetchTicket()
      }).catch(console.error)
    }
  }, [ticketId, ticket?.unreadCount, markTicketRead, refetchTicket])

  React.useEffect(() => {
    if (historyData?.data) {
      setMessages(historyData.data)
    } else if ((historyData as any)?.result) {
      setMessages((historyData as any).result)
    }
  }, [historyData])

  React.useEffect(() => {
    // Determine token
    let token = "";
    if (typeof document !== "undefined") {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; accessToken_js=`);
      if (parts.length === 2) {
        token = parts.pop()?.split(";").shift() || "";
      }
    }
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("accessToken") || "";
    }
    const cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API?.replace('/api/v1', '') || 'http://localhost:5000'

    const newSocket = io(baseUrl, {
      auth: { token: cleanToken }
    })

    setSocket(newSocket)

    if (ticketId) {
      newSocket.emit("joinTicket", ticketId)
    }

    newSocket.on("newMessage", (msg) => {
      setMessages(prev => [...prev, msg])
      setIsOtherTyping(false)
    })

    newSocket.on("typingStart", (data) => {
      if (data.senderId !== user?.id) setIsOtherTyping(true)
    })

    newSocket.on("typingStop", (data) => {
      if (data.senderId !== user?.id) setIsOtherTyping(false)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [ticketId, user?.id])

  React.useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !user?.id) return

    if (socket) {
      const msgPayload = {
        ticketId: ticketId || undefined,
        senderId: user.id,
        senderModel: "USER",
        content: inputValue
      }

      socket.emit("sendMessage", msgPayload)
      setInputValue("")

      // If we didn't have a ticket, refetch ticket shortly after sending so we capture the new active ticket
      if (!ticketId) {
        setTimeout(() => refetchTicket(), 1000)
      }
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Support Chat</h1>
        <p className="text-sm text-muted-foreground font-medium">Get real-time help from our support team.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border border-border shadow-sm">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">A</AvatarFallback>
                <AvatarImage src="/support-avatar.png" />
              </Avatar>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-background rounded-full"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground leading-none">TalkNative Support</p>
                <Badge className="bg-primary/10 text-[#006D5B] dark:text-[#00A38B] hover:bg-primary/20 border-none text-[9px] font-black uppercase py-0.5 px-2 tracking-widest shrink-0">
                   Admin
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-1">Typically replies in a few minutes</p>
            </div>
          </div>

        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50 dark:bg-zinc-900/10">
          {messages.length > 0 ? (
            <div className="flex justify-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border/50">
                {ticket?.createdAt
                  ? new Date(ticket.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Today'}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-primary ml-1" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Send a message to start</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                Our support team is ready to help you with any questions.
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.senderModel === "USER" || msg.isOptimistic
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <Avatar className="h-8 w-8 border border-border shrink-0 mb-1">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">A</AvatarFallback>
                    <AvatarImage src="/support-avatar.png" />
                  </Avatar>
                )}

                <div className={`max-w-[75%] lg:max-w-[65%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-br-sm shadow-md shadow-primary/10"
                        : "bg-white dark:bg-zinc-800 border border-border text-foreground rounded-bl-sm shadow-sm"
                    }`}
                  >
                    {formatMessageContent(msg.content)}
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground mt-1.5 px-1">
                    {msg.timestamp || (msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}
                  </span>
                </div>
              </div>
            )
          })}

          {/* Typing Indicator */}
          {isOtherTyping && (
            <div className="flex items-end gap-2 justify-start animate-in fade-in duration-300">
              <Avatar className="h-8 w-8 border border-border shrink-0 mb-1">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">A</AvatarFallback>
                <AvatarImage src="/support-avatar.png" />
              </Avatar>
              <div className="bg-white dark:bg-zinc-800 border border-border text-foreground rounded-2xl rounded-bl-sm shadow-sm px-4 py-3.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}

          <div ref={endOfMessagesRef} />
        </div>

        {/* Chat Input Area */}
        <div className="p-4 bg-card border-t border-border shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto w-full">

            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  if (socket && ticketId) {
                    socket.emit("typingStart", { ticketId, senderId: user?.id })
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
                    typingTimeoutRef.current = setTimeout(() => {
                      socket.emit("typingStop", { ticketId, senderId: user?.id })
                    }, 1500)
                  }
                }}
                placeholder="Type your message..."
                className="w-full h-11 px-4 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium text-sm placeholder:text-muted-foreground/60"
              />
            </div>

            <Button
              type="submit"
              disabled={!inputValue.trim()}
              className={cn(
                "h-11 px-5 shrink-0 rounded-xl font-bold transition-all active:scale-95 text-white border-none flex items-center justify-center gap-1.5",
                inputValue.trim()
                  ? "bg-[#006D5B] hover:bg-[#005a4b] shadow-md shadow-[#006D5B]/10 cursor-pointer"
                  : "bg-zinc-200 dark:bg-zinc-850 text-zinc-400 dark:text-zinc-550 opacity-60 cursor-not-allowed"
              )}
            >
              <Send className="h-4.5 w-4.5 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
