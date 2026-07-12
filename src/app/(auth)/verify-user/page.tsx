"use client"

import { TalkNativeLogo } from "@/components/shared/logo"
import { PageLoader } from "@/components/shared/page-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useResendOtpMutation, useVerifyEmailMutation } from "@/redux/api/auth-api"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

function VerifyUserContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = React.useState(["", "", "", "", "", ""])
  const [timer, setTimer] = React.useState(120) // 02:00

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation()
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation()

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("")
    if (pastedData.length === 0) return

    const newOtp = [...otp]
    pastedData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)

    const lastIndex = Math.min(pastedData.length, 5)
    document.getElementById(`otp-${lastIndex}`)?.focus()
  }

  const handleVerify = async () => {
    const code = otp.join("")
    if (code.length < 6) {
      return toast.error("Please enter the 6-digit code")
    }

    const toastId = toast.loading("Verifying your account...")
    try {
      const res = await verifyEmail({ email, code }).unwrap()
      if (res?.success) {
        toast.success("Account verified successfully!", { id: toastId })
        router.push("/login")
      }
    } catch (err) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message || "Verification failed", { id: toastId })
    }
  }

  const handleResend = async () => {
    if (timer > 0) return

    const toastId = toast.loading("Resending code...")
    try {
      const res = await resendOtp({ email }).unwrap()
      if (res?.success) {
        toast.success("Verification code resent!", { id: toastId })
        setTimer(120)
      }
    } catch (err) {
      const error = err as { data?: { message?: string } }
      toast.error(error?.data?.message || "Failed to resend code", { id: toastId })
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <TalkNativeLogo className="h-14 w-auto text-primary" />
        <div className="text-center space-y-2 mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Verify Your Email</h1>
          <p className="text-sm text-slate-500">
            Enter the 6-digit code we sent to <span className="font-medium text-slate-700">{email || "your email"}</span>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2 sm:gap-3 justify-center py-2 w-full">
          {otp.map((digit, idx) => (
            <Input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onPaste={handlePaste}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-2xl bg-transparent border-slate-200 text-slate-900 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
              maxLength={1}
              disabled={isVerifying}
            />
          ))}
        </div>

        <Button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full h-14 rounded-full text-base font-medium shadow-none mt-4 transition-all active:scale-[0.98] duration-200 flex items-center justify-center gap-2 bg-[#0d5c53] hover:bg-[#0a4a42] text-white"
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 pt-2">
          <span>Didn&apos;t receive code?</span>
          {timer > 0 ? (
            <span className="font-medium text-slate-400">Resend OTP in {formatTime(timer)}</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-primary font-medium hover:underline focus:outline-none"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyUserPage() {
  return (
    <React.Suspense fallback={<PageLoader message="Preparing Verification Screen..." />}>
      <VerifyUserContent />
    </React.Suspense>
  )
}
