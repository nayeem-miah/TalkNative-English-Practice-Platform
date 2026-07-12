"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useLoginMutation, useResendOtpMutation } from "@/redux/api/auth-api"
import { useAuth } from "@/hooks/use-auth"
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"
import { PageLoader } from "@/components/shared/page-loader"
import { TalkNativeLogo } from "@/components/shared/logo"
import { setCookie } from "@/utils/cookie"

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
    return <PageLoader message={isLoggedIn ? "Redirecting..." : "Verifying session..."} />
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
          try { 
            localStorage.setItem("accessToken", accessToken);
            setCookie("accessToken", accessToken);
          } catch {}
        }
        if (refreshToken) {
          try { 
            localStorage.setItem("refreshToken", refreshToken);
            setCookie("refreshToken", refreshToken);
          } catch {}
        }

        toast.success("Logged in successfully!", { id: toastId })
        window.location.href = redirectTo
      }
    } catch (err) {
      const error = err as { data?: { message?: string } }
      const errorMessage = error?.data?.message || "Invalid email or password"
      if (errorMessage.toLowerCase().includes("verify") || errorMessage.toLowerCase().includes("verification")) {
        toast.info("Account not verified. Sending OTP and redirecting...", { id: toastId })
        try {
          await resendOtp({ email: formData.email }).unwrap()
          router.push(`/verify-user?email=${formData.email}`)
        } catch (otpErr) {
          const error = otpErr as { data?: { message?: string } }
          toast.error(error?.data?.message || "Failed to send verification code", { id: toastId })
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
          try { 
            localStorage.setItem("accessToken", accessToken);
            setCookie("accessToken", accessToken);
          } catch {}
        }
        if (refreshToken) {
          try { 
            localStorage.setItem("refreshToken", refreshToken);
            setCookie("refreshToken", refreshToken);
          } catch {}
        }

        toast.success("Logged in successfully!", { id: toastId })
        window.location.href = redirectTo
      }
    } catch (err) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message || "Invalid credentials", { id: toastId })
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <TalkNativeLogo className="h-14 w-auto text-primary" />
        <div className="text-center space-y-2 mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500">Log in to access your account and continue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors duration-200" />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-12 h-14 rounded-full bg-transparent border-slate-200 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200 text-base"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors duration-200" />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-12 pr-12 h-14 rounded-full bg-transparent border-slate-200 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200 text-base"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="flex justify-end pt-1 pr-2">
            <Link
              href="/forgot-password"
              className={cn(
                "text-sm font-medium text-primary hover:text-primary/80 transition-colors",
                isLoading && "pointer-events-none opacity-50"
              )}
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-14 rounded-full text-base font-medium shadow-none mt-2 transition-all active:scale-[0.98] duration-200 flex items-center justify-center gap-2 bg-[#0d5c53] hover:bg-[#0a4a42] text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing In...
            </>
          ) : (
            "Log In"
          )}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-2 text-sm text-slate-500 pt-2">
        <span>You don&apos;t have an account?</span>
        <Link href="/register" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </div>

      {/* Demo Users Section */}
      <div className="pt-6 border-t border-slate-100">
        <p className="text-xs text-center text-slate-400 mb-3 uppercase tracking-wider font-semibold">Demo Accounts</p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("nayeem5113a@gmail.com")}
            className="h-10 rounded-full text-xs font-medium border-slate-200 hover:bg-slate-50 transition-all duration-200"
            disabled={isLoading}
          >
            👤 Normal User
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("admin@gmail.com")}
            className="h-10 rounded-full text-xs font-medium border-slate-200 hover:bg-slate-50 transition-all duration-200"
            disabled={isLoading}
          >
            🛡️ Admin User
          </Button>
        </div>
      </div>
    </div>
  )
}

export function LoginClient() {
  return (
    <React.Suspense fallback={<PageLoader message="Preparing Login Screen..." />}>
      <LoginContent />
    </React.Suspense>
  )
}
