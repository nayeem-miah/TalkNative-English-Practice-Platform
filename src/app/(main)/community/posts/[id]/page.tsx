import type { Metadata } from "next"
import { cookies } from "next/headers"
import { PostDetailsClient } from "./components/PostDetailsClient"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getPost(id: string) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value
    const headers: Record<string, string> = {}
    if (token) {
      const cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token
      headers["authorization"] = `Bearer ${cleanToken}`
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api/v1"
    const res = await fetch(`${baseUrl}/community/posts/${id}`, {
      headers,
      cache: "no-store",
    })

    if (!res.ok) return null
    const responseData = await res.json()
    return responseData?.data || responseData?.result || responseData
  } catch (error) {
    console.error("Error fetching post in server component:", error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    return {
      title: "Post Details | TalkNative",
      description: "Discuss and learn English inside the TalkNative community.",
    }
  }

  const cleanBody = post.body ? post.body.substring(0, 155) + "..." : "Join the English discussion on TalkNative."

  return {
    title: `${post.title} | TalkNative Community`,
    description: cleanBody,
  }
}

export default async function PostDetailsPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPost(id)

  return <PostDetailsClient initialPost={post} postId={id} />
}
