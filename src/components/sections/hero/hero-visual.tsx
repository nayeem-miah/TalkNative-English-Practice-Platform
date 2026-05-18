"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Video } from "lucide-react"

export function HeroVisual() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div
      className="relative"
      initial={mounted ? { opacity: 0, scale: 0.9 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      <div className="relative z-10 rounded-3xl overflow-hidden border-8 border-white dark:border-zinc-800 shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
          alt="English learners talking" 
          className="w-full h-full object-cover aspect-[4/3]"
        />
        
        <div className="absolute bottom-6 left-6 right-6 p-4 glassmorphism rounded-2xl flex items-center gap-4 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Video className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold">Live Connection</p>
            <p className="text-xs text-muted-foreground">Matching you with a partner...</p>
          </div>
          <div className="ml-auto flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-zinc-200" />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -top-6 -right-6 h-full w-full border-2 border-primary/20 rounded-3xl -z-10" />
    </motion.div>
  )
}
