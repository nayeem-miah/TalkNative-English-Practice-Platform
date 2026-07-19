import { LucideIcon } from "lucide-react"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface StarterCard {
  icon: LucideIcon
  title: string
  description: string
  prompt: string
  color: string
}
