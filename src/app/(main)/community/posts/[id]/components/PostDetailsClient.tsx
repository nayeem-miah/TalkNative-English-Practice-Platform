"use client"

import * as React from "react"
import { useGetSinglePostQuery } from "@/redux/api/community-api"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { PostCard } from "../../../components/post-card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PostDetailsClientProps {
  initialPost: any
  postId: string
}

export function PostDetailsClient({ initialPost, postId }: PostDetailsClientProps) {
  const { data: postResponse, isLoading } = useGetSinglePostQuery(postId)
  const { data: userData } = useGetMeQuery()
  
  const currentUser = userData?.data?.result?.user || userData?.data?.result || userData?.data
  const post = postResponse?.data || postResponse?.result || postResponse || initialPost

  const [openCommentsId, setOpenCommentsId] = React.useState<string | null>(postId)

  if (!post) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-sm font-extrabold text-foreground">Post Not Found</h2>
        <p className="text-xs text-muted-foreground mt-1">This discussion may have been deleted by the author.</p>
        <Link href="/community" className="text-xs text-primary font-bold hover:underline mt-4 inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Feed
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-6 space-y-6">
        <Link href="/community" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Feed
        </Link>

        {isLoading && !post ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <span className="text-[11px] font-semibold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Loading Post...</span>
          </div>
        ) : (
          <PostCard
            post={post}
            currentUser={currentUser}
            index={0}
            openCommentsPostId={openCommentsId}
            setOpenCommentsPostId={setOpenCommentsId}
          />
        )}
      </div>
    </div>
  )
}
