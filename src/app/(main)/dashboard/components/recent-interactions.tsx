"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { RecentPartner } from "@/types"
import { ChevronRight, ExternalLink, Phone, Star } from "lucide-react"
import Link from "next/link"

interface RecentInteractionsProps {
  recentPartners: RecentPartner[]
}

export function RecentInteractions({ recentPartners }: RecentInteractionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-sans">Recent Interactions</h3>
          <p className="text-xs text-zinc-400 font-medium">History of your latest 3 conversations</p>
        </div>
        <Link href="/history" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
          Full History <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {recentPartners.length === 0 ? (
        <Card className="border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm rounded-xl bg-white dark:bg-zinc-900/60">
          <CardContent className="p-8 text-center space-y-2.5">
            <Phone className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
            <p className="text-sm text-zinc-500 font-medium">No sessions practiced yet. Connect with learners to start!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {recentPartners.map((partner) => (
            <Card key={partner.id} className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm rounded-xl bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-250 group">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-full border border-zinc-100 dark:border-zinc-800">
                    <AvatarImage src={partner.image} className="object-cover" />
                    <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350 font-bold">
                      {partner.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm group-hover:text-primary transition-colors font-sans">
                      {partner.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {partner.language}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="hidden sm:block text-right space-y-0.5">
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{partner.duration}</p>
                    <p className="text-[10px] text-zinc-455 font-bold uppercase tracking-wider">Duration</p>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="flex gap-0.5 mb-0.5 justify-end">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-2.5 w-2.5 ${i < partner.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-800'}`} />
                      ))}
                    </div>
                    <p className="text-[10px] text-zinc-400 font-semibold">{partner.time}</p>
                  </div>

                  <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-850 cursor-pointer">
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
