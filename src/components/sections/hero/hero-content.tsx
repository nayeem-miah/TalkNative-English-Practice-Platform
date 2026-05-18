"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroContent() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col items-start text-left space-y-8">
      <motion.div
        initial={mounted ? { opacity: 0, x: -20 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="secondary" className="px-3 py-1.5 gap-1.5 text-xs font-semibold uppercase tracking-wider bg-secondary/50 text-secondary-foreground border-secondary">
          <Users className="h-3.5 w-3.5" />
          JOIN 50,000+ LEARNERS WORLDWIDE
        </Badge>
      </motion.div>

      <motion.h1
        className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight leading-[1.1]"
        initial={mounted ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Master <span className="text-primary">English</span> through <br className="hidden md:block" />
        <span className="italic">Real Conversations.</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
        initial={mounted ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Practice 1-on-1 with random partners worldwide. Safe, instant, and free. 
        Build your confidence where it matters most: in dialogue.
      </motion.p>

      <motion.div
        className="flex flex-wrap items-center gap-4"
        initial={mounted ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button size="lg" className="h-12 px-10 text-base font-semibold shadow-lg shadow-primary/20">
          Get Started
        </Button>
        <Button size="lg" variant="outline" className="h-12 px-10 text-base font-semibold border-2 hover:bg-muted">
          Login
        </Button>
      </motion.div>
    </div>
  )
}
