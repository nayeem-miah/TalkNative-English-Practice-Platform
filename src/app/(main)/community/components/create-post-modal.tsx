import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPublish: (postData: { title: string; category: string; body: string; file: File | null }) => Promise<void>
  isPublishing: boolean
}

export function CreatePostModal({ open, onOpenChange, onPublish, isPublishing }: CreatePostModalProps) {
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")
  const [category, setCategory] = React.useState("Speaking")
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const insertFormat = (formatType: "bold" | "list" | "link") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selected = text.substring(start, end)

    let replacement = ""
    if (formatType === "bold") {
      replacement = `**${selected || "bold text"}**`
    } else if (formatType === "list") {
      replacement = `\n1. ${selected || "List item"}`
    } else if (formatType === "link") {
      replacement = `[${selected || "link text"}](https://)`
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end)
    setContent(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + replacement.length, start + replacement.length)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    await onPublish({ title, category, body: content, file: selectedFile })
    
    // Reset Form
    setTitle("")
    setContent("")
    setCategory("Speaking")
    setImagePreview(null)
    setSelectedFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button className="h-8 px-4 rounded-lg text-xs font-bold bg-primary hover:bg-primary/95 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-none border-none">
            <Plus className="h-3.5 w-3.5" /> New Post
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl border border-zinc-150 dark:border-zinc-850 shadow-xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">Create Post</DialogTitle>
          <DialogDescription className="text-zinc-400 dark:text-zinc-500 text-xs mt-0.5 font-medium">
            Publish lists, instructions, notes, or questions for the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">Title</span>
            <input
              placeholder="e.g. 5 idioms for work conversations"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 focus:border-zinc-300 dark:border-zinc-800 dark:focus:border-zinc-700 bg-background text-xs font-semibold outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">Category</span>
            <Select value={category} onValueChange={(val) => setCategory(val || "Speaking")}>
              <SelectTrigger className="w-full h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-xs font-semibold outline-none focus:ring-0">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-zinc-150 dark:border-zinc-850 bg-card z-50">
                <SelectItem value="Speaking">Speaking</SelectItem>
                <SelectItem value="Vocabulary">Vocabulary</SelectItem>
                <SelectItem value="Grammar">Grammar</SelectItem>
                <SelectItem value="Exams">Exams</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">Body</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertFormat("bold")}
                  className="text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-border bg-muted hover:bg-zinc-100 hover:text-foreground text-muted-foreground transition-all"
                  title="Insert Bold Markdown"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat("list")}
                  className="text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-border bg-muted hover:bg-zinc-100 hover:text-foreground text-muted-foreground transition-all"
                  title="Insert Numbered List"
                >
                  1.
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat("link")}
                  className="text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-border bg-muted hover:bg-zinc-100 hover:text-foreground text-muted-foreground transition-all"
                  title="Insert Link"
                >
                  Link
                </button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              placeholder="Share tips, resources, or ask questions... Use markdown if preferred."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-zinc-300 dark:border-zinc-800 dark:focus:border-zinc-700 bg-background text-xs leading-relaxed outline-none transition-all resize-none min-h-[130px]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">Image Attachment (Optional)</span>
            
            {isPublishing ? (
              <div className="flex flex-col items-center justify-center h-28 w-full border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/5 dark:bg-zinc-900/10 gap-2">
                <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <span className="text-[10px] font-semibold text-zinc-450 uppercase tracking-widest animate-pulse">Uploading Image...</span>
              </div>
            ) : imagePreview ? (
              <div className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-background max-h-[160px] flex items-center justify-center">
                <img src={imagePreview} alt="Uploaded preview" className="w-full h-auto max-h-[160px] object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setSelectedFile(null)
                    }}
                    className="h-8 w-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer transition-colors shadow border-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "flex flex-col items-center justify-center h-28 w-full border-2 border-dashed rounded-xl cursor-pointer transition-all gap-1.5 p-4 group",
                  isDragging
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-zinc-150 hover:border-zinc-250 dark:border-zinc-850 dark:hover:border-zinc-750 bg-zinc-50/20 hover:bg-zinc-50/50 dark:bg-zinc-900/5 dark:hover:bg-zinc-900/20"
                )}
              >
                <div className="h-8 w-8 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 text-zinc-400 group-hover:text-primary transition-colors">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Click or Drag photo here</p>
                  <p className="text-[10px] font-semibold text-zinc-450 mt-0.5">PNG, JPG or WEBP up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-900/80 mt-6">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl px-4 h-9 font-bold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isPublishing} className="bg-primary hover:bg-primary/95 text-white rounded-xl px-5 h-9 font-bold text-xs cursor-pointer border-none shadow-md shadow-primary/10 transition-all disabled:opacity-50">
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
