/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { useCreatePostMutation, useGetPostsQuery } from "@/redux/api/community-api"
import { Post } from "@/types/community"
import { AnimatePresence } from "framer-motion"
import { Plus, Search, Users } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { CommunitySidebar } from "./community-sidebar"
import { CreatePostModal } from "./create-post-modal"
import { PostCard } from "./post-card"

export default function CommunityFeed() {
  const [mounted, setMounted] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [sortBy, setSortBy] = React.useState("latest")
  const [openCommentsPostId, setOpenCommentsPostId] = React.useState<string | null>(null)

  // Create Post Modal State
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [isPublishing, setIsPublishing] = React.useState(false)

  // Fetch logged in user info
  const { data: userData } = useGetMeQuery()
  const currentUser = userData?.data?.result?.user || userData?.data?.result || userData?.data

  // Fetch all posts from backend
  const { data: postsResponse, isLoading: isPostsLoading } = useGetPostsQuery({
    searchTerm: searchQuery || undefined,
    category: selectedCategory === "All" ? undefined : selectedCategory.toUpperCase(),
  })

  const [createPost] = useCreatePostMutation()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Handle Post Creation Action
  const handlePublishPost = async (postData: { title: string; category: string; body: string; file: File | null }) => {
    setIsPublishing(true)
    const formData = new FormData()
    formData.append("data", JSON.stringify({
      title: postData.title,
      category: postData.category.toUpperCase(),
      body: postData.body
    }))

    if (postData.file) {
      formData.append("file", postData.file)
    }

    try {
      await createPost(formData).unwrap()
      setCreateDialogOpen(false)
      toast.success("Published! 🎉")
    } catch {
      toast.error("Failed to publish post.")
    } finally {
      setIsPublishing(false)
    }
  }

  const rawPosts = postsResponse?.data || postsResponse?.result || postsResponse || []

  // Dynamic top contributors calculations from fetched stream
  const contributors = React.useMemo(() => {
    const map: Record<string, { name: string; profilePicture?: string; role?: string; postCount: number; likesCount: number }> = {}

    rawPosts.forEach((post: any) => {
      const authorId = post.author?.id || post.author?.email || post.author?.name
      if (!authorId) return

      const likes = post._count?.likes ?? 0

      if (!map[authorId]) {
        map[authorId] = {
          name: post.author.name === "Nayeem Portfolio Assistant" ? "Nayeem Miah" : post.author.name || "Anonymous",
          profilePicture: post.author.profilePicture || post.author.avatar,
          role: post.author.role || "USER",
          postCount: 1,
          likesCount: likes
        }
      } else {
        map[authorId].postCount += 1
        map[authorId].likesCount += likes
      }
    })

    return Object.values(map)
      .sort((a, b) => (b.postCount * 2 + b.likesCount) - (a.postCount * 2 + a.likesCount))
      .slice(0, 5)
  }, [rawPosts])

  // Extract trending tags from actual loaded posts
  const trendingTags = React.useMemo(() => {
    const tagCounts: Record<string, number> = {}
    rawPosts.forEach((post: any) => {
      const text = `${post.title || ""} ${post.body || ""}`
      const matches = text.match(/#\w+/g)
      if (matches) {
        matches.forEach((tag) => {
          const cleanTag = tag.substring(1)
          tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1
        })
      }
    })

    const tags = Object.keys(tagCounts)
      .sort((a, b) => tagCounts[b] - tagCounts[a])
      .slice(0, 6)

    // Fallback: use active categories if no hashtags exist in texts
    if (tags.length === 0) {
      const activeCats = Array.from(new Set(rawPosts.map((p: any) => p.category).filter(Boolean))) as string[]
      return activeCats.map((c) => c.charAt(0) + c.slice(1).toLowerCase())
    }

    return tags
  }, [rawPosts])

  // Dynamic search suggestions
  const suggestions = React.useMemo(() => {
    if (!searchQuery.trim()) return []
    return rawPosts
      .filter((post: any) =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5)
  }, [searchQuery, rawPosts])

  // Get dynamic category counts
  const getCategoryCount = (cat: string) => {
    if (cat === "All") return rawPosts.length
    return rawPosts.filter((p: any) => p.category?.toUpperCase() === cat.toUpperCase()).length
  }

  // Sorting logic
  const posts = [...rawPosts].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === "liked") {
      return (b._count?.likes ?? 0) - (a._count?.likes ?? 0)
    } else if (sortBy === "commented") {
      return (b._count?.comments ?? 0) - (a._count?.comments ?? 0)
    } else if (sortBy === "unanswered") {
      const commA = a._count?.comments ?? 0
      const commB = b._count?.comments ?? 0
      if (commA !== commB) return commA - commB
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      const scoreA = (a._count?.likes ?? 0) + (a._count?.comments ?? 0)
      const scoreB = (b._count?.likes ?? 0) + (b._count?.comments ?? 0)
      return scoreB - scoreA
    }
  })

  const categories = ["All", "Speaking", "Vocabulary", "Grammar", "Exams"]

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto px-6 mt-6">

        {/* Two Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Feed Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-5">
              <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Community Feed</h1>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">Discuss topics, share insights, and learn collaboratively.</p>
              </div>

              {/* Modular Create Post Dialog or Login Guard Button */}
              {currentUser ? (
                <CreatePostModal
                  open={createDialogOpen}
                  onOpenChange={setCreateDialogOpen}
                  onPublish={handlePublishPost}
                  isPublishing={isPublishing}
                />
              ) : (
                <Button
                  onClick={() => {
                    toast.error("Please login to create a post!")
                    setTimeout(() => {
                      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
                    }, 800)
                  }}
                  className="h-8 px-4 rounded-lg text-xs font-bold bg-primary hover:bg-primary/95 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-none border-none"
                >
                  <Plus className="h-3.5 w-3.5" /> New Post
                </Button>
              )}
            </div>

            {/* Filter Pills & Live Search bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-3 z-20">
              <div className="flex flex-wrap gap-4">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat
                  const count = getCategoryCount(cat)
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "pb-2 text-xs font-extrabold relative transition-colors cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1",
                        isSelected
                          ? "text-primary border-b-2 border-primary -mb-[11px]"
                          : "text-zinc-400 dark:text-zinc-500"
                      )}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] font-semibold opacity-75">({count})</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-56 z-30">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-transparent hover:border-zinc-100 focus:border-zinc-200 dark:hover:border-zinc-900 dark:focus:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-lg w-full outline-none transition-all font-semibold"
                  />

                  {/* Live Suggestions Panel */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute right-0 top-full mt-2 w-full sm:w-64 bg-card border border-border/80 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-border/50">
                      {suggestions.map((post: any) => (
                        <button
                          key={`suggest-${post.id}`}
                          onClick={() => {
                            setSearchQuery(post.title)
                            setShowSuggestions(false)
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-muted text-[11px] font-semibold truncate text-foreground block cursor-pointer transition-colors"
                        >
                          {post.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-900 border border-border/50 px-2 py-1.5 rounded-xl text-[11px] font-bold text-zinc-500 dark:text-zinc-400 outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="latest">Latest</option>
                  <option value="liked">Most Liked</option>
                  <option value="commented">Most Commented</option>
                  <option value="unanswered">Unanswered</option>
                </select>
              </div>
            </div>

            {/* Posts Cards Stream */}
            <div className="space-y-6">
              {isPostsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2">
                  <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  <span className="text-[11px] font-semibold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Loading Feed...</span>
                </div>
              ) : posts.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {posts.map((post: Post, idx) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      index={idx}
                      openCommentsPostId={openCommentsPostId}
                      setOpenCommentsPostId={setOpenCommentsPostId}
                    />
                  ))}
                </AnimatePresence>
              ) : (
                /* Dynamic empty state */
                <div className="text-center py-16 bg-muted/10 border border-dashed border-border/80 rounded-3xl space-y-4 max-w-md mx-auto">
                  <div className="p-4 rounded-full bg-muted/20 w-16 h-16 flex items-center justify-center mx-auto border border-border/50">
                    <Users className="h-8 w-8 text-muted-foreground/50 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-foreground">No discussions yet</h3>
                    <p className="text-xs text-muted-foreground max-w-[240px] mx-auto font-medium">
                      Be the first to share resources, ask questions, or start an English discussion!
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      if (!currentUser) {
                        toast.error("Please login to create a post!")
                        setTimeout(() => {
                          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
                        }, 800)
                      } else {
                        setCreateDialogOpen(true)
                      }
                    }}
                    className="h-9 px-4 rounded-xl text-xs font-extrabold bg-primary hover:bg-primary/90 text-white cursor-pointer shadow-sm border-none"
                  >
                    Create Discussion
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Premium Sidebar */}
          <div className="lg:col-span-1">
            <CommunitySidebar
              trendingTags={trendingTags}
              contributors={contributors}
              onTagClick={setSearchQuery}
            />
          </div>

        </div>

      </div>
    </div>
  )
}
