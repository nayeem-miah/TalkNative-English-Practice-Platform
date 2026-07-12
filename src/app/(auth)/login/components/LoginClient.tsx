/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useLoginMutation, useResendOtpMutation } from "@/redux/api/auth-api"
import { useAuth } from "@/hooks/use-auth"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"
import { PageLoader } from "@/components/shared/page-loader"

function LoginContent() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({ email: "", password: "" })

  const [login, { isLoading }] = useLoginMutation()
  const [resendOtp] = useResendOtpMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get("redirect") || "/dashboard"

  const { isLoggedIn, isLoading: isAuthLoading, mounted } = useAuth()

  React.useEffect(() => {
    if (mounted && !isAuthLoading && isLoggedIn) {
      window.location.href = redirectTo
    }
  }, [mounted, isAuthLoading, isLoggedIn, redirectTo])

  if (!mounted || isAuthLoading || isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PageLoader message={isLoggedIn ? "Redirecting..." : "Verifying session..."} />
      </div>
    )
  }

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
        const resData = res?.data || res
        const accessToken = resData?.result?.accessToken || resData?.accessToken || res?.accessToken
        const refreshToken = resData?.result?.refreshToken || resData?.refreshToken || res?.refreshToken

        if (accessToken) {
          try { localStorage.setItem("accessToken", accessToken) } catch {}
        }
        if (refreshToken) {
          try { localStorage.setItem("refreshToken", refreshToken) } catch {}
        }

        toast.success("Logged in successfully!", { id: toastId })
        window.location.href = redirectTo
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Invalid email or password"
      if (errorMessage.toLowerCase().includes("verify") || errorMessage.toLowerCase().includes("verification")) {
        toast.info("Account not verified. Sending OTP and redirecting...", { id: toastId })
        try {
          await resendOtp({ email: formData.email }).unwrap()
          router.push(`/verify-user?email=${formData.email}`)
        } catch (otpErr: any) {
          toast.error(otpErr?.data?.message || "Failed to send verification code", { id: toastId })
          setTimeout(() => {
            router.push(`/verify-user?email=${formData.email}`)
          }, 2000)
        }
      } else {
        toast.error(errorMessage, { id: toastId })
      }
    }
  }

  const handleDemoLogin = async (email: string) => {
    const credentials = { email, password: "123456" }
    setFormData(credentials)

    const toastId = toast.loading("Signing in with demo account...")

    try {
      const res = await login(credentials).unwrap()
      if (res?.success) {
        const resData = res?.data || res
        const accessToken = resData?.result?.accessToken || resData?.accessToken || res?.accessToken
        const refreshToken = resData?.result?.refreshToken || resData?.refreshToken || res?.refreshToken

        if (accessToken) {
          try { localStorage.setItem("accessToken", accessToken) } catch {}
        }
        if (refreshToken) {
          try { localStorage.setItem("refreshToken", refreshToken) } catch {}
        }

        toast.success("Logged in successfully!", { id: toastId })
        window.location.href = redirectTo
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid credentials", { id: toastId })
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <Card className="border border-border/60 bg-card shadow-sm rounded-3xl p-4">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-heading font-bold">Welcome back</CardTitle>
          <CardDescription>Please enter your details to sign in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground font-semibold">Demo Login</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin("nayeem5113a@gmail.com")}
              className="h-11 rounded-xl text-xs font-bold border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              disabled={isLoading}
            >
              👤 Normal User
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDemoLogin("admin@gmail.com")}
              className="h-11 rounded-xl text-xs font-bold border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              disabled={isLoading}
            >
              🛡️ Admin User
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">Join TalkNative</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export function LoginClient() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <PageLoader message="Preparing Login Screen..." />
      </div>
    }>
      <LoginContent />
    </React.Suspense>
  )
}
