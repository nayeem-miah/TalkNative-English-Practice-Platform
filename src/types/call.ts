import type { User } from "./user"

export type CallStatus = "PENDING" | "ACTIVE" | "ENDED" | "MISSED"

export interface Call {
  id: string
  callerId: string
  calleeId: string
  caller?: User
  callee?: User
  status: CallStatus
  duration?: number
  startTime?: string
  endTime?: string
  roomId?: string
  createdAt?: string
}

export interface RecentPartner {
  id: string
  name: string
  language: string
  duration: string
  rating: number
  time: string
  image: string
}
