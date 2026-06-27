"use client"

import * as React from "react"
import { Send, Paperclip, MoreVertical, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

export default function SupportPage() {
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      sender: "admin",
      content: "Hello! How can we help you today?",
      timestamp: "10:00 AM",
    }
  ])
  const [inputValue, setInputValue] = React.useState("")
  const endOfMessagesRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const newMessage = {
      id: Date.now(),
      sender: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, newMessage])
    setInputValue("")

    // Simulate auto reply from admin after 1 second
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "admin",
          content: "Thank you for reaching out. A support agent will be with you shortly. (This is a simulated auto-response).",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ])
    }, 1000)
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
                <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60" />
              </Avatar>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-background rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground leading-none">TalkNative Support</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Typically replies in a few minutes</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted text-muted-foreground">
            <MoreVertical className="h-4.5 w-4.5" />
          </Button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50 dark:bg-zinc-900/10">
          <div className="flex justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border/50">
              Today
            </span>
          </div>
          
          {messages.map((msg) => {
            const isUser = msg.sender === "user"
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <Avatar className="h-8 w-8 border border-border shrink-0 mb-1">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">A</AvatarFallback>
                    <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60" />
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
                placeholder="Type your message..."
                className="w-full h-11 px-4 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium text-sm placeholder:text-muted-foreground/60"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={!inputValue.trim()}
              className="h-11 px-5 shrink-0 rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/10 transition-all hover:bg-primary/95 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
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
