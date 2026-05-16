"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw, Home, LifeBuoy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center relative max-w-2xl">
        {/* Background Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-destructive/10 rounded-full blur-3xl -z-10" />
        
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/5 mb-8 shadow-inner">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        
        <p className="text-base font-bold text-destructive uppercase tracking-widest">Something went wrong</p>
        <h1 className="mt-4 text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          We've encountered a problem
        </h1>
        <p className="mt-6 text-lg font-medium leading-7 text-muted-foreground">
          An unexpected error occurred while processing your request. Our team has been notified and is working on a fix.
        </p>

        {error.digest && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border inline-block">
            <p className="text-xs font-mono text-muted-foreground">
              Error ID: <span className="text-zinc-900 dark:text-white font-bold">{error.digest}</span>
            </p>
          </div>
        )}
        
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => reset()}
            className="h-12 px-8 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          
          <Link href="/">
            <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl font-bold gap-2 hover:bg-muted border-border">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
          
          <Link href="/support">
            <Button variant="ghost" size="lg" className="h-12 px-8 rounded-xl font-bold gap-2 hover:bg-muted text-muted-foreground hover:text-foreground">
              <LifeBuoy className="h-4 w-4" />
              Contact Support
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-muted-foreground font-medium">
          If the problem persists, please check our <Link href="/status" className="text-primary hover:underline font-bold">Status Page</Link> for updates.
        </div>
      </div>
    </div>
  )
}
