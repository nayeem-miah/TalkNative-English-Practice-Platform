"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center relative">
        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-8 shadow-inner">
          <Search className="h-10 w-10 text-primary" />
        </div>
        
        <p className="text-base font-bold text-primary uppercase tracking-widest">404 Error</p>
        <h1 className="mt-4 text-4xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium leading-7 text-muted-foreground max-w-lg mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/">
            <Button size="lg" className="h-12 px-8 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="lg" 
            className="h-12 px-8 rounded-xl font-bold gap-2 hover:bg-muted"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Support Links */}
        <div className="mt-16 pt-8 border-t border-border flex flex-wrap justify-center gap-8">
          <Link href="/resources" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            Learning Resources
          </Link>
          <Link href="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            User Dashboard
          </Link>
          <Link href="/help" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            Support Center
          </Link>
        </div>
      </div>
    </div>
  )
}
