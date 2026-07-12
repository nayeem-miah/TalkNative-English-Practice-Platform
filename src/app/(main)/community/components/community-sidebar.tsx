import { Info, Hash, Award } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Contributor {
  name: string
  profilePicture?: string
  role?: string
  postCount: number
  likesCount: number
}

interface CommunitySidebarProps {
  trendingTags: string[]
  contributors: Contributor[]
  onTagClick: (tag: string) => void
}

export function CommunitySidebar({ trendingTags, contributors, onTagClick }: CommunitySidebarProps) {
  return (
    <div className="space-y-6 lg:sticky lg:top-24 mt-0.5 animate-in fade-in duration-500">
      {/* Community Guidelines Card */}
      <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <Info className="h-4 w-4 text-primary" /> Rules & Guidelines
        </h3>
        <ul className="space-y-2.5 text-xs text-muted-foreground font-semibold leading-relaxed">
          <li className="flex gap-2">
            <span>1.</span>
            <span>Respect all users. Discrimination or cyber-bullying is strictly prohibited.</span>
          </li>
          <li className="flex gap-2">
            <span>2.</span>
            <span>Keep posts related to language learning, IELTS, grammar, or vocabulary.</span>
          </li>
          <li className="flex gap-2">
            <span>3.</span>
            <span>Practice writing in English as much as possible to boost active production.</span>
          </li>
        </ul>
      </div>

      {/* Trending Tags Card (only render if there are tags) */}
      {trendingTags.length > 0 && (
        <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Hash className="h-4 w-4 text-primary" /> Trending Topics
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="text-[10px] font-extrabold bg-muted hover:bg-primary/5 hover:text-primary hover:border-primary/20 text-muted-foreground px-2.5 py-1 rounded-lg border border-border/60 transition-all cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Top Contributors Card */}
      {contributors.length > 0 && (
        <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Award className="h-4 w-4 text-primary" /> Top Contributors
          </h3>
          <div className="space-y-3.5 pt-1">
            {contributors.map((c) => {
              const initials = c.name
                .split(" ")
                .map((n) => n.charAt(0))
                .join("")
                .toUpperCase()
                .substring(0, 2)

              return (
                <div key={c.name} className="flex items-center gap-2.5">
                  <Avatar className="h-7 w-7 border-none shadow-none">
                    <AvatarImage src={c.profilePicture} />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-xs">
                    <p className="font-extrabold text-foreground">{c.name}</p>
                    <p className="text-[10px] font-semibold text-muted-foreground">
                      {c.postCount} {c.postCount === 1 ? "post" : "posts"} • {c.likesCount} {c.likesCount === 1 ? "like" : "likes"}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
