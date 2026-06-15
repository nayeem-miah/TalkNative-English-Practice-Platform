"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface CropImageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  previewUrl: string | null
  zoomLevel: number
  setZoomLevel: (zoom: number) => void
  onSave: () => void
}

export function CropImageModal({
  open,
  onOpenChange,
  previewUrl,
  zoomLevel,
  setZoomLevel,
  onSave,
}: CropImageModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Crop Course Thumbnail</DialogTitle>
          <DialogDescription className="text-xs">
            Scale and position the focal center to fit clean grid standards.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="relative aspect-video rounded-xl overflow-hidden border bg-zinc-950 flex items-center justify-center">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Crop Zoom Preview"
                style={{ transform: `scale(${zoomLevel})` }}
                className="w-full h-full object-cover transition-transform"
              />
            )}
            {/* Overlay guides */}
            <div className="absolute inset-4 border-2 border-dashed border-white/60 pointer-events-none rounded-lg" />
          </div>
          
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <Label htmlFor="zoom">Crop Focus Scale</Label>
              <span className="text-zinc-500">{zoomLevel.toFixed(1)}x</span>
            </div>
            <input
              id="zoom"
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-primary cursor-pointer"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={onSave} className="rounded-xl font-bold bg-primary text-primary-foreground">
            Save Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
