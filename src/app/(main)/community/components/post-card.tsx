"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  useAddCommentMutation,
  useGetSinglePostQuery,
  useToggleLikeMutation,
} from "@/redux/api/community-api"
import { Comment, Post } from "@/types/community"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, MessageSquare, Send, Share2 } from "lucide-react"
import Image from "next/image"
import * as React from "react"
import { toast } from "sonner"

interface PostCardProps {
  post: Post
  currentUser: {
    name?: string
    profilePicture?: string
    image?: string
    role?: string
  } | null
  index: number
  openCommentsPostId: string | null
  setOpenCommentsPostId: (id: string | null) => void
}

export function PostCard({
  post,
  currentUser,
  index,
  openCommentsPostId,
  setOpenCommentsPostId,
}: PostCardProps) {
  const isCommentsOpen = openCommentsPostId === post.id
  const { data: singlePostData, isLoading: isCommentsLoading } = useGetSinglePostQuery(post.id, {
    skip: !isCommentsOpen,
  })

  const [toggleLike] = useToggleLikeMutation()
  const [addComment] = useAddCommentMutation()
  const [newCommentText, setNewCommentText] = React.useState("")

  const handleLike = async () => {
    try {
      await toggleLike(post.id).unwrap()
    } catch {
      toast.error("Failed to update like status.")
    }
  }

  const handleShare = () => {
    const fakeLink = `${window.location.origin}/community/posts/${post.id}`
    navigator.clipboard.writeText(fakeLink)
    toast.success("Share link copied!")
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim()) return

    try {
      await addComment({ postId: post.id, content: newCommentText }).unwrap()
      setNewCommentText("")
      toast.success("Comment added! 💬")
    } catch {
      toast.error("Failed to add comment.")
    }
  }

  const singlePost = singlePostData?.data || singlePostData?.result || singlePostData
  const commentsList = singlePost?.comments || []

  const likesCount = post._count?.likes ?? 0
  const commentsCount = post._count?.comments ?? 0
  const isLiked = post.isLiked ?? false

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      layout
      className="border-b border-zinc-100 dark:border-zinc-900/50 pb-8"
    >
      <div className="space-y-3">
        {/* Author Header */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border-none shadow-none">
              <AvatarImage src={post.author?.profilePicture || post.author?.avatar} />
              <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                {post.author?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{post.author?.name}</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">{post.author?.role}</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}
          </span>
        </div>

        {/* Post body */}
        <div className="space-y-1.5 pl-9">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-snug tracking-tight">
              {post.title}
            </h2>
            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 border border-zinc-150 dark:border-zinc-850 px-1.5 py-0.5 rounded-md tracking-wide uppercase">
              {post.category}
            </span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-350 text-xs leading-relaxed whitespace-pre-wrap font-medium">
            {post.body}
          </p>
          {post.image && (
            <div className="mt-3 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-900/60 max-h-[300px] flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/10 animate-in fade-in duration-300">
              <Image
                width={500}
                height={500}
                src={post.image}
                alt="Post media"
                className="w-full h-auto max-h-[300px] object-cover"
              />
            </div>
          )}
        </div>

        {/* Micro actions panel */}
        <div className="flex items-center gap-5 pl-9 text-xs text-zinc-400 dark:text-zinc-500 pt-1 shrink-0">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer ${
              isLiked ? "text-red-500 font-semibold" : ""
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-[11px]">{likesCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
            className={`flex items-center gap-1 hover:text-primary transition-colors cursor-pointer ${
              isCommentsOpen ? "text-primary font-semibold" : ""
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-[11px]">{commentsCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-zinc-650 dark:hover:text-zinc-350 transition-colors cursor-pointer ml-auto text-[10px] font-bold uppercase tracking-wider"
          >
            <Share2 className="h-3 w-3" />
            <span>Share</span>
          </button>
        </div>

        {/* Nested comments */}
        <AnimatePresence>
          {isCommentsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pl-9 pt-3 space-y-3"
            >
              {isCommentsLoading ? (
                <div className="flex items-center gap-2 py-1 text-[11px] text-zinc-450 dark:text-zinc-500">
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  <span>Loading comments...</span>
                </div>
              ) : commentsList.length > 0 ? (
                <div className="space-y-3 border-l border-zinc-100 dark:border-zinc-900/60 pl-3">
                  {commentsList.map((comment: Comment) => (
                    <div key={comment.id} className="space-y-1 text-xs">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{comment.author?.name}</span>
                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{comment.author?.role}</span>
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 ml-auto">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-350 font-medium text-[11px] leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 italic py-1 pl-3">No comments yet. Be the first to reply!</div>
              )}

              {/* Comment box */}
              <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2">
                <Avatar className="h-6 w-6 border-none shadow-none">
                  <AvatarImage src={currentUser?.profilePicture || currentUser?.image} />
                  <AvatarFallback className="bg-primary/5 text-primary text-[9px] font-bold">
                    {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 px-3 py-1 text-xs border border-transparent hover:border-zinc-100 focus:border-zinc-150 dark:hover:border-zinc-900 dark:focus:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-lg outline-none transition-all font-semibold"
                  required
                />
                <Button type="submit" size="icon" className="h-7 w-7 bg-primary hover:bg-primary/95 text-white rounded-lg cursor-pointer border-none shadow-none">
                  <Send className="h-3 w-3" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
