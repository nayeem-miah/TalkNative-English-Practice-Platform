/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CallReport } from "@/types/moderation"

export const getInitials = (name?: string | null, email?: string | null) => {
  const label = name || email || "User"
  return label
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export const formatReason = (reason: string) =>
  reason
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())

export const formatDate = (date?: string) => {
  if (!date) return "N/A"

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const getReportsFromResponse = (response: any): CallReport[] => {
  const payload = response?.data ?? response

  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data

  return []
}
