"use client"

import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Lock, LogIn, Sparkles, UserPlus, X } from "lucide-react"
import Link from "next/link"

interface GuestLimitModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GuestLimitModal({ isOpen, onClose }: GuestLimitModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />


          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden z-10 text-center space-y-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 relative">
              <Sparkles className="w-8 h-8" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-slate-950" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Unlock Unlimited Practice!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                You&apos;ve used your <span className="font-bold text-teal-600 dark:text-teal-400">5 free guest messages</span> for today. Log in or create a free account to practice unlimited English!
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Link href="/login?redirect=/ai-tutor" className="block w-full">
                <Button className="w-full h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer">
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Continue</span>
                </Button>
              </Link>

              <Link href="/register" className="block w-full">
                <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer">
                  <UserPlus className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Create Free Account</span>
                </Button>
              </Link>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Free account takes less than 30 seconds to set up!
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
