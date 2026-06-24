/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Star, MessageSquare, AlertCircle } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCreateReviewMutation } from "@/redux/api/course-api"
import { cn } from "@/lib/utils"

interface ReviewsTabProps {
  courseId: string
  reviews: any[]
  averageRating: number
  totalReviews: number
  isEnrolled: boolean
  currentUserId?: string
}

export function ReviewsTab({
  courseId,
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  isEnrolled,
  currentUserId
}: ReviewsTabProps) {
  const [rating, setRating] = React.useState<number>(0)
  const [hoverRating, setHoverRating] = React.useState<number>(0)
  const [comment, setComment] = React.useState<string>("")

  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation()

  // Check if current user has already submitted a review
  const hasReviewed = React.useMemo(() => {
    if (!currentUserId || !reviews.length) return false
    return reviews.some((r: any) => (r.userId || r.user?.id) === currentUserId)
  }, [reviews, currentUserId])

  // Calculate review breakdown percentages dynamically
  const breakdown = React.useMemo(() => {
    const counts = [0, 0, 0, 0, 0] // 1 to 5 stars
    reviews.forEach((r: any) => {
      const rounded = Math.round(r.rating)
      if (rounded >= 1 && rounded <= 5) {
        counts[rounded - 1]++
      }
    })
    return counts.map((count) => {
      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
      return { count, percentage }
    }).reverse() // 5 down to 1
  }, [reviews])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error("Please select a rating (1 to 5 stars) before submitting.")
      return
    }

    if (!comment.trim()) {
      toast.error("Please write a comment describing your experience.")
      return
    }

    try {
      await createReview({
        courseId,
        rating,
        comment: comment.trim()
      }).unwrap()

      toast.success("Thank you for your feedback! Review submitted successfully. 🎉")
      setRating(0)
      setComment("")
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review. Please try again.")
    }
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Rating Summary Stats Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-card/40 dark:bg-zinc-900/20 backdrop-blur-md border border-border/60 p-6 rounded-2xl shadow-sm">
        
        {/* Left Stats Circle */}
        <div className="flex flex-col items-center justify-center text-center space-y-2 border-b md:border-b-0 md:border-r border-border/60 pb-6 md:pb-0">
          <span className="text-5xl font-black text-foreground tracking-tight">
            {averageRating ? averageRating.toFixed(1) : "0.0"}
          </span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((starValue) => {
              const fillType = averageRating >= starValue 
                ? "fill-amber-400 text-amber-400" 
                : averageRating >= starValue - 0.5 
                ? "fill-amber-400/50 text-amber-400" 
                : "text-muted-foreground/30"
              return (
                <Star key={starValue} className={cn("w-5 h-5 transition-transform duration-200", fillType)} />
              )
            })}
          </div>
          <span className="text-xs font-bold text-muted-foreground tracking-wide uppercase">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Right Distribution Bars */}
        <div className="col-span-2 space-y-2.5">
          {breakdown.map((item, index) => {
            const starNum = 5 - index
            return (
              <div key={starNum} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground/80 w-3 text-right">
                  {starNum}
                </span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2.5 bg-muted/60 dark:bg-zinc-800/60 rounded-full overflow-hidden border border-border/20">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-xs font-extrabold text-muted-foreground/60 w-10 text-right">
                  {Math.round(item.percentage)}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Review Interactive Submission Form */}
      {isEnrolled && (
        <div className="bg-card/80 border border-border/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-border/40 pb-3">
            <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Share Your Learning Experience
            </h3>
            <p className="text-xs text-muted-foreground/80 font-medium">
              Your honest feedback helps both the instructors improve and fellow students make informed choices.
            </p>
          </div>

          {hasReviewed ? (
            <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-xs font-bold leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                You have already submitted a review for this course. Thank you for sharing your learning journey!
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              
              {/* Stars Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                  Select Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isLit = (hoverRating || rating) >= starValue
                    return (
                      <button
                        key={starValue}
                        type="button"
                        className="cursor-pointer focus:outline-none transition-transform hover:scale-125 duration-100 ease-in-out"
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starValue)}
                      >
                        <Star 
                          className={cn(
                            "w-8 h-8",
                            isLit 
                              ? "fill-amber-400 text-amber-400 drop-shadow-sm" 
                              : "text-muted-foreground/30 hover:text-amber-300"
                          )}
                        />
                      </button>
                    )
                  })}
                  {rating > 0 && (
                    <span className="text-xs font-extrabold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 ml-2">
                      {rating} Star{rating > 1 ? "s" : ""} Selected
                    </span>
                  )}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1.5">
                <label htmlFor="review-comment" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                  Write Your Comment
                </label>
                <Textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What was helpful about the course? How were the explanations, materials, and lessons? Did it meet your learning targets?"
                  className="rounded-xl min-h-[100px] resize-none bg-muted/30 border-border/80 focus:border-primary focus:ring-primary/20 text-sm font-medium"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl h-10 px-6 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 3. List of Reviews */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/90 border-b border-border/40 pb-2">
          Student Feedback ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-muted/10 border border-dashed border-border/60 rounded-2xl">
            <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">No Reviews Yet</h4>
              <p className="text-xs text-muted-foreground font-medium max-w-[280px]">
                {isEnrolled 
                  ? "Be the first to share your learning experience of this course!"
                  : "No students have reviewed this course yet. Enroll to start learning and leave your feedback!"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reviews.map((review: any) => {
              const reviewUser = review.user || {}
              const authorName = reviewUser.name || "Anonymous Learner"
              const avatarSrc = reviewUser.profilePicture
              const avatarInitials = authorName.charAt(0).toUpperCase()

              return (
                <div 
                  key={review.id} 
                  className="flex flex-col sm:flex-row gap-4 p-5 bg-card/60 border border-border/80 rounded-2xl shadow-xs transition-all hover:bg-card/90"
                >
                  {/* User Profile Info Left Side */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-3 shrink-0 sm:w-36">
                    <Avatar className="w-10 h-10 border border-border/50 shadow-xs">
                      <AvatarImage src={avatarSrc} alt={authorName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left space-y-0.5">
                      <h4 className="text-xs font-bold text-foreground line-clamp-1">
                        {authorName}
                      </h4>
                      <span className="block text-[10px] font-bold text-muted-foreground/60">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Review Content Right Side */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((starValue) => {
                        const isLit = review.rating >= starValue
                        return (
                          <Star 
                            key={starValue} 
                            className={cn(
                              "w-3.5 h-3.5",
                              isLit ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"
                            )} 
                          />
                        )
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground/90 font-medium leading-relaxed whitespace-pre-line">
                      {review.comment}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
