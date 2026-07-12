export interface Course {
  id: string
  title: string
  description: string
  level: string
  price: number
  type: string
  isPublished: boolean
  thumbnail?: string | null
  createdAt?: string
  updatedAt?: string
  _count?: {
    lessons: number
  }
  studentsCount?: number
  revenue?: number
  progress?: number
}
