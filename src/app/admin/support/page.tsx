/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CheckCircle2, MoreVertical, Paperclip, Search, Send } from "lucide-react"
import * as React from "react"

// Mock Data
const MOCK_USERS = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60", unread: 2, status: "online", lastMessage: "I need help with billing." },
  { id: 2, name: "Bob Smith", email: "bob@example.com", avatar: "", unread: 0, status: "offline", lastMessage: "Thank you for the support!" },
  { id: 3, name: "Charlie Davis", email: "charlie@example.com", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=60", unread: 1, status: "online", lastMessage: "Video player is not working." },
]

export default function AdminSupportPage() {
  const [activeUser, setActiveUser] = React.useState(MOCK_USERS[0])
  const [searchQuery, setSearchQuery] = React.useState("")

  // Store messages for each user ID
  const [messagesByUser, setMessagesByUser] = React.useState<Record<number, any[]>>({
    1: [
      { id: 1, sender: "user", content: "Hi, I am Alice Johnson.", timestamp: "09:00 AM" },
      { id: 2, sender: "user", content: "I need help with billing.", timestamp: "09:05 AM" }
    ],
    2: [
      { id: 1, sender: "user", content: "Hi, I am Bob Smith.", timestamp: "09:00 AM" },
      { id: 2, sender: "user", content: "Thank you for the support!", timestamp: "09:05 AM" }
    ],
    3: [
      { id: 1, sender: "user", content: "Hi, I am Charlie Davis.", timestamp: "09:00 AM" },
      { id: 2, sender: "user", content: "Video player is not working.", timestamp: "09:05 AM" }
    ]
  })

  const [inputValue, setInputValue] = React.useState("")
  const endOfMessagesRef = React.useRef<HTMLDivElement>(null)

  const activeMessages = messagesByUser[activeUser.id] || []

  React.useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeMessages, activeUser])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const newMessage = {
      id: Date.now(),
      sender: "admin",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessagesByUser(prev => ({
      ...prev,
      [activeUser.id]: [...(prev[activeUser.id] || []), newMessage]
    }))

    setInputValue("")
  }

  const filteredUsers = MOCK_USERS.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setActiveUser(user)}
                className={cn(
                  "w-full p-4 flex items-start gap-3 text-left transition-colors hover:bg-muted/50",
                  activeUser.id === user.id ? "bg-primary/5 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bottom-0 right-0 h-2.5 w-2.5 border-2 border-card rounded-full",
                    user.status === "online" ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground truncate pr-2">{user.name}</p>
                    {user.unread > 0 && (
                      <span className="flex-shrink-0 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {user.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{user.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Right Area - Chat Window */}
        <Card className="flex-1 flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-card">
          {/* Chat Header */}
          <div className="h-16 px-6 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border shadow-sm">
                <AvatarImage src={activeUser.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{activeUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">{activeUser.name}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">{activeUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Resolve
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground">
                <MoreVertical className="h-4.5 w-4.5" />
              </Button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50 dark:bg-zinc-900/10">
            <div className="flex justify-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border/50">
                Ticket Opened Today
              </span>
            </div>

            {activeMessages.map((msg) => {
              const isAdmin = msg.sender === "admin"
              return (
                <div key={msg.id} className={`flex items-end gap-2 ${isAdmin ? "justify-end" : "justify-start"}`}>
                  {!isAdmin && (
                    <Avatar className="h-8 w-8 border border-border shrink-0 mb-1">
                      <AvatarImage src={activeUser.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">{activeUser.name.charAt(0)}</AvatarFallback>
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
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              )
            })}
            <div ref={endOfMessagesRef} />
          </div>

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
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Reply to ${activeUser.name}...`}
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
        </Card>
      </div>
    </div>
  )
}
