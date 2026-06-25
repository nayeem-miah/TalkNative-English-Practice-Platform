export type ReportUser = {
  id: string
  name?: string | null
  email?: string | null
  profilePicture?: string | null
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | null
}

export type CallReport = {
  id: string
  reporterId: string
  reportedId: string
  callId?: string | null
  reason: string
  description?: string | null
  createdAt?: string
  reporter?: ReportUser | null
  reported?: ReportUser | null
}

