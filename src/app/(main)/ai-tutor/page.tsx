import type { Metadata } from "next"
import { AiTutorClient } from "./components/AiTutorClient"

export const metadata: Metadata = {
  title: "TalkNative | AI English Tutor",
  description: "Practice English conversation, get sentence corrections, and learn grammar with your 24/7 AI Tutor.",
}

export default function AITutorPage() {
  return <AiTutorClient />
}
