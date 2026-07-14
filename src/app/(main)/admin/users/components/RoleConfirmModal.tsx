/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RoleConfirmModalProps {
  data: { userId: string; name: string; currentRole: string; newRole: "ADMIN" | "USER" } | null
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export function RoleConfirmModal({ data, onClose, onConfirm, isLoading }: RoleConfirmModalProps) {
  return (
    <Dialog open={!!data} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md bg-card border border-border p-6 rounded-2xl animate-in fade-in-0 duration-200">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg font-bold text-foreground tracking-tight">
            Confirm Role Change
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-semibold leading-relaxed">
            Are you sure you want to change <span className="text-foreground font-bold">{data?.name}</span>'s role from <span className="text-foreground font-bold">{data?.currentRole}</span> to <span className="text-primary font-bold">{data?.newRole}</span>?
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
            className="rounded-xl text-xs font-bold h-10 px-6 bg-primary text-primary-foreground hover:opacity-90 transition-all active:scale-95 shadow-md shadow-primary/10"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
