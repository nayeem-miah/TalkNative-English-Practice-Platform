"use client"

import { TalkNativeLogo } from "@/components/shared/logo"
import { PageLoader } from "@/components/shared/page-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { useRegisterMutation } from "@/redux/api/auth-api"
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

export function RegisterClient() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [register, { isLoading }] = useRegisterMutation()
  const router = useRouter()

  const { isLoggedIn, isLoading: isAuthLoading, mounted } = useAuth()



  React.useEffect(() => {
    if (mounted && !isAuthLoading && isLoggedIn) {
      window.location.href = "/dashboard"
    }
  }, [mounted, isAuthLoading, isLoggedIn])

  if (!mounted || isAuthLoading || isLoggedIn) {
    return <PageLoader message={isLoggedIn ? "Redirecting..." : "Verifying session..."} />
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return toast.error("Please fill in all fields")
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters")
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match")
    }

    const toastId = toast.loading("Creating your account...")

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap()
      if (res?.success) {
        toast.success("Account created successfully!", { id: toastId })
        router.push(`/verify-user?email=${formData.email}`)
      }
    } catch (err) {
      const error = err as { data?: { message?: string } }
      const errorMessage = error?.data?.message || "Something went wrong during registration"

      if (errorMessage.toLowerCase().includes("already exist")) {
        toast.info("User already exists. Redirecting to verification...", { id: toastId })
        setTimeout(() => {
          router.push(`/verify-user?email=${formData.email}`)
        }, 1500)
      } else {
        toast.error(errorMessage, { id: toastId })
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <TalkNativeLogo className="h-14 w-auto text-primary" />
        <div className="text-center space-y-2 mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Get Started</h1>
          <p className="text-sm text-slate-500">Create your account in a few simple steps</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors duration-200" />
            <Input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="pl-12 h-14 rounded-full bg-transparent border-slate-200 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200 text-base"
              disabled={isLoading}
            />
          </div>
        </div>

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
        </div>

        <div className="space-y-1">
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors duration-200" />
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pl-12 pr-12 h-14 rounded-full bg-transparent border-slate-200 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200 text-base"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-14 rounded-full text-base font-medium shadow-none mt-4 transition-all active:scale-[0.98] duration-200 flex items-center justify-center gap-2 bg-[#0d5c53] hover:bg-[#0a4a42] text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-2 text-sm text-slate-500 pt-2">
        <span>You have an account?</span>
        <Link href="/login" className="text-primary font-medium hover:underline">
          Log In
        </Link>
      </div>
    </div>
  )
}
