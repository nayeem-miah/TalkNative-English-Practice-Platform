/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { BadgeCheck, Clock, Languages, Mail, Phone } from "lucide-react"

interface UserDetailsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isLoading: boolean
  userDetail: any
  onClose: () => void
}

export function UserDetailsModal({ isOpen, onOpenChange, isLoading, userDetail, onClose }: UserDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border border-border p-6 rounded-2xl animate-in fade-in-0 duration-200">
        <DialogHeader className="flex flex-col items-center text-center space-y-4 mb-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <p className="text-muted-foreground font-bold mt-3 text-xs uppercase tracking-wider">Loading details...</p>
            </div>
          ) : userDetail ? (
            <>
              <div className="relative group">
                <Avatar className="h-24 w-24 rounded-2xl border-2 border-border shadow-md transition-all duration-300 group-hover:scale-105">
                  <AvatarImage src={userDetail.profilePicture || ""} className="object-cover" />
                  <AvatarFallback className="text-2xl font-bold bg-muted text-muted-foreground">
                    {userDetail.name ? userDetail.name[0]?.toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold text-foreground tracking-tight flex items-center justify-center gap-1.5">
                  {userDetail.name}
                  {userDetail.isVerified && (
                    <span title="Verified User">
                      <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground font-medium">{userDetail.email}</DialogDescription>
              </div>

              <div className="flex items-center justify-center gap-3 mt-1.5 w-full">
                <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-lg border border-border/60">
                  <span className="text-[9px] uppercase font-black text-muted-foreground/70">Role:</span>
                  <span className="text-[9px] font-black text-primary uppercase tracking-wider">
                    {userDetail.role || "USER"}
                  </span>
                </div>

                <Badge variant="outline" className={cn(
                  "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm border",
                  (userDetail.status || "ACTIVE") === "ACTIVE" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" :
                  (userDetail.status || "ACTIVE") === "INACTIVE" ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20" :
                  "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
                )}>
                  {userDetail.status || "ACTIVE"}
                </Badge>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Failed to load user details.</p>
          )}
        </DialogHeader>

        {!isLoading && userDetail && (
          <div className="space-y-4 py-3 text-xs font-semibold text-muted-foreground border-t border-border mt-2">

            {/* Bio Section */}
            {userDetail.bio ? (
              <div className="bg-muted/20 border border-border/80 p-3 rounded-xl text-center italic text-foreground/85 font-medium">
                "{userDetail.bio}"
              </div>
            ) : (
              <div className="bg-muted/10 border border-border/40 p-2.5 rounded-xl text-center text-[11px] text-muted-foreground/60 font-medium italic">
                No bio provided
              </div>
            )}

            {/* Language and Practice Stats */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-muted/25 border border-border/80 p-3 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground/70">
                  <Languages className="w-3.5 h-3.5" />
                  <span className="text-[9px] uppercase font-extrabold tracking-wider">Languages</span>
                </div>
                <div className="text-[11px] text-foreground font-extrabold leading-tight">
                  {userDetail.nativeLanguage || "N/A"} <span className="text-muted-foreground font-semibold text-[9px]">(Native)</span>
                  <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                    Learning: <span className="text-primary font-extrabold">{userDetail.learningLanguage || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/25 border border-border/80 p-3 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground/70">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[9px] uppercase font-extrabold tracking-wider">Time & Level</span>
                </div>
                <div className="text-[11px] text-foreground font-extrabold leading-tight">
                  {userDetail.totalMinutesSpent !== undefined && userDetail.totalMinutesSpent !== null
                    ? `${Math.floor(userDetail.totalMinutesSpent / 60)}h ${userDetail.totalMinutesSpent % 60}m`
                    : "0m"}
                  <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                    Level: <span className="text-foreground font-extrabold">{userDetail.level || "B2 Upper"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/15 border border-border/60 text-[11px]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground/60" />
                  <span className="font-semibold text-muted-foreground/80">Email</span>
                </div>
                <span className="font-bold text-foreground select-all">{userDetail.email}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/15 border border-border/60 text-[11px]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground/60" />
                  <span className="font-semibold text-muted-foreground/80">Phone</span>
                </div>
                <span className={cn(
                  "font-bold select-all",
                  userDetail.Phone ? "text-foreground" : "text-muted-foreground/50 font-normal italic"
                )}>
                  {userDetail.Phone || "Not Provided"}
                </span>
              </div>
            </div>

            {/* Technical IDs and Dates */}
            <div className="bg-muted/10 border border-border/40 rounded-xl p-3 space-y-2 text-[10px] font-semibold text-muted-foreground/80">
              <div className="flex items-center justify-between">
                <span>User ID</span>
                <span className="font-mono text-foreground select-all text-[9px] truncate max-w-[180px]">{userDetail.id || userDetail._id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Joined Date</span>
                <span className="text-foreground">
                  {userDetail.createdAt
                    ? new Date(userDetail.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Updated</span>
                <span className="text-foreground">
                  {userDetail.updatedAt
                    ? new Date(userDetail.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>

          </div>
        )}

        <DialogFooter className="mt-4">
          <DialogClose render={<Button variant="outline" className="w-full rounded-xl shadow-sm hover:bg-muted" onClick={onClose} />}>
            Close Details
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
