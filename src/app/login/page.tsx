"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Languages, Lock, Mail } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { useLoginMutation, useResendOtpMutation } from "@/redux/api/auth-api"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

function LoginContent() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  })

  const [login, { isLoading }] = useLoginMutation()
  const [resendOtp] = useResendOtpMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get("redirect") || "/"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      return toast.error("Please fill in all fields")
    }

    const toastId = toast.loading("Signing in...")

    try {
      const res = await login(formData).unwrap()
      if (res?.success) {
        toast.success("Logged in successfully!", { id: toastId })
        // Redirect to requested redirect page or root
        router.push(redirectTo)
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Invalid email or password"
      
      // If user is not verified, redirect to verification page
      if (errorMessage.toLowerCase().includes("verify") || errorMessage.toLowerCase().includes("verification")) {
        toast.info("Account not verified. Sending OTP and redirecting...", { id: toastId })
        
        try {
          // Call resend-otp before redirecting
          await resendOtp({ email: formData.email }).unwrap()
          router.push(`/verify-user?email=${formData.email}`)
        } catch (otpErr: any) {
          toast.error(otpErr?.data?.message || "Failed to send verification code", { id: toastId })
          // Still redirect even if resend fails, as they might have a code already or can resend there
          setTimeout(() => {
            router.push(`/verify-user?email=${formData.email}`)
          }, 2000)
        }
      } else {
        toast.error(errorMessage, { id: toastId })
      }
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#f8faff] dark:bg-zinc-950 px-4 py-12 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[20%] left-[10%] opacity-20 dark:opacity-10 pointer-events-none animate-bounce-slow">
        <div className="relative h-40 w-40">
          <div className="absolute inset-0 bg-primary/20 rounded-3xl rotate-12 blur-xl" />
          <MessageCircle3D />
        </div>
      </div>
      <div className="absolute bottom-[10%] right-[10%] opacity-20 dark:opacity-10 pointer-events-none">
        <div className="relative h-48 w-48">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl" />
          <Globe3D />
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
          <p className="text-muted-foreground text-sm font-medium">Clearer communication, global connection.</p>
        </div>

        {/* Login Card */}
        <Card className="border-none shadow-2xl shadow-primary/5 rounded-3xl p-4">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-heading font-bold">Welcome back</CardTitle>
            <CardDescription>Please enter your details to sign in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button variant="outline" className="w-full h-12 gap-2 rounded-xl font-medium border-muted" disabled={isLoading}>
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
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground font-semibold">OR EMAIL</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-11 h-12 rounded-xl bg-muted/30 border-muted focus:ring-primary/20"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-bold text-foreground">Password</label>
                  <Link 
                    href="/forgot-password" 
                    className={cn(
                      "text-xs font-bold text-primary hover:underline",
                      isLoading && "pointer-events-none opacity-50"
                    )}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-11 pr-11 h-12 rounded-xl bg-muted/30 border-muted focus:ring-primary/20"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">Join FluentFlow</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#f8faff] dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-[#006D5B] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-600 dark:text-zinc-400 font-bold text-sm">Preparing Login Screen...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </React.Suspense>
  )
}
function MessageCircle3D() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full text-primary/30 fill-current">
      <circle cx="100" cy="100" r="80" opacity="0.1" />
      <path d="M60,140 L40,160 L40,120 C30,100 30,70 50,50 C70,30 110,30 130,50 C150,70 150,110 130,130 C110,150 70,150 60,140 Z" />
      <circle cx="100" cy="90" r="30" className="text-primary/40" />
    </svg>
  )
}

function Globe3D() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full text-accent/30 fill-current">
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <path d="M20,100 Q100,20 180,100 Q100,180 20,100" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M100,20 Q180,100 100,180 Q20,100 100,20" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="100" cy="100" r="40" opacity="0.2" />
    </svg>
  )
}
