import * as React from "react"
import Image from "next/image"
import { Play, Lock } from "lucide-react"

interface VideoPlayerProps {
  isEnrolled: boolean
  thumbnail?: string | null
  courseTitle: string
  activeVideoUrl?: string
  activeVideoTitle?: string
  onEnrollClick: () => void
}

export function VideoPlayer({
  isEnrolled,
  thumbnail,
  courseTitle,
  activeVideoUrl,
  activeVideoTitle,
  onEnrollClick,
}: VideoPlayerProps) {
  
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return ""
    let videoId = ""
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || ""
    } else if (url.includes("youtube.com/watch")) {
      const params = new URLSearchParams(url.split("?")[1])
      videoId = params.get("v") || ""
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1]?.split("?")[0] || ""
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : ""
  }

  const embedUrl = getYouTubeEmbedUrl(activeVideoUrl)

  if (isEnrolled && activeVideoUrl) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-black aspect-video relative shadow-sm">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={activeVideoTitle || "Lesson Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-none"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-2">
            <Play className="w-10 h-10 text-primary animate-pulse" />
            <p className="text-white font-bold text-sm">No video preview available</p>
            <p className="text-zinc-400 text-xs max-w-xs">This lesson does not contain a valid YouTube embed video.</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted aspect-video relative group shadow-sm">
      <Image
        fill
        src={thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"}
        alt={courseTitle}
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        unoptimized
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div 
          onClick={onEnrollClick}
          className="h-14 w-14 rounded-full bg-white/95 text-black flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer"
        >
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-white font-black text-sm uppercase tracking-widest">Syllabus Locked</p>
          <p className="text-white/80 text-xs font-semibold">Please enroll in this course to access lessons and learning content.</p>
        </div>
      </div>
    </div>
  )
}
