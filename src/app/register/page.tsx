"use client"

import * as React from "react"
import Link from "next/link"
import { Languages, Mail, Lock, User, Eye, EyeOff, ShieldCheck, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#f8faff] dark:bg-zinc-950 px-4 py-12 overflow-hidden">
      {/* Background Decorative Elements (Consistent with Login) */}
      <div className="absolute top-[15%] right-[5%] opacity-20 dark:opacity-10 pointer-events-none animate-pulse-slow">
        <div className="relative h-56 w-56">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
          <CircleDecoration />
        </div>
      </div>
      <div className="absolute bottom-[5%] left-[5%] opacity-20 dark:opacity-10 pointer-events-none">
        <div className="relative h-40 w-40">
          <div className="absolute inset-0 bg-accent/20 rounded-3xl -rotate-12 blur-2xl" />
          <SquareDecoration />
        </div>
      </div>

      <div className="z-10 w-full max-w-md space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="rounded-lg bg-primary p-2 shadow-lg shadow-primary/20">
              <Languages className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-3xl font-heading font-bold tracking-tight">FluentFlow</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Join thousands of voices worldwide.</p>
        </div>

        {/* Register Card */}
        <Card className="border-none shadow-2xl shadow-primary/5 rounded-3xl p-4">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-heading font-bold">Create your account</CardTitle>
            <CardDescription>Start your journey to fluency today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-11 h-12 rounded-xl bg-muted/30 border-muted focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="pl-11 h-12 rounded-xl bg-muted/30 border-muted focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="pl-11 pr-11 h-12 rounded-xl bg-muted/30 border-muted focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 ml-1">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-muted text-primary focus:ring-primary/20" id="terms" />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-normal">
                I agree to the <Link href="#" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20">
              Create Account
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground font-semibold">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-12 gap-2 rounded-xl font-medium border-muted">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27c-.03 0-.03-.01-.03-.01z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CircleDecoration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full text-primary/20 fill-current">
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="100" cy="100" r="40" opacity="0.1" />
      <path d="M100,20 L100,180 M20,100 L180,100" stroke="currentColor" strokeWidth="0.2" />
    </svg>
  )
}

function SquareDecoration() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full text-accent/20 fill-current">
      <rect x="40" y="40" width="120" height="120" rx="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <rect x="70" y="70" width="60" height="60" rx="10" opacity="0.1" />
      <path d="M40,40 L160,160 M160,40 L40,160" stroke="currentColor" strokeWidth="0.2" />
    </svg>
  )
}
