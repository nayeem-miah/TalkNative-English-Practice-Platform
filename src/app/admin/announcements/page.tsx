"use client"

import * as React from "react"
import { Megaphone, Plus, Calendar, ShieldAlert, Star, Search, MoreVertical, Edit, Trash, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock Data
const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "System Maintenance Scheduled",
    content: "We will be performing scheduled maintenance on our servers this Sunday from 2:00 AM to 4:00 AM UTC. During this time, the video calling feature might be temporarily unavailable. We apologize for any inconvenience.",
    date: "Oct 24, 2026",
    type: "system", // system, feature, promotion
    isUrgent: true,
  },
  {
    id: 2,
    title: "New IELTS Speaking Course Available!",
    content: "We are thrilled to announce that our new advanced IELTS Speaking course is now live. Enhance your vocabulary and pronunciation with native speakers starting today. Check the course catalog for more details.",
    date: "Oct 20, 2026",
    type: "feature",
    isUrgent: false,
  },
  {
    id: 3,
    title: "50% Off Weekend Subscription Plan",
    content: "Upgrade to our premium weekend plan and get 50% off for the first 3 months. Valid until the end of this month. Don't miss out on unlimited practice sessions!",
    date: "Oct 15, 2026",
    type: "promotion",
    isUrgent: false,
  },
]

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState(MOCK_ANNOUNCEMENTS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isComposing, setIsComposing] = React.useState(false)

  // New announcement state
  const [newTitle, setNewTitle] = React.useState("")
  const [newContent, setNewContent] = React.useState("")
  const [newType, setNewType] = React.useState("feature")
  const [newUrgent, setNewUrgent] = React.useState(false)

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) return

    const newAnnouncement = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      type: newType,
      isUrgent: newUrgent,
    }

    setAnnouncements([newAnnouncement, ...announcements])
    setIsComposing(false)
    // Reset form
    setNewTitle("")
    setNewContent("")
    setNewType("feature")
    setNewUrgent(false)
  }

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id))
  }

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" /> Announcement Manager
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">Create and manage global alerts for all users.</p>
        </div>
        {!isComposing && (
          <Button onClick={() => setIsComposing(true)} className="bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90 transition-all rounded-xl h-11 px-6">
            <Plus className="h-4.5 w-4.5 mr-2" /> New Announcement
          </Button>
        )}
      </div>

      {/* Compose Form Modal */}
      {isComposing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border shadow-2xl rounded-2xl bg-card animate-in zoom-in-95 duration-200">
            <CardHeader className="bg-muted/30 border-b border-border/50 p-5 sticky top-0 z-10 backdrop-blur-md">
              <CardTitle className="text-lg font-bold">Publish New Announcement</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePublish} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Announcement Title</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Server Maintenance This Sunday"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Content Message</label>
                  <div className="w-full rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all overflow-hidden">
                    <div className="flex items-center gap-1 border-b border-border bg-muted/30 p-2 overflow-x-auto">
                      <div className="flex items-center gap-0.5 pr-2 border-r border-border/50">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"><Bold className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"><Italic className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"><Underline className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"><Strikethrough className="h-4 w-4" /></Button>
                      </div>
                      <div className="flex items-center gap-0.5 px-2 border-r border-border/50">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"><AlignLeft className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"><AlignCenter className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"><AlignRight className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"><AlignJustify className="h-4 w-4" /></Button>
                      </div>
                      <div className="flex items-center gap-0.5 pl-2">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"><LinkIcon className="h-4 w-4" /></Button>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"><ImageIcon className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <textarea 
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Type something..."
                      className="w-full p-4 min-h-[160px] bg-transparent focus:outline-none text-sm resize-none leading-relaxed"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-12 pt-2">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                    <select 
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="h-10 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="feature">Feature Update</option>
                      <option value="system">System Alert</option>
                      <option value="promotion">Promotion/Offer</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Priority</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={newUrgent}
                        onChange={(e) => setNewUrgent(e.target.checked)}
                        className="rounded border-border text-red-500 focus:ring-red-500 h-4 w-4"
                      />
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">Mark as Urgent (Red Highlight)</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/50">
                  <Button type="button" variant="ghost" onClick={() => setIsComposing(false)} className="rounded-xl font-bold text-foreground">
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-xl font-bold bg-[#046c4e] hover:bg-[#03543c] text-white px-8 h-11">
                    Publish to Users
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Past Announcements</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card">
              <Megaphone className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">No announcements found.</p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => {
              const isSystem = announcement.type === "system"
              const isFeature = announcement.type === "feature"
              const isPromo = announcement.type === "promotion"

              return (
                <Card 
                  key={announcement.id} 
                  className={cn(
                    "p-5 border shadow-sm rounded-xl transition-all relative overflow-hidden flex flex-col sm:flex-row gap-5",
                    announcement.isUrgent 
                      ? "border-red-200 dark:border-red-900/50 bg-red-50/10 dark:bg-red-900/5" 
                      : "border-border bg-card"
                  )}
                >
                  <div className="shrink-0 flex sm:flex-col items-center sm:items-start justify-between gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center border shadow-sm shrink-0",
                      isSystem ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300" :
                      isFeature ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                      "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400"
                    )}>
                      {isSystem && <ShieldAlert className="h-5.5 w-5.5" />}
                      {isFeature && <Star className="h-5.5 w-5.5" />}
                      {isPromo && <Megaphone className="h-5.5 w-5.5" />}
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                          isSystem ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-transparent" :
                          isFeature ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50" :
                          "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200/50"
                        )}>
                          {announcement.type}
                        </Badge>
                        {announcement.isUrgent && (
                          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-100 px-2 py-0.5 rounded">Urgent</span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 shrink-0">
                        <Calendar className="h-3.5 w-3.5" /> {announcement.date}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-foreground truncate">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center justify-end gap-2 border-t sm:border-t-0 sm:border-l border-border/50 pt-4 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-primary hover:bg-primary/10 rounded-lg">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(announcement.id)} className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-foreground rounded-lg">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
