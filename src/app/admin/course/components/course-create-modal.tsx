/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Sparkles, Upload } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { useCreateCourseMutation } from "@/redux/api/course-api"
import { CropImageModal } from "./crop-image-modal"

// Zod Schema Validator
const courseSchema = z.object({
  title: z.string().min(1, "Course title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  type: z.enum(["PAID", "FREE"]),
  price: z.number().min(0, "Price must be 0 or more"),
  file: z.any().nullable()
}).refine(data => {
  if (data.type === "PAID") {
    return data.price > 0;
  }
  return true;
}, {
  message: "Price must be greater than $0",
  path: ["price"]
})

interface CourseCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CourseCreateModal({
  open,
  onOpenChange,
}: CourseCreateModalProps) {


  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    level: "BEGINNER",
    price: 0,
    type: "PAID",
    file: null as File | null
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDragging, setIsDragging] = useState(false)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1.2)

  // API mutation hook
  const [createCourse, { isLoading }] = useCreateCourseMutation()

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setNewCourse({
        title: "",
        description: "",
        level: "BEGINNER",
        price: 0,
        type: "PAID",
        file: null
      })
      setPreviewUrl(null)
      setErrors({})
    }
  }, [open])

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
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null
    if (file && file.type.startsWith("image/")) {
      setNewCourse((prev: any) => ({ ...prev, file }))
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setNewCourse((prev: any) => ({ ...prev, file }))
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSave = async () => {
    const result = courseSchema.safeParse(newCourse)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        const path = issue.path[0] as string
        newErrors[path] = issue.message
      })
      setErrors(newErrors)
      toast.error("Please correct the validation errors first.")
      return
    }

    const formData = new FormData()
    formData.append("title", newCourse.title)
    formData.append("description", newCourse.description)
    formData.append("level", newCourse.level)
    formData.append("type", newCourse.type)
    formData.append("price", newCourse.price.toString())
    if (newCourse.file) {
      formData.append("file", newCourse.file)
    }

    try {
      await createCourse(formData).unwrap()
      toast.success("Course created successfully!")
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create course.")
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Course</DialogTitle>
            <DialogDescription className="text-sm">
              Provide core details, thumbnail image, and pricing model for the new course.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="create-title" className="text-sm font-semibold flex items-center gap-1">
                Course Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="create-title"
                placeholder="e.g. Spoken English Pro"
                value={newCourse.title}
                onChange={(e) => {
                  setNewCourse((prev: any) => ({ ...prev, title: e.target.value }))
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }))
                }}
                className={cn("h-11 rounded-xl", errors.title && "border-destructive focus-visible:ring-destructive")}
              />
              {errors.title && <p className="text-xs font-medium text-destructive">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="create-description" className="text-sm font-semibold flex items-center gap-1">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="create-description"
                placeholder="Master the art of spoken English in 30 days..."
                value={newCourse.description}
                onChange={(e) => {
                  setNewCourse((prev: any) => ({ ...prev, description: e.target.value }))
                  if (errors.description) setErrors((prev) => ({ ...prev, description: "" }))
                }}
                className={cn("rounded-xl resize-none", errors.description && "border-destructive focus-visible:ring-destructive")}
                rows={3}
              />
              {errors.description && <p className="text-xs font-medium text-destructive">{errors.description}</p>}
            </div>

            {/* Level & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-level" className="text-sm font-semibold">Level</Label>
                <select
                  id="create-level"
                  value={newCourse.level}
                  onChange={(e) => setNewCourse((prev: any) => ({ ...prev, level: e.target.value }))}
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-type" className="text-sm font-semibold">Type</Label>
                <select
                  id="create-type"
                  value={newCourse.type}
                  onChange={(e) => {
                    const newType = e.target.value
                    setNewCourse((prev: any) => ({
                      ...prev,
                      type: newType,
                      price: newType === "FREE" ? 0 : prev.price,
                    }))
                    if (errors.price && newType === "FREE") setErrors((prev) => ({ ...prev, price: "" }))
                  }}
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="PAID">PAID</option>
                  <option value="FREE">FREE</option>
                </select>
              </div>
            </div>

            {/* Price Field */}
            <div className="space-y-2">
              {newCourse.type === "PAID" ? (
                <>
                  <Label htmlFor="create-price" className="text-sm font-semibold flex items-center gap-1">
                    Price ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="create-price"
                    type="number"
                    min="0"
                    placeholder="e.g. 29.99"
                    value={newCourse.price || ""}
                    onChange={(e) => {
                      setNewCourse((prev: any) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                      if (errors.price) setErrors((prev) => ({ ...prev, price: "" }))
                    }}
                    className={cn("h-11 rounded-xl", errors.price && "border-destructive focus-visible:ring-destructive")}
                  />
                  {errors.price && <p className="text-xs font-medium text-destructive">{errors.price}</p>}
                </>
              ) : (
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">Price</Label>
                  <div className="h-11 flex items-center px-4 rounded-xl border border-border bg-muted/20 text-xs font-bold text-muted-foreground">
                    FREE (No charge)
                  </div>
                </div>
              )}
            </div>

            {/* Drag & Drop Thumbnail Container */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Course Cover Image</Label>
              {previewUrl ? (
                <div className="relative group rounded-2xl overflow-hidden border border-border/50 aspect-video bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Thumbnail Preview"
                    style={{ transform: `scale(${zoomLevel})` }}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsCropModalOpen(true)}
                      className="rounded-xl h-9 font-semibold text-xs gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-primary" /> Crop
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => document.getElementById("create-thumbnail-upload")?.click()}
                      className="rounded-xl h-9 text-xs"
                    >
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setNewCourse((prev: any) => ({ ...prev, file: null }))
                        setPreviewUrl(null)
                        const input = document.getElementById("create-thumbnail-upload") as HTMLInputElement
                        if (input) input.value = ""
                      }}
                      className="rounded-xl h-9 text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("create-thumbnail-upload")?.click()}
                  className={cn(
                    "flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer text-center group",
                    isDragging
                      ? "border-primary bg-primary/5 scale-[0.99]"
                      : "border-border hover:border-primary/50 bg-muted/20 hover:bg-primary/5"
                  )}
                >
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <Upload className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-xs font-bold text-foreground">Drag & drop your course thumbnail here</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Accepts PNG, JPEG, or WEBP (Max 5MB)</p>
                </div>
              )}
              <input
                id="create-thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-xl h-11  font-semibold w-full"
            >
              {isLoading ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Crop Thumbnail Dialog */}
      <CropImageModal
        open={isCropModalOpen}
        onOpenChange={setIsCropModalOpen}
        previewUrl={previewUrl}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        onSave={() => {
          setIsCropModalOpen(false)
          toast.success("Thumbnail cropped successfully!")
        }}
      />
    </>
  )
}
