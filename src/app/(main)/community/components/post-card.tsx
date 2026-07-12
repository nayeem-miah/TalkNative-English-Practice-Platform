"use client"

/* eslint-disable react-hooks/set-state-in-effect */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  useAddCommentMutation,
  useDeletePostMutation,
  useGetSinglePostQuery,
  useToggleLikeMutation,
} from "@/redux/api/community-api"
import { Comment, Post } from "@/types/community"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, MessageSquare, Send, Share2, Trash2 } from "lucide-react"
import Image from "next/image"
import * as React from "react"
import { toast } from "sonner"

interface PostCardProps {
  post: Post
  currentUser: {
    id?: string
    name?: string
    email?: string
    profilePicture?: string
    image?: string
    role?: string
  } | null
  index: number
  openCommentsPostId: string | null
  setOpenCommentsPostId: (id: string | null) => void
}

// Clean buggy mock image attachments
const getCleanPostImage = (imgUrl?: string | null) => {
  if (!imgUrl) return null
  if (
    imgUrl.includes("screenshot") ||
    imgUrl.includes("create-post") ||
    imgUrl.includes("post-create") ||
    imgUrl.includes("form") ||
    imgUrl.includes("blob:")
  ) {
    if (imgUrl.startsWith("blob:")) return imgUrl
    // Replace mockup screenshots with clean collaborative study image
    return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60"
  }
  return imgUrl
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
  const [deletePost] = useDeletePostMutation()
  const [newCommentText, setNewCommentText] = React.useState("")
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)

  // Local optimistic state for micro-interaction speed
  const likesCount = post._count?.likes ?? 0
  const isLiked = post.isLiked ?? false
  const [localLiked, setLocalLiked] = React.useState(isLiked)
  const [localLikesCount, setLocalLikesCount] = React.useState(likesCount)

  React.useEffect(() => {
    setLocalLiked(isLiked)
    setLocalLikesCount(likesCount)
  }, [isLiked, likesCount])

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like posts!")
      setTimeout(() => {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      }, 800)
      return
    }
    try {
      const nextLiked = !localLiked
      setLocalLiked(nextLiked)
      setLocalLikesCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1))
      await toggleLike(post.id).unwrap()
    } catch {
      // rollback
      setLocalLiked(isLiked)
      setLocalLikesCount(likesCount)
      toast.error("Failed to update like status.")
    }
  }

  const handleShare = () => {
    const fakeLink = `${window.location.origin}/community/posts/${post.id}`
    navigator.clipboard.writeText(fakeLink)
    toast.success("Share link copied! 🔗")
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      toast.error("Please login to comment!")
      setTimeout(() => {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      }, 800)
      return
    }
    if (!newCommentText.trim()) return

    try {
      await addComment({ postId: post.id, content: newCommentText }).unwrap()
      setNewCommentText("")
      toast.success("Comment added! 💬")
    } catch {
      toast.error("Failed to add comment.")
    }
  }

  const handleDelete = async () => {
    try {
      setDeleteConfirmOpen(false)
      await deletePost(post.id).unwrap()
      toast.success("Post deleted! 🗑️")
    } catch {
      toast.error("Failed to delete post.")
    }
  }

  // Format list formatting dynamically for tips & instructions in community
  const renderPostBody = (text: string) => {
    if (!text) return null
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []

    lines.forEach((line, idx) => {
      // Matches pattern like "1. Accept Mistakes" or "2. "
      const listMatch = line.match(/^(\d+)\.\s*(.*)/)
      if (listMatch) {
        let content = listMatch[2]
        // Strip out the template "List item" string if they forgot to delete it
        if (content.startsWith("List item")) {
          content = content.substring(9).trim()
        }
        elements.push(
          <div key={`li-${idx}`} className="flex gap-2.5 items-start my-1.5 pl-1">
            <span className="font-black text-primary text-[11px] shrink-0 min-w-[16px] text-right mt-0.5">
              {listMatch[1]}.
            </span>
            <span className="text-zinc-650 dark:text-zinc-350 font-semibold text-xs leading-relaxed">
              {content}
            </span>
          </div>
        )
      } else {
        if (line.trim() !== "") {
          elements.push(
            <p key={`p-${idx}`} className="my-1.5 leading-relaxed text-zinc-650 dark:text-zinc-350 font-semibold text-xs">
              {line}
            </p>
          )
        }
      }
    })

    return elements
  }

  const singlePost = singlePostData?.data || singlePostData?.result || singlePostData
  const commentsList = singlePost?.comments || []
  const commentsCount = post._count?.comments ?? 0

  const shouldTruncate = post.body && post.body.length > 240
  const bodyText = shouldTruncate && !isExpanded
    ? post.body.substring(0, 240) + "..."
    : post.body

  // Sanitize testing names
  const authorName = post.author?.name === "Nayeem Portfolio Assistant"
    ? "Nayeem Miah"
    : post.author?.name || "Anonymous"

  // Check if this post is mine or if I am an admin
  const isMyPost = !!(
    currentUser &&
    (currentUser.role?.toUpperCase() === "ADMIN" ||
      (post.author &&
        (post.author.id === currentUser.id ||
          post.author.email === currentUser.email ||
          post.author.name === currentUser.name)))
  )

  // Role custom styling
  const roleColors: Record<string, string> = {
    ADMIN: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    INSTRUCTOR: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    USER: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  }
  const roleColor = roleColors[post.author?.role?.toUpperCase()] || "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20"

  const postImage = getCleanPostImage(post.image)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      layout
      className="bg-card border border-border/80 hover:border-primary/20 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 space-y-4"
    >
      <div className="space-y-3">
        {/* Author Header */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-7 w-7 border-none shadow-none">
              <AvatarImage src={post.author?.profilePicture || post.author?.avatar} />
              <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{authorName}</span>
              <Badge variant="outline" className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider border", roleColor)}>
                {post.author?.role || "USER"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}
            </span>
            {isMyPost && (
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="text-zinc-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                title="Delete Post"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Post body */}
        <div className="space-y-2.5 pl-0 sm:pl-9">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug tracking-tight">
              {post.title}
            </h2>
            <Badge variant="outline" className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-md tracking-wide uppercase bg-muted/50">
              {post.category}
            </Badge>
          </div>

          <div className="text-zinc-600 dark:text-zinc-350 text-xs leading-relaxed whitespace-pre-wrap font-medium">
            {renderPostBody(bodyText)}
          </div>

          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[10px] font-black text-primary hover:underline cursor-pointer pt-0.5 transition-all"
            >
              {isExpanded ? "Show Less" : "Read More"}
            </button>
          )}

          {postImage && (
            <div className="mt-3 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-900/60 max-h-[300px] flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/10 animate-in fade-in duration-300">
              <Image
                width={500}
                height={500}
                src={postImage}
                alt="Post media"
                className="w-full h-auto max-h-[300px] object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Micro actions panel */}
        <div className="flex items-center gap-5 pl-0 sm:pl-9 text-xs text-zinc-400 dark:text-zinc-500 pt-1.5 shrink-0 border-t border-border/20">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 hover:text-red-500 transition-all cursor-pointer group",
              localLiked ? "text-red-500 font-semibold" : ""
            )}
          >
            <Heart className={cn("h-4.5 w-4.5 transition-transform duration-200 active:scale-150 group-hover:scale-110", localLiked ? "fill-red-500 text-red-500" : "")} />
            <span className="text-[11px]">{localLikesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
            className={cn(
              "flex items-center gap-1.5 hover:text-primary transition-all cursor-pointer group",
              isCommentsOpen ? "text-primary font-semibold" : ""
            )}
          >
            <MessageSquare className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
            <span className="text-[11px]">{commentsCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-foreground transition-all cursor-pointer ml-auto text-[10px] font-bold uppercase tracking-wider hover:scale-[1.02]"
          >
            <Share2 className="h-3.5 w-3.5" />
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
              className="overflow-hidden pl-0 sm:pl-9 pt-3 space-y-3"
            >
              {isCommentsLoading ? (
                <div className="flex items-center gap-2 py-1.5 text-[11px] text-zinc-450 dark:text-zinc-500">
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  <span>Loading comments...</span>
                </div>
              ) : commentsList.length > 0 ? (
                <div className="space-y-3 border-l-2 border-border pl-3 mt-1">
                  {commentsList.map((comment: Comment) => (
                    <div key={comment.id} className="space-y-1 text-xs">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {comment.author?.name === "Nayeem Portfolio Assistant" ? "Nayeem Miah" : comment.author?.name || "Anonymous"}
                        </span>
                        <Badge variant="outline" className={cn("text-[8px] font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider border", roleColors[comment.author?.role?.toUpperCase()] || "bg-zinc-500/10 text-zinc-650 border-zinc-500/20")}>
                          {comment.author?.role || "USER"}
                        </Badge>
                        <span className="text-[9px] text-zinc-450 dark:text-zinc-500 ml-auto">
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
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 italic py-1.5 pl-3 border-l-2 border-border">No comments yet. Be the first to reply!</div>
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
                  placeholder={currentUser ? "Write a comment..." : "Login to comment..."}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onFocus={() => {
                    if (!currentUser) {
                      toast.error("Please login to comment!")
                      setTimeout(() => {
                        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
                      }, 800)
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs border border-transparent hover:border-zinc-100 focus:border-zinc-150 dark:hover:border-zinc-900 dark:focus:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-lg outline-none transition-all font-semibold"
                  disabled={!currentUser}
                  required
                />
                <Button type="submit" size="icon" className="h-7 w-7 bg-primary hover:bg-primary/95 text-white rounded-lg cursor-pointer border-none shadow-none" disabled={!currentUser}>
                  <Send className="h-3 w-3" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[380px] p-6 rounded-2xl border border-zinc-150 dark:border-zinc-850 shadow-xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              <Trash2 className="w-4.5 h-4.5 text-red-500" /> Delete Post?
            </DialogTitle>
            <DialogDescription className="text-zinc-450 dark:text-zinc-500 text-xs mt-1.5 font-semibold leading-relaxed">
              Are you sure you want to delete this discussion? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-900/80 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteConfirmOpen(false)}
              className="rounded-xl px-4 h-9 font-bold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className=" bg-red-500 hover:bg-red-700 rounded-xl px-5 h-9 font-bold text-xs cursor-pointer border-none shadow-md shadow-red-600/10 transition-all"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
