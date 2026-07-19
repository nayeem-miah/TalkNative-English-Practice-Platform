"use client"

import { motion } from "framer-motion"
import { Bot, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Footer } from "./footer"
import { Navbar } from "./navbar"

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-user"]

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAuth = AUTH_ROUTES.some((route) => pathname?.startsWith(route))
  const isAdmin = pathname?.startsWith("/admin")
  const isDashboard = pathname?.startsWith("/dashboard")
  const isLiveCall = pathname?.startsWith("/live-call")
  const isAiTutor = pathname?.startsWith("/ai-tutor")

  const hideNavbar = isAuth || isAdmin || isDashboard
  const hideFooter = isAuth || isAdmin || isDashboard || isLiveCall || isAiTutor
  const showFloatingAiBtn = !isAuth && !isAdmin && !isAiTutor

  return (
    <div className="relative flex min-h-screen flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}

      {showFloatingAiBtn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end group"
        >
          {/* Animated Tooltip Badge */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-2 px-3 py-1 rounded-full bg-slate-900/90 dark:bg-slate-800/90 text-white text-[11px] font-bold shadow-md border border-slate-700/60 backdrop-blur-md flex items-center gap-1.5 pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI English Coach 24/7</span>
          </motion.div>

          <div className="relative">
            {/* Outer Glowing Pulse Ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 opacity-70 blur-md group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />

            {/* Main Animated Button */}
            <Link
              href="/ai-tutor"
              className="relative flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-teal-600 via-emerald-600 to-[#0d5c53] hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-2xl shadow-teal-600/40 border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              title="Practice English with AI Tutor"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white animate-bounce" />
              </div>

              <span className="tracking-wide">Try AI Tutor</span>

              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
