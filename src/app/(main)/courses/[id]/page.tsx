import type { Metadata } from "next"
import { CourseDetailsClient } from "./components/CourseDetailsClient"
import { getCourse } from "./course-fetcher"

interface PageProps {
  params: Promise<{ id: string }>
}

import { cleanTitle } from "@/lib/text"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const course = await getCourse(id)

  if (!course) {
    return {
      title: "Course Details | TalkNative",
      description: "Learn English with TalkNative interactive courses.",
    }
  }

  const cleanedTitle = cleanTitle(course.title)

  // Strip Markdown markers for clean SEO meta description
  const cleanDesc = course.description
    ? course.description
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .substring(0, 155) + "..."
    : "Interactive English practice course on TalkNative."

  return {
    title: `${cleanedTitle} | TalkNative`,
    description: cleanDesc,
    openGraph: {
      title: `${cleanedTitle} | TalkNative`,
      description: cleanDesc,
      images: course.thumbnail ? [{ url: course.thumbnail }] : [],
    },
  }
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { id } = await params
  const course = await getCourse(id)

  return <CourseDetailsClient initialCourse={course} courseId={id} />
}
