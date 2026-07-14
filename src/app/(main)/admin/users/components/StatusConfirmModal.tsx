/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface StatusConfirmModalProps {
  data: { userId: string; name: string; currentStatus: string; newStatus: "ACTIVE" | "SUSPENDED" } | null
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export function StatusConfirmModal({ data, onClose, onConfirm, isLoading }: StatusConfirmModalProps) {
  return (
    <Dialog open={!!data} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md bg-card border border-border p-6 rounded-2xl animate-in fade-in-0 duration-200">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg font-bold text-foreground tracking-tight">
            {data?.newStatus === "SUSPENDED" ? "Suspend User" : "Activate User"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-semibold leading-relaxed">
            Are you sure you want to change <span className="text-foreground font-bold">{data?.name}</span>'s status to <span className={cn("font-bold", data?.newStatus === "SUSPENDED" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400")}>{data?.newStatus}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-end gap-2 mt-4">
          <Button
            variant="outline"
            className="rounded-xl text-xs font-semibold h-10 px-4"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            disabled={isLoading}
            className={cn(
              "rounded-xl text-xs font-bold h-10 px-6 text-white hover:opacity-90 transition-all active:scale-95 shadow-md",
              data?.newStatus === "SUSPENDED"
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10"
            )}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
