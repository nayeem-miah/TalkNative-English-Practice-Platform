"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { useRegisterMutation } from "@/redux/api/auth-api"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PageLoader } from "@/components/shared/page-loader"

export function RegisterClient() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
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

    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("Please fill in all fields")
    }

    const toastId = toast.loading("Creating your account...")

    try {
      const res = await register(formData).unwrap()
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
    <div className="w-full max-w-md space-y-8">
      <Card className="border border-border/60 bg-card shadow-sm rounded-3xl p-4">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-heading font-bold">Create your account</CardTitle>
          <CardDescription>Start your journey to fluency today.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-11 h-12 rounded-xl bg-muted/30 border-muted focus:ring-primary/20"
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                <label className="text-sm font-bold text-foreground ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-11 pr-11 h-12 rounded-xl bg-muted/30 border-muted focus:ring-primary/20"
                    disabled={isLoading}
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
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-muted text-primary focus:ring-primary/20" id="terms" required />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-normal">
                I agree to the <Link href="#" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
