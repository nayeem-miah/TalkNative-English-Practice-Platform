"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle2, Clock, Edit, GripVertical, PlayCircle, Plus, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

// Mock Data
const mockCourse = {
  id: "1",
  title: "English for Beginners",
  description: "Start your journey with basic grammar and vocabulary. This course is designed to give you a solid foundation in spoken and written English.",
  isPublished: true,
  price: 49,
}

const initialLessons = [
  { id: "l1", title: "Introduction to English Alphabet", duration: "10:00", order: 1, isPublished: true },
  { id: "l2", title: "Basic Greetings and Introductions", duration: "15:30", order: 2, isPublished: true },
  { id: "l3", title: "Numbers and Counting", duration: "12:45", order: 3, isPublished: false },
]

export default function CourseDetailsPage() {
  const params = useParams()
  const router = useRouter()

  const [lessons, setLessons] = useState(initialLessons)
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false)
  const [newLesson, setNewLesson] = useState({ title: "", duration: "", videoUrl: "" })

  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false)
  const [editCourse, setEditCourse] = useState({
    title: mockCourse.title,
    description: mockCourse.description,
    level: "BEGINNER",
    price: mockCourse.price,
    type: "PAID",
    isPublished: mockCourse.isPublished ? "true" : "false",
    file: null as File | null
  })

  const handleEditCourse = () => {
    // UI Only: Just close the modal
    setIsEditCourseModalOpen(false)
  }

  const handleAddLesson = () => {
    const lesson = {
      id: crypto.randomUUID(),
      title: newLesson.title,
      duration: newLesson.duration || "0:00",
      order: lessons.length + 1,
      isPublished: false
    }
    setLessons([...lessons, lesson])
    setIsAddLessonModalOpen(false)
    setNewLesson({ title: "", duration: "", videoUrl: "" })
  }

  const handleDeleteLesson = (id: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== id))
  }

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/course')}
            className="text-muted-foreground hover:text-primary -ml-2 h-8 px-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Button>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{mockCourse.title}</h1>
              <Badge variant={mockCourse.isPublished ? "default" : "secondary"} className="rounded-full px-3">
                {mockCourse.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-3xl text-lg">{mockCourse.description}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Dialog open={isEditCourseModalOpen} onOpenChange={setIsEditCourseModalOpen}>
            <DialogTrigger render={<Button variant="outline" className="rounded-xl h-11 px-6 shadow-sm border-border/50" />}>
              <Edit className="w-4 h-4 mr-2" /> Edit Course
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Edit Course</DialogTitle>
                <DialogDescription className="text-base">
                  Update course details including pricing, level, and thumbnail.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-sm font-semibold">Course Title</Label>
                  <Input id="edit-title" value={editCourse.title} onChange={e => setEditCourse({...editCourse, title: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-desc" className="text-sm font-semibold">Description</Label>
                  <Textarea id="edit-desc" value={editCourse.description} onChange={e => setEditCourse({...editCourse, description: e.target.value})} className="rounded-xl resize-none" rows={3} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-level" className="text-sm font-semibold">Level</Label>
                    <select id="edit-level" value={editCourse.level} onChange={e => setEditCourse({...editCourse, level: e.target.value})} className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary">
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type" className="text-sm font-semibold">Type</Label>
                    <select
                      id="edit-type"
                      value={editCourse.type}
                      onChange={e => {
                        const newType = e.target.value;
                        setEditCourse({
                          ...editCourse,
                          type: newType,
                          price: newType === "FREE" ? 0 : editCourse.price
                        });
                      }}
                      className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="PAID">PAID</option>
                      <option value="FREE">FREE</option>
                    </select>
                  </div>
                </div>

                {editCourse.type === "PAID" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Label htmlFor="edit-price" className="text-sm font-semibold">Price ($)</Label>
                    <Input id="edit-price" type="number" min="0" value={editCourse.price} onChange={e => setEditCourse({...editCourse, price: parseFloat(e.target.value) || 0})} className="h-12 rounded-xl" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="edit-file" className="text-sm font-semibold">Thumbnail Image</Label>
                  <Input id="edit-file" type="file" accept="image/*" onChange={e => setEditCourse({...editCourse, file: e.target.files ? e.target.files[0] : null})} className="rounded-xl file:bg-primary/10 file:text-primary file:rounded-lg file:border-0 file:mr-4 file:px-4 file:py-2 hover:file:bg-primary/20 cursor-pointer h-auto py-2" />
                </div>

              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditCourseModalOpen(false)} className="rounded-xl h-11">
                  Cancel
                </Button>
                <Button onClick={handleEditCourse} className="rounded-xl h-11 px-8">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Lessons Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Course Lessons</h2>
            <p className="text-muted-foreground mt-1">Manage and organize the curriculum for this course.</p>
          </div>

          <Dialog open={isAddLessonModalOpen} onOpenChange={setIsAddLessonModalOpen}>
            <DialogTrigger render={<Button className="gap-2 shadow-lg hover:shadow-primary/25 transition-all text-base h-11 px-6 rounded-xl" />}>
                <Plus className="w-5 h-5 mr-2" />
                Add Lesson
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add New Lesson</DialogTitle>
                <DialogDescription className="text-base">
                  Create a new lesson module for this course.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold">Lesson Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Master Spoken English"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-sm font-semibold">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g. 15:30"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video" className="text-sm font-semibold">Video URL (Optional)</Label>
                    <Input
                      id="video"
                      placeholder="https://..."
                      value={newLesson.videoUrl}
                      onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddLessonModalOpen(false)} className="rounded-xl h-11">
                  Cancel
                </Button>
                <Button onClick={handleAddLesson} className="rounded-xl h-11 px-8">
                  Add Lesson
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lesson List */}
        <div className="space-y-3">
          {lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl bg-muted/20 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <PlayCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">No lessons yet</h3>
              <p className="text-muted-foreground mb-6">Start building your course curriculum by adding the first lesson.</p>
              <Button onClick={() => setIsAddLessonModalOpen(true)} className="rounded-xl">Add First Lesson</Button>
            </div>
          ) : (
            lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing p-1">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {lesson.duration}</span>
                      {lesson.isPublished ? (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium"><CheckCircle2 className="w-4 h-4" /> Published</span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">Draft</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-12 sm:pl-0">
                  <Button variant="outline" size="sm" className="h-9 rounded-lg border-border/50">
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="h-9 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
