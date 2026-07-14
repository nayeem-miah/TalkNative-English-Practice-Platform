import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { CallReport } from "@/types/moderation"

interface StatusActionModalProps {
  report: CallReport | null
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export function StatusActionModal({
  report,
  onClose,
  onConfirm,
  isLoading,
}: StatusActionModalProps) {
  const selectedStatusAction =
    report?.reported?.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
  const isActivatingUser = selectedStatusAction === "ACTIVE"

  return (
    <Dialog
      open={!!report}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-md bg-card border border-border p-6 rounded-2xl animate-in fade-in-0 duration-200">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg font-bold text-foreground tracking-tight">
            {isActivatingUser ? "Activate Reported User" : "Suspend Reported User"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-semibold leading-relaxed">
            Are you sure you want to {isActivatingUser ? "activate" : "suspend"}{" "}
            <span className="text-foreground font-bold">
              {report?.reported?.name || report?.reported?.email || "this user"}
            </span>
            ? This will change the reported account status to{" "}
            <span
              className={cn(
                "font-bold",
                isActivatingUser
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              )}
            >
              {selectedStatusAction}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-end gap-2 mt-4">
          <Button
            variant="outline"
            className="rounded-xl text-xs font-semibold h-10 px-4"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className={cn(
              "rounded-xl text-xs font-bold h-10 px-6 text-white transition-all active:scale-95 shadow-md",
              isActivatingUser
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10"
                : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10"
            )}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading
              ? isActivatingUser
                ? "Activating..."
                : "Suspending..."
              : isActivatingUser
              ? "Confirm Activate"
              : "Confirm Suspend"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
