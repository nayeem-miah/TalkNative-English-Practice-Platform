"use client"

import { TalkNativeLogo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForgotPasswordMutation } from "@/redux/api/auth-api"
import { CheckCircle2, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const handleEmailChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    const toastId = toast.loading("Sending recovery link...")

    try {
      const res = await forgotPassword({ email }).unwrap()
      setIsSubmitted(true)
      toast.success(res?.message || "Reset link sent to your email!", { id: toastId })
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || "Failed to send reset link. Please try again.", { id: toastId })
    }
  }, [email, forgotPassword])

  const handleTryAnotherEmail = React.useCallback(() => {
    setIsSubmitted(false)
  }, [])

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <TalkNativeLogo className="h-14 w-auto text-primary" />
        <div className="text-center space-y-2 mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isSubmitted ? "Check your email" : "Reset your password"}
          </h1>
          <p className="text-sm text-slate-500">
            {isSubmitted
              ? "We've sent a password reset link to your email."
              : "Enter your email and we'll send you a reset link."}
          </p>
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors duration-200" />
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
                className="pl-12 h-14 rounded-full bg-transparent border-slate-200 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200 text-base"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full h-14 rounded-full text-base font-medium shadow-none mt-4 transition-all active:scale-[0.98] duration-200 flex items-center justify-center gap-2 bg-[#0d5c53] hover:bg-[#0a4a42] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-2 animate-pulse">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <Button
            variant="outline"
            onClick={handleTryAnotherEmail}
            className="w-full h-14 rounded-full text-base font-medium border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
          >
            Try another email
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-sm text-slate-500 pt-2">
        <span>Remember your password?</span>
        <Link href="/login" className="text-primary font-medium hover:underline">
          Log In
        </Link>
      </div>
    </div>
  )
}
