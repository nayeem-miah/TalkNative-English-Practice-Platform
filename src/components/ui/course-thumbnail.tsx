import { cleanTitle, getCleanThumbnail } from "@/lib/text"
import { GraduationCap } from "lucide-react"
import Image from "next/image"

export interface CourseThumbnailProps {
  title: string
  level: string
  thumbnail?: string
}

export function CourseThumbnail({ title, level, thumbnail }: CourseThumbnailProps) {
  const thumbnailSrc = getCleanThumbnail(thumbnail)

  const gradientClass =
    level?.toUpperCase() === "BEGINNER"
      ? "from-emerald-500/40 via-teal-600/30 to-black/70"
      : level?.toUpperCase() === "INTERMEDIATE"
      ? "from-blue-500/40 via-indigo-600/30 to-black/70"
      : "from-purple-500/40 via-pink-600/30 to-black/70"

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-muted group select-none">
      {/* Background Image */}
      <Image
        width={400}
        height={250}
        src={thumbnailSrc}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        unoptimized
      />

      {/* Brand Color Gradient Overlay to unify color scheme */}
      <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} transition-opacity duration-300`} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:10px_10px]" />

      <span className="absolute bottom-3 left-4 text-[9px] font-black uppercase tracking-widest text-white/60 z-10">
        TalkNative Academy
      </span>

      {/* Floating Center Icon and Title */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 text-white">
        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md group-hover:scale-110 transition-transform duration-500">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-xs font-black tracking-tight leading-tight max-w-[220px] line-clamp-2 mt-2.5 drop-shadow-sm">
          {cleanTitle(title)}
        </span>
      </div>
    </div>
  )
}
