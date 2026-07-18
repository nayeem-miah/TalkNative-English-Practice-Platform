export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
export type CourseType = "FREE" | "PREMIUM" | "PAID"

export interface Lesson {
  id: string
  title: string
  description?: string
  videoUrl?: string
  order: number
  courseId: string
  createdAt?: string
  updatedAt?: string
}

export interface Course {
  id: string
  title: string
  description?: string
  thumbnail?: string
  level: CourseLevel
  type: CourseType
  price: number
  isPublished: boolean
  studentsCount?: number
  createdAt?: string
  updatedAt?: string
  _count?: {
    lessons: number
  }
}

export interface CourseWithProgress extends Course {
  completedCount: number
  totalLessons: number
  percent: number
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  course?: Course
  createdAt?: string
}
