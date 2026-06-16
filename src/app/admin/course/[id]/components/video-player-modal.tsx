import { PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VideoPlayerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  videoUrl: string | null
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}

export function VideoPlayerModal({ open, onOpenChange, videoUrl }: VideoPlayerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] rounded-2xl p-6 bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" /> Lesson Video Preview
          </DialogTitle>
          <DialogDescription className="text-xs">
            Preview the educational video content associated with this lesson.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          {videoUrl && (
            getYouTubeEmbedUrl(videoUrl) ? (
              <iframe
                src={getYouTubeEmbedUrl(videoUrl) || ""}
                className="w-full aspect-video rounded-xl border border-border bg-black"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full aspect-video rounded-xl border border-border bg-black"
              />
            )
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="rounded-xl h-11 px-6 font-semibold">
            Close Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
