"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShieldCheck, Headphones, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { useVerifyEmailMutation, useResendOtpMutation } from "@/redux/api/auth-api"
import { useSearchParams, useRouter } from "next/navigation"
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

        // Focus the last filled input or the next empty one
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
        } catch (err: any) {
            toast.error(err?.data?.message || "Verification failed", { id: toastId })
        }
    }

    const handleResend = async () => {
        if (timer > 0) return
        
        const toastId = toast.loading("Resending code...")
        try {
            const res = await resendOtp({ email }).unwrap()
            if (res?.success) {
                toast.success("Verification code resent!", { id: toastId })
                setTimer(120) // Reset timer to 2 minutes
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to resend code", { id: toastId })
        }
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 overflow-hidden transition-colors duration-300">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="z-10 w-full max-w-md space-y-8">
                {/* Logo Section */}
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">TalkNative</h1>
                    <p className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase opacity-80">Secure Verification</p>
                </div>

                <Card className="border-none shadow-2xl rounded-[40px] p-8 sm:p-10 text-center bg-card dark:bg-zinc-900/90 relative overflow-hidden transition-colors border border-border/50">
                    <div className="flex flex-col items-center gap-8">
                        {/* Icon */}
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Mail className="w-8 h-8" />
                        </div>

                        <div className="space-y-3">
                            <CardTitle className="text-2xl sm:text-3xl font-heading font-bold">Check your email</CardTitle>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                We've sent a 6-digit verification code to <span className="text-foreground font-bold italic">{email || "your email"}</span>.
                            </p>
                        </div>

                        {/* OTP Inputs */}
                        <div className="flex gap-2 sm:gap-3 justify-center py-2">
                            {otp.map((digit, idx) => (
                                <Input
                                    key={idx}
                                    id={`otp-${idx}`}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onPaste={handlePaste}
                                    className="w-10 h-14 sm:w-16 sm:h-20 text-center text-xl sm:text-2xl font-bold rounded-2xl border-none bg-muted dark:bg-zinc-800 text-foreground focus:ring-2 focus:ring-primary/40 transition-all"
                                    maxLength={1}
                                    disabled={isVerifying}
                                />
                            ))}
                        </div>

                        <Button 
                            onClick={handleVerify}
                            disabled={isVerifying}
                            className="w-full h-14 sm:h-16 rounded-[25px] text-lg font-bold shadow-xl shadow-primary/20 gap-3 bg-primary hover:opacity-90 text-primary-foreground"
                        >
                            {isVerifying ? "Verifying..." : "Verify Account"}
                            <ShieldCheck className="h-5 w-5" />
                        </Button>

                        {/* Resend & Timer */}
                        <div className="w-full flex items-center justify-between px-2">
                            <p className="text-[11px] font-bold text-muted-foreground leading-tight text-left">Didn't receive the<br />code?</p>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={handleResend}
                                    disabled={timer > 0 || isResending}
                                    className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isResending ? "Sending..." : "Resend Code"}
                                </button>
                                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl">
                                    {formatTime(timer)}
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/login"
                            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 pt-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Login
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default function VerifyUserPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-[#f8faff] dark:bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-[#006D5B] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-600 dark:text-zinc-400 font-bold text-sm">Preparing Verification Screen...</p>
                </div>
            </div>
        }>
            <VerifyUserContent />
        </React.Suspense>
    )
}
