import { cookies } from "next/headers"
import { Course } from "@/types/course"

export async function getCourse(id: string): Promise<Course | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value
    const headers: Record<string, string> = {}
    if (token) {
      const cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token
      headers["authorization"] = `Bearer ${cleanToken}`
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api/v1"
    const res = await fetch(`${baseUrl}/courses/${id}`, {
      headers,
      cache: "no-store",
    })

    if (!res.ok) return null
    const responseData = await res.json()
    return responseData?.data || responseData
  } catch (error) {
    console.error("Error fetching course in server component:", error)
    return null
  }
}
