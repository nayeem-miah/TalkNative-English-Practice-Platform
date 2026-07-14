/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CallReport } from "@/types/moderation"
import { MailWarning } from "lucide-react"

interface WarnUserModalProps {
  report: CallReport | null
  onClose: () => void
  onConfirm: (message: string) => void
  warnMessage: string
  setWarnMessage: (msg: string) => void
}

export function WarnUserModal({
  report,
  onClose,
  onConfirm,
  warnMessage,
  setWarnMessage,
}: WarnUserModalProps) {
  return (
    <Dialog
      open={!!report}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-md bg-card border border-border p-6 rounded-2xl animate-in fade-in-0 duration-200">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <MailWarning className="w-5 h-5 text-amber-500" /> Send Official Warning
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-semibold leading-relaxed">
            Send a warning notice to <span className="font-bold text-foreground">{report?.reported?.name || "this user"}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="space-y-1.5">
            <Label htmlFor="warning-text" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Warning Message <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="warning-text"
              placeholder="Describe why this user is being warned and what terms of service were violated (minimum 10 characters)..."
              rows={4}
              value={warnMessage}
              onChange={(e) => setWarnMessage(e.target.value)}
              className="rounded-xl border-border bg-muted/10 font-semibold focus-visible:ring-primary/20 text-xs leading-relaxed"
            />
            <p className="text-[10px] text-muted-foreground">
              This warning will be logged against their account and notified directly to their register email inbox.
            </p>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-end gap-2 mt-2">
          <Button
            variant="outline"
            className="rounded-xl text-xs font-semibold h-10 px-4"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(warnMessage)}
            disabled={warnMessage.trim().length < 10}
            className="rounded-xl text-xs font-bold h-10 px-6 bg-amber-500 hover:bg-amber-600 shadow-md text-white transition-all hover:shadow-amber-500/10 active:scale-95"
          >
            Send Warning
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
