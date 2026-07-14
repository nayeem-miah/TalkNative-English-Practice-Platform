import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShieldAlert } from "lucide-react"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-sm border border-border shadow-2xl rounded-2xl bg-card animate-in zoom-in-95 duration-200">
        <CardHeader className="p-5 pb-0">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
            <ShieldAlert className="h-5 w-5" /> Delete Announcement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground mb-6">
            Are you sure you want to delete this announcement? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
