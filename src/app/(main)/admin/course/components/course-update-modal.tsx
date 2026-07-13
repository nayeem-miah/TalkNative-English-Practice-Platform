/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Sparkles, Upload } from "lucide-react"

import { useUpdateCourseMutation } from "@/redux/api/course-api"
import { CropImageModal } from "./crop-image-modal"
import { Course } from "../types"

// Zod Schema Validator
const courseSchema = z.object({
  title: z.string().min(1, "Course title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  type: z.enum(["PAID", "FREE"]),
  price: z.number().min(0, "Price must be 0 or more").max(10000, "Price cannot exceed $10,000"),
  file: z.any().nullable()
}).refine(data => {
  if (data.type === "PAID") {
    return data.price > 0;
  }
  return true;
}, {
  message: "Price must be greater than $0 and maximum $10,000",
  path: ["price"]
})

interface CourseUpdateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
}

export function CourseUpdateModal({
  open,
  onOpenChange,
  course,
}: CourseUpdateModalProps) {
  // Form state
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
  const [updateCourse, { isLoading }] = useUpdateCourseMutation()

  // Load course details when it is selected for editing
  useEffect(() => {
    if (open && course) {
      setTimeout(() => {
        setNewCourse({
          title: course.title,
          description: course.description || "",
          level: course.level || "BEGINNER",
          type: course.type || "PAID",
          price: course.price || 0,
          file: null
        })
        setPreviewUrl(course.thumbnail || null)
        setErrors({})
      }, 0)
    }
  }, [open, course])

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
    if (!course) return

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
      await updateCourse({ id: course.id, formData }).unwrap()
      toast.success("Course updated successfully!")
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update course.")
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Course Details</DialogTitle>
            <DialogDescription className="text-sm">
              Modify core details, pricing, and thumbnail image for this course.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="update-title" className="text-sm font-semibold flex items-center gap-1">
                Course Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="update-title"
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
              <Label htmlFor="update-description" className="text-sm font-semibold flex items-center gap-1">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="update-description"
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
                <Label htmlFor="update-level" className="text-sm font-semibold">Level</Label>
                <Select
                  value={newCourse.level}
                  onValueChange={(val) => setNewCourse((prev: any) => ({ ...prev, level: val }))}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none cursor-pointer focus-visible:ring-0">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-border bg-card z-[60]">
                    <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                    <SelectItem value="INTERMEDIATE">INTERMEDIATE</SelectItem>
                    <SelectItem value="ADVANCED">ADVANCED</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-type" className="text-sm font-semibold">Type</Label>
                <Select
                  value={newCourse.type}
                  onValueChange={(val) => {
                    const newType = val || "FREE"
                    setNewCourse((prev: any) => ({
                      ...prev,
                      type: newType,
                      price: newType === "FREE" ? 0 : prev.price,
                    }))
                    if (errors.price && newType === "FREE") setErrors((prev) => ({ ...prev, price: "" }))
                  }}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none cursor-pointer focus-visible:ring-0">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-border bg-card z-[60]">
                    <SelectItem value="PAID">PAID</SelectItem>
                    <SelectItem value="FREE">FREE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Field */}
            <div className="space-y-2">
              {newCourse.type === "PAID" ? (
                <>
                  <Label htmlFor="update-price" className="text-sm font-semibold flex items-center gap-1">
                    Price ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="update-price"
                    type="number"
                    min="0"
                    max="10000"
                    step="0.01"
                    placeholder="e.g. 29.99"
                    value={newCourse.price || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      const rounded = isNaN(val) ? 0 : Math.round(val * 100) / 100;
                      setNewCourse((prev: any) => ({ ...prev, price: rounded }))
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
                      onClick={() => document.getElementById("update-thumbnail-upload")?.click()}
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
                        const input = document.getElementById("update-thumbnail-upload") as HTMLInputElement
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
                  onClick={() => document.getElementById("update-thumbnail-upload")?.click()}
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
                id="update-thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-11 font-semibold"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="rounded-xl h-11 px-8 font-semibold shadow-lg hover:shadow-primary/10"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
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
