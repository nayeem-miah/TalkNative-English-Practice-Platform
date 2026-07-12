/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CheckCircle2, MoreVertical, Paperclip, Search, Send } from "lucide-react"
import * as React from "react"

import { useGetMeQuery } from "@/redux/api/auth-api"
import { useGetMessagesQuery, useGetTicketsQuery, useResolveTicketMutation, useMarkTicketReadMutation } from "@/redux/api/chat-api"
import { Socket, io } from "socket.io-client"

export default function AdminSupportPage() {
  const { data: ticketsData, refetch: refetchTickets } = useGetTicketsQuery()
  const tickets = ticketsData?.data || ticketsData?.result || []

  const [activeTicket, setActiveTicket] = React.useState<any>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [messages, setMessages] = React.useState<any[]>([])
  
  const [inputValue, setInputValue] = React.useState("")
  const [socket, setSocket] = React.useState<Socket | null>(null)
  const [isOtherTyping, setIsOtherTyping] = React.useState(false)
  
  const endOfMessagesRef = React.useRef<HTMLDivElement>(null)
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const { data: userData } = useGetMeQuery()
  const adminId = userData?.data?.id || userData?.result?.id

  const { data: historyData } = useGetMessagesQuery(activeTicket?.id, { skip: !activeTicket?.id })
  const [resolveTicket] = useResolveTicketMutation()
  const [markTicketRead] = useMarkTicketReadMutation()

  React.useEffect(() => {
    if (activeTicket?.id && activeTicket?.unreadCount > 0) {
      markTicketRead(activeTicket.id).unwrap().then(() => {
        refetchTickets()
      }).catch(console.error)
    }
  }, [activeTicket?.id, activeTicket?.unreadCount, markTicketRead, refetchTickets])

  React.useEffect(() => {
    if (historyData?.data) {
      setMessages(historyData.data)
    } else if (historyData?.result) {
      setMessages(historyData.result)
    } else {
      setMessages([])
    }
  }, [historyData])

  React.useEffect(() => {
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

    newSocket.on("newMessage", (msg) => {
      setMessages(prev => [...prev, msg])
      setIsOtherTyping(false) // stop typing when message received
      refetchTickets()
    })

    newSocket.on("typingStart", (data) => {
      if (data.senderId !== adminId) setIsOtherTyping(true)
    })

    newSocket.on("typingStop", (data) => {
      if (data.senderId !== adminId) setIsOtherTyping(false)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [refetchTickets, adminId])

  React.useEffect(() => {
    if (socket && activeTicket?.id) {
      socket.emit("joinTicket", activeTicket.id)
    }
  }, [socket, activeTicket?.id])

  React.useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !activeTicket || !adminId) return

    if (socket) {
      const msgPayload = {
        ticketId: activeTicket.id,
        senderId: adminId,
        senderModel: "ADMIN",
        content: inputValue
      }

      socket.emit("sendMessage", msgPayload)
      setInputValue("")
    }
  }

  const handleResolve = async () => {
    if (!activeTicket) return
    try {
      await resolveTicket(activeTicket.id).unwrap()
      refetchTickets()
      setActiveTicket(null)
    } catch (error) {
      console.error("Failed to resolve ticket", error)
    }
  }

  const filteredTickets = tickets.filter((t: any) => t.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-500 pb-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Support Inbox</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage and respond to user support requests.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">3 Active Tickets</span>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">

        {/* Left Sidebar - User List */}
        <Card className="w-80 flex flex-col border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card overflow-hidden shrink-0 hidden lg:flex">
          <div className="p-4 border-b border-border bg-muted/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border/50">
            {filteredTickets.map((ticket: any) => (
              <button
                key={ticket.id}
                onClick={() => setActiveTicket(ticket)}
                className={cn(
                  "w-full p-4 flex items-start gap-3 text-left transition-colors hover:bg-muted/50",
                  activeTicket?.id === ticket.id ? "bg-primary/5 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={ticket.user?.profilePicture || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{ticket.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bottom-0 right-0 h-2.5 w-2.5 border-2 border-card rounded-full",
                    ticket.status === "OPEN" ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground truncate pr-2">{ticket.user?.name || "Unknown User"}</p>
                    {ticket.unreadCount > 0 && (
                      <span className="flex-shrink-0 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {ticket.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{ticket.lastMessage || "No messages yet"}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Right Area - Chat Window */}
        <Card className="flex-1 flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card relative">
          {!activeTicket ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-primary ml-1" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Select a ticket to view messages</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                Choose a conversation from the sidebar to respond to users.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-16 px-6 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border shadow-sm">
                    <AvatarImage src={activeTicket.user?.profilePicture || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{activeTicket.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-none">{activeTicket.user?.name || "Unknown User"}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">{activeTicket.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleResolve} className="h-8 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Resolve
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground">
                    <MoreVertical className="h-4.5 w-4.5" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50 dark:bg-zinc-900/10">
                {messages.length > 0 ? (
                  <div className="flex justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border/50">
                      Ticket Opened
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-center mt-10">
                    <p className="text-sm text-muted-foreground font-medium">No messages yet.</p>
                  </div>
                )}

                {messages.map((msg) => {
                  const isAdmin = msg.senderModel === "ADMIN" || msg.isOptimistic
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isAdmin ? "justify-end" : "justify-start"}`}>
                      {!isAdmin && (
                        <Avatar className="h-8 w-8 border border-border shrink-0 mb-1">
                          <AvatarImage src={activeTicket.user?.profilePicture || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">{activeTicket.user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                      )}

                      <div className={`max-w-[75%] lg:max-w-[65%] flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            isAdmin
                              ? "bg-primary text-primary-foreground rounded-br-sm shadow-md shadow-primary/10"
                              : "bg-white dark:bg-zinc-800 border border-border text-foreground rounded-bl-sm shadow-sm"
                          }`}
                        >
                          <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground mt-1.5 px-1">
                          {msg.timestamp || (msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}
                        </span>
                      </div>
                    </div>
                  )
                })}

                <div ref={endOfMessagesRef} />
              </div>

              {/* Typing Indicator */}
              {isOtherTyping && (
                <div className="flex items-end gap-2 justify-start animate-in fade-in duration-300 absolute bottom-24 left-6 z-10">
                  <div className="bg-white dark:bg-zinc-800 border border-border text-foreground rounded-2xl rounded-bl-sm shadow-sm px-4 py-3.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}

              {/* Chat Input Area */}
              <div className="p-4 bg-card border-t border-border shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto w-full">
                  <Button type="button" variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value)
                        if (socket && activeTicket) {
                          socket.emit("typingStart", { ticketId: activeTicket.id, senderId: adminId })
                          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
                          typingTimeoutRef.current = setTimeout(() => {
                            socket.emit("typingStop", { ticketId: activeTicket.id, senderId: adminId })
                          }, 1500)
                        }
                      }}
                      placeholder={`Reply to ${activeTicket.user?.name || "User"}...`}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium text-sm placeholder:text-muted-foreground/60"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="h-11 px-5 shrink-0 rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/10 transition-all hover:bg-primary/95 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Send className="h-4.5 w-4.5 mr-2" />
                    Reply
                  </Button>
                </form>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
