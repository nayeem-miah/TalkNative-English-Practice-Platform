import type { Metadata } from "next"
import { CoursesClient } from "./components/CoursesClient"

export const metadata: Metadata = {
  title: "Courses | TalkNative English Practice",
  description: "Explore our collection of interactive English practice courses. Choose from Beginner, Intermediate, and Advanced levels to improve your communication skills.",
}

export default function CoursesPage() {
  return <CoursesClient />
}
