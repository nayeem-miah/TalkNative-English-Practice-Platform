"use client"

import { TalkNativeLogo } from "@/components/shared/logo"
import { PageLoader } from "@/components/shared/page-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useResetPasswordMutation } from "@/redux/api/auth-api"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const handlePasswordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])

  const handleConfirmPasswordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }, [])

  const isValid = React.useMemo(() => {
    return password.length >= 6 && password === confirmPassword
  }, [password, confirmPassword])

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error("Invalid or missing reset token")
      return
    }

    if (!isValid) {
      toast.error("Please enter at least 6 characters and ensure passwords match")
      return
    }

    const toastId = toast.loading("Resetting your password...")

    try {
      const res = await resetPassword({ token, password }).unwrap()
      toast.success(res?.message || "Password reset successful!", { id: toastId })
      router.push("/login")
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || "Failed to reset password. Token might be expired.", { id: toastId })
    }
  }, [token, isValid, password, resetPassword, router])

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <TalkNativeLogo className="h-14 w-auto text-primary" />
        <div className="text-center space-y-2 mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create new password</h1>
          <p className="text-sm text-slate-500">
            Your new password must be different from previous used passwords.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors duration-200" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              className="pl-12 pr-12 h-14 rounded-full bg-transparent border-slate-200 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200 text-base"
              required
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
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm Password"
              className="pl-12 pr-12 h-14 rounded-full bg-transparent border-slate-200 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200 text-base"
              required
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
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-500 font-medium pl-4 pt-1">
              Passwords do not match
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !isValid}
          className="w-full h-14 rounded-full text-base font-medium shadow-none mt-4 transition-all active:scale-[0.98] duration-200 flex items-center justify-center gap-2 bg-[#0d5c53] hover:bg-[#0a4a42] text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-2 text-sm text-slate-500 pt-2">
        <Link href="/login" className="text-primary font-medium hover:underline">
          Back to Log In
        </Link>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<PageLoader message="Loading Reset Screen..." />}>
      <ResetPasswordForm />
    </React.Suspense>
  )
}
