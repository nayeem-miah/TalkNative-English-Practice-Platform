/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { useCreateAnnouncementMutation, useDeleteAnnouncementMutation, useGetAnnouncementsQuery, useUpdateAnnouncementMutation } from "@/redux/api/announcement-api"
import { Loader2, Megaphone, Plus, Search } from "lucide-react"
import * as React from "react"

import { AnnouncementCard } from "./components/AnnouncementCard"
import { AnnouncementFormModal } from "./components/AnnouncementFormModal"
import { DeleteConfirmModal } from "./components/DeleteConfirmModal"

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
    if (!deletingId) return
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
      <AnnouncementFormModal
        isOpen={isComposing}
        onClose={() => {
          setIsComposing(false)
          setEditingId(null)
          setNewTitle("")
          setNewContent("")
          setNewType("FEATURE_UPDATE")
          setNewUrgent(false)
        }}
        onPublish={handlePublish}
        editingId={editingId}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newContent={newContent}
        setNewContent={setNewContent}
        newType={newType}
        setNewType={setNewType}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        newUrgent={newUrgent}
        setNewUrgent={setNewUrgent}
        isSaving={isCreating || isUpdating}
      />

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
            filteredAnnouncements.map((announcement: any) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
