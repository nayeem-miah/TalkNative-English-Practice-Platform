"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetMeQuery, useGetallUsrsQuery } from "@/redux/api/auth-api"

export function HeroContent() {
  const [mounted, setMounted] = React.useState(false)

  // 1. Fetch dynamic total users count
  const { data: allUsersResponse } = useGetallUsrsQuery({ page: 1, limit: 1 })
  
  // 2. Fetch logged-in user profile status
  const { data: userResponse } = useGetMeQuery(undefined)

  const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data
  const isLoggedIn = !!user && (userResponse?.success !== false)

  // Derive dynamic learners count with fallback
  const totalUsers = React.useMemo(() => {
    return allUsersResponse?.data?.meta?.total || allUsersResponse?.meta?.total || allUsersResponse?.data?.result?.length || 50000
  }, [allUsersResponse])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col items-start text-left space-y-6">
      <motion.div
        initial={mounted ? { opacity: 0, x: -20 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/50 bg-muted/10 text-xs font-medium text-muted-foreground select-none">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Join {totalUsers.toLocaleString()}+ learners worldwide</span>
        </div>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.15] text-foreground"
        initial={mounted ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Speak English fluently, <br className="hidden md:block" />
        one conversation at a time.
      </motion.h1>

      <motion.p
        className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
        initial={mounted ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Connect instantly with language learners worldwide for safe, 1-on-1 voice practice. 
        Free, fast, and designed to build real speaking confidence.
      </motion.p>

      <motion.div
        className="flex flex-wrap items-center gap-4 pt-2"
        initial={mounted ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {isLoggedIn ? (
          <>
            <Button 
              size="lg" 
              className="h-11 px-8 text-sm font-semibold rounded-full shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
              onClick={() => window.location.href = "/dashboard"}
            >
              Go to Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-11 px-8 text-sm font-semibold rounded-full border border-border/80 hover:bg-muted/50 active:scale-[0.98] transition-all"
              onClick={() => window.location.href = "/live-call"}
            >
              Join Call
            </Button>
          </>
        ) : (
          <>
            <Button 
              size="lg" 
              className="h-11 px-8 text-sm font-semibold rounded-full shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
              onClick={() => window.location.href = "/live-call"}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-11 px-8 text-sm font-semibold rounded-full border border-border/80 hover:bg-muted/50 active:scale-[0.98] transition-all"
              onClick={() => window.location.href = "/login"}
            >
              Login
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}
