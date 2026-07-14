import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  Loader2,
  Strikethrough,
  Underline,
} from "lucide-react"
import * as React from "react"

interface AnnouncementFormModalProps {
  isOpen: boolean
  onClose: () => void
  onPublish: (e: React.FormEvent) => Promise<void>
  editingId: string | null
  newTitle: string
  setNewTitle: (t: string) => void
  newContent: string
  setNewContent: (c: string) => void
  newType: string
  setNewType: (cat: string) => void
  newStatus: string
  setNewStatus: (s: string) => void
  newUrgent: boolean
  setNewUrgent: (u: boolean) => void
  isSaving: boolean
}

export function AnnouncementFormModal({
  isOpen,
  onClose,
  onPublish,
  editingId,
  newTitle,
  setNewTitle,
  newContent,
  setNewContent,
  newType,
  setNewType,
  newStatus,
  setNewStatus,
  newUrgent,
  setNewUrgent,
  isSaving,
}: AnnouncementFormModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border shadow-2xl rounded-2xl bg-card animate-in zoom-in-95 duration-200">
        <CardHeader className="bg-muted/30 border-b border-border/50 p-5 sticky top-0 z-10 backdrop-blur-md">
          <CardTitle className="text-lg font-bold">
            {editingId ? "Edit Announcement" : "Publish New Announcement"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={onPublish} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Announcement Title
              </label>
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
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Content Message
              </label>
              <div className="w-full rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all overflow-hidden">
                <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
                  <div className="flex items-center gap-0.5 pr-2 border-r border-border/50">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      <Strikethrough className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-0.5 px-2 border-r border-border/50">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      <AlignJustify className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-0.5 pl-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
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
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Category
                </label>
                <Select
                  value={newType}
                  onValueChange={(val) => setNewType(val || "FEATURE_UPDATE")}
                >
                  <SelectTrigger className="h-10 px-4 rounded-xl border border-border bg-background text-sm font-medium focus-visible:ring-0 w-full sm:w-[160px] cursor-pointer">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-border bg-card z-[60]">
                    <SelectItem value="FEATURE_UPDATE">Feature Update</SelectItem>
                    <SelectItem value="SYSTEM_ALERT">System Alert</SelectItem>
                    <SelectItem value="PROMOTION">Promotion/Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Status
                </label>
                <Select
                  value={newStatus}
                  onValueChange={(val) => setNewStatus(val || "PUBLISHED")}
                >
                  <SelectTrigger className="h-10 px-4 rounded-xl border border-border bg-background text-sm font-medium focus-visible:ring-0 w-full sm:w-[140px] cursor-pointer">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-border bg-card z-[60]">
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 shrink-0">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
                  Priority
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUrgent}
                    onChange={(e) => setNewUrgent(e.target.checked)}
                    className="rounded border-border text-red-500 focus:ring-red-500 h-4 w-4"
                  />
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    Mark as Urgent (Red Highlight)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-6 border-t border-border/50">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="rounded-xl font-bold text-foreground w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-xl font-bold bg-[#046c4e] hover:bg-[#03543c] text-white px-8 h-11 w-full sm:w-auto"
              >
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? "Save Changes" : "Publish to Users"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
