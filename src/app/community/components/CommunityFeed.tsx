/* eslint-disable react-hooks/set-state-in-effect */
"use client"


import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetMeQuery } from "@/redux/api/auth-api"
import { AnimatePresence } from "framer-motion"
import { ImageIcon, Plus, Search, Users, X } from "lucide-react"
import { toast } from "sonner"
import { Post } from "@/types/community"
import { useGetPostsQuery, useCreatePostMutation } from "@/redux/api/community-api"
import { PostCard } from "./PostCard"

export default function CommunityFeed() {
  const [mounted, setMounted] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState("latest")
  const [openCommentsPostId, setOpenCommentsPostId] = React.useState<string | null>(null)

  // Create Post Modal State
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [newPostTitle, setNewPostTitle] = React.useState("")
  const [newPostContent, setNewPostContent] = React.useState("")
  const [newPostCategory, setNewPostCategory] = React.useState("Speaking")
  const [newPostImage, setNewPostImage] = React.useState<string | null>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image file is too large (max 10MB).")
        return
      }
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setNewPostImage(previewUrl)
    }
  }

  // Handle Post Creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      return
    }

    setIsPublishing(true)
    const formData = new FormData()
    formData.append("data", JSON.stringify({
      title: newPostTitle,
      category: newPostCategory.toUpperCase(),
      body: newPostContent
    }))

    if (selectedFile) {
      formData.append("file", selectedFile)
    }

    try {
      await createPost(formData).unwrap()
      
      // Clean up local preview URL
      if (newPostImage) {
        URL.revokeObjectURL(newPostImage)
      }

      // Reset Form
      setNewPostTitle("")
      setNewPostContent("")
      setNewPostCategory("Speaking")
      setNewPostImage(null)
      setSelectedFile(null)
      setCreateDialogOpen(false)
      toast.success("Published! 🎉")
    } catch {
      toast.error("Failed to publish post.")
    } finally {
      setIsPublishing(false)
    }
  }

  const rawPosts = postsResponse?.data || postsResponse?.result || postsResponse || []
  
  // Sort posts
  const posts = [...rawPosts].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      const scoreA = (a._count?.likes ?? 0) + (a._count?.comments ?? 0)
      const scoreB = (b._count?.likes ?? 0) + (b._count?.comments ?? 0)
      return scoreB - scoreA
    }
  })

  const categories = ["All", "Speaking", "Vocabulary", "Grammar", "Exams"]

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto px-6 space-y-10">

        {/* Sleek Minimal Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-6">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Community</h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Discuss learning, share insights, ask grammar notes.</p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger
              render={
                <Button className="h-8 px-4 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/95 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-none border-none">
                  <Plus className="h-3.5 w-3.5" /> New Post
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 shadow-xl bg-card">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">Create Post</DialogTitle>
                <DialogDescription className="text-zinc-400 dark:text-zinc-500 text-xs mt-0.5">
                  Publish reference lists, questions, or vocabulary notes for the community.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePost} className="space-y-4 pt-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Title</span>
                  <input
                    placeholder="e.g. 5 idioms for work conversations"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 focus:border-zinc-300 dark:border-zinc-800 dark:focus:border-zinc-700 bg-background text-xs font-semibold outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Category</span>
                  <Select value={newPostCategory} onValueChange={(val) => setNewPostCategory(val || "Speaking")}>
                    <SelectTrigger className="w-full h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-xs font-semibold outline-none focus:ring-0">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-zinc-150 dark:border-zinc-850 bg-card">
                      <SelectItem value="Speaking">Speaking</SelectItem>
                      <SelectItem value="Vocabulary">Vocabulary</SelectItem>
                      <SelectItem value="Grammar">Grammar</SelectItem>
                      <SelectItem value="Exams">Exams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Body</span>
                  <textarea
                    placeholder="Share resources, tips, or ask questions..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-zinc-300 dark:border-zinc-800 dark:focus:border-zinc-700 bg-background text-xs leading-relaxed outline-none transition-all resize-none min-h-[140px]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Image Attachment (Optional)</span>
                  
                  {isPublishing ? (
                    <div className="flex flex-col items-center justify-center h-28 w-full border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/5 dark:bg-zinc-900/10 gap-2">
                      <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                      <span className="text-[10px] font-semibold text-zinc-450 uppercase tracking-widest animate-pulse">Uploading Image...</span>
                    </div>
                  ) : newPostImage ? (
                    <div className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-background max-h-[160px] flex items-center justify-center">
                      <img src={newPostImage} alt="Uploaded preview" className="w-full h-auto max-h-[160px] object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewPostImage(null)
                            setSelectedFile(null)
                          }}
                          className="h-8 w-8 rounded-lg bg-red-650 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer transition-colors shadow border-none"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-28 w-full border-2 border-dashed border-zinc-150 hover:border-zinc-250 dark:border-zinc-850 dark:hover:border-zinc-750 rounded-xl bg-zinc-50/20 hover:bg-zinc-50/50 dark:bg-zinc-900/5 dark:hover:bg-zinc-900/20 cursor-pointer transition-all gap-1.5 p-4 group">
                      <div className="h-8 w-8 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 text-zinc-450 group-hover:text-primary transition-colors">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Click to upload photo</p>
                        <p className="text-[10px] font-semibold text-zinc-455 mt-0.5">PNG, JPG or WEBP up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-900/80 mt-6">
                  <Button type="button" variant="ghost" onClick={() => setCreateDialogOpen(false)} className="rounded-xl px-4 h-9 font-bold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPublishing} className="bg-primary hover:bg-primary/95 text-white rounded-xl px-5 h-9 font-bold text-xs cursor-pointer border-none shadow-md shadow-primary/10 transition-all disabled:opacity-50">
                    {isPublishing ? "Publishing..." : "Publish"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Clean minimal categories & search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`pb-2 text-xs font-semibold relative transition-colors cursor-pointer ${
                    isSelected
                      ? "text-primary border-b-2 border-primary -mb-[11px]"
                      : "text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs border border-transparent hover:border-zinc-100 focus:border-zinc-200 dark:hover:border-zinc-900 dark:focus:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-lg w-full outline-none transition-all font-semibold"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-zinc-400 dark:text-zinc-500 border-none outline-none focus:ring-0 cursor-pointer"
            >
              <option value="latest">Latest</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        {/* Post feed list - borderless minimal design */}
        <div className="space-y-8">
          {isPostsLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <span className="text-[11px] font-semibold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">Loading Feed...</span>
            </div>
          ) : posts.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {posts.map((post: Post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  index={index}
                  openCommentsPostId={openCommentsPostId}
                  setOpenCommentsPostId={setOpenCommentsPostId}
                />
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-12">
              <Users className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">No posts found</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Try another filter or search term.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
