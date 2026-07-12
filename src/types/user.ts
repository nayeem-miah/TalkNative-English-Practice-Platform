export type UserRole = "USER" | "ADMIN"
export type UserStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED"

export interface User {
  id: string
  _id?: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  isVerified: boolean
  profilePicture?: string
  image?: string
  bio?: string
  Phone?: string
  phone?: string
  nativeLanguage?: string
  learningLanguage?: string
  totalMinutesSpent?: number
  createdAt?: string
  updatedAt?: string
}

export interface ApiUserResponse {
  success: boolean
  data?: {
    result?: {
      user?: User
    } | User
  } | User
}
