/* eslint-disable react/no-unescaped-entities */
"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseTitle?: string
  onConfirm: () => void
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  courseTitle,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold">Delete Course Confirmation</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Are you sure you want to delete <span className="font-semibold text-foreground">"{courseTitle}"</span>? This action is permanent and will delete all associated lessons and enrollments.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-2 sm:justify-center w-full">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl flex-1 h-11 font-semibold">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="rounded-xl flex-1 h-11 font-semibold">
            Delete Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
