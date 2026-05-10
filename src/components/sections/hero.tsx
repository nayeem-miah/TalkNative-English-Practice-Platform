"use client"

import { motion } from "framer-motion"
import { ArrowRight, Play, Sparkles, Users, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40">
      {/* Refined Background elements */}
      <div className="absolute top-0 right-0 -z-10 h-full w-full opacity-30 dark:opacity-10">
        <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <div className="container px-4 md:px-8 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Master <span className="text-primary">English</span> through <br className="hidden md:block" />
            <span className="italic">Real Conversations.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Practice 1-on-1 with random partners worldwide. Safe, instant, and free. 
            Build your confidence where it matters most: in dialogue.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
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

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {/* Main Visual - Similar to the reference image */}
          <div className="relative z-10 rounded-3xl overflow-hidden border-8 border-white dark:border-zinc-800 shadow-2xl">
             <img 
               src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
               alt="English learners talking" 
               className="w-full h-full object-cover aspect-[4/3]"
             />
             
             {/* Floating UI Card - Inspired by "Live Connection" in reference */}
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
          
          {/* Background decorative square */}
          <div className="absolute -top-6 -right-6 h-full w-full border-2 border-primary/20 rounded-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  )
}
