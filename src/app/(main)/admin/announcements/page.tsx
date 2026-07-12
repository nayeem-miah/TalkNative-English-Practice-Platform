/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Calendar, Edit, Image as ImageIcon, Italic, Link as LinkIcon, Megaphone, MoreVertical, Plus, Search, ShieldAlert, Star, Strikethrough, Trash, Underline } from "lucide-react"
import * as React from "react"

import { useCreateAnnouncementMutation, useDeleteAnnouncementMutation, useGetAnnouncementsQuery, useUpdateAnnouncementMutation } from "@/redux/api/announcement-api"
import { Loader2 } from "lucide-react"

export default function AdminAnnouncementsPage() {
  const { data: apiData, isLoading } = useGetAnnouncementsQuery(undefined)
  const announcements = apiData?.data || apiData?.result || []

  const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation()
  const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation()
  const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [isComposing, setIsComposing] = React.useState(false)

  // New announcement state
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [newTitle, setNewTitle] = React.useState("")
  const [newContent, setNewContent] = React.useState("")
  const [newType, setNewType] = React.useState("FEATURE_UPDATE")
  const [newStatus, setNewStatus] = React.useState("PUBLISHED")
  const [newUrgent, setNewUrgent] = React.useState(false)

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) return

    try {
      if (editingId) {
        await updateAnnouncement({
          id: editingId,
          data: {
            title: newTitle,
            content: newContent,
            category: newType,
            isUrgent: newUrgent,
            status: newStatus,
          }
        }).unwrap()
      } else {
        await createAnnouncement({
          title: newTitle,
          content: newContent,
          category: newType,
          isUrgent: newUrgent,
          status: newStatus,
        }).unwrap()
      }

      setIsComposing(false)
      setEditingId(null)
      // Reset form
      setNewTitle("")
      setNewContent("")
      setNewType("FEATURE_UPDATE")
      setNewStatus("PUBLISHED")
      setNewUrgent(false)
    } catch (error) {
      console.error("Failed to save announcement:", error)
    }
  }

  const handleEdit = (announcement: any) => {
    setEditingId(announcement.id)
    setNewTitle(announcement.title)
    setNewContent(announcement.content)
    setNewType(announcement.category || "FEATURE_UPDATE")
    setNewStatus(announcement.status || "PUBLISHED")
    setNewUrgent(announcement.isUrgent || false)
    setIsComposing(true)
  }

  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeletingId(id)
  }

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteAnnouncement(deletingId).unwrap()
      setDeletingId(null)
    } catch (error) {
      console.error("Failed to delete announcement:", error)
    }
  }

  const filteredAnnouncements = announcements.filter((a: any) =>
    a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Button onClick={() => setIsComposing(true)} className="bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90 transition-all rounded-xl h-11 px-6 w-full sm:w-auto">
            <Plus className="h-4.5 w-4.5 mr-2" /> New Announcement
          </Button>
        )}
      </div>

      {/* Compose Form Modal */}
      {isComposing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border shadow-2xl rounded-2xl bg-card animate-in zoom-in-95 duration-200">
            <CardHeader className="bg-muted/30 border-b border-border/50 p-5 sticky top-0 z-10 backdrop-blur-md">
              <CardTitle className="text-lg font-bold">{editingId ? "Edit Announcement" : "Publish New Announcement"}</CardTitle>
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
                    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
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

                <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-6 sm:gap-8 pt-2">
                  <div className="flex items-center gap-3 shrink-0">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="h-10 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto"
                    >
                      <option value="FEATURE_UPDATE">Feature Update</option>
                      <option value="SYSTEM_ALERT">System Alert</option>
                      <option value="PROMOTION">Promotion/Offer</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="h-10 px-4 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto"
                    >
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </div>

                  <div className="space-y-1 shrink-0">
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

                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-6 border-t border-border/50">
                  <Button type="button" variant="ghost" onClick={() => { setIsComposing(false); setEditingId(null); setNewTitle(""); setNewContent(""); setNewType("FEATURE_UPDATE"); setNewUrgent(false); }} className="rounded-xl font-bold text-foreground w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating || isUpdating} className="rounded-xl font-bold bg-[#046c4e] hover:bg-[#03543c] text-white px-8 h-11 w-full sm:w-auto">
                    {(isCreating || isUpdating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingId ? "Save Changes" : "Publish to Users"}
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
          {isLoading ? (
            <div className="flex justify-center p-12 border border-dashed border-border rounded-2xl bg-card">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card">
              <Megaphone className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">No announcements found.</p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement: any) => {
              const isSystem = announcement.category === "SYSTEM_ALERT"
              const isFeature = announcement.category === "FEATURE_UPDATE"
              const isPromo = announcement.category === "PROMOTION"
              const displayDate = new Date(announcement.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })

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
                          {announcement.category?.replace("_", " ")}
                        </Badge>
                        {announcement.status === "DRAFT" && (
                          <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded">Draft</span>
                        )}
                        {announcement.isUrgent && (
                          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-100 px-2 py-0.5 rounded">Urgent</span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 shrink-0">
                        <Calendar className="h-3.5 w-3.5" /> {displayDate}
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
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(announcement)} className="h-8 w-8 text-zinc-500 hover:text-primary hover:bg-primary/10 rounded-lg">
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
      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-sm border border-border shadow-2xl rounded-2xl bg-card animate-in zoom-in-95 duration-200">
            <CardHeader className="p-5 pb-0">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
                <ShieldAlert className="h-5 w-5" /> Delete Announcement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to delete this announcement? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={() => setDeletingId(null)} className="rounded-xl font-bold">
                  Cancel
                </Button>
                <Button 
                  onClick={confirmDelete} 
                  disabled={isDeleting}
                  className="rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
