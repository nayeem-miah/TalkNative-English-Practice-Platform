"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShieldCheck, Headphones, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import * as React from "react"

export default function VerifyUserPage() {
    const [otp, setOtp] = React.useState(["", "", "", "", "", ""])
    const [timer, setTimer] = React.useState(148) // 02:28

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

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 overflow-hidden transition-colors duration-300">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="z-10 w-full max-w-md space-y-8">
                {/* Logo Section */}
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">FluentFlow</h1>
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
                                We've sent a 6-digit verification code to <span className="text-foreground font-bold italic">   com</span>.
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
                                    className="w-10 h-14 sm:w-16 sm:h-20 text-center text-xl sm:text-2xl font-bold rounded-2xl border-none bg-muted dark:bg-zinc-800 text-foreground focus:ring-2 focus:ring-primary/40 transition-all"
                                    maxLength={1}
                                />
                            ))}
                        </div>

                        <Button className="w-full h-14 sm:h-16 rounded-[25px] text-lg font-bold shadow-xl shadow-primary/20 gap-3 bg-primary hover:opacity-90 text-primary-foreground">
                            Verify Account
                            <ShieldCheck className="h-5 w-5" />
                        </Button>

                        {/* Resend & Timer */}
                        <div className="w-full flex items-center justify-between px-2">
                            <p className="text-[11px] font-bold text-muted-foreground leading-tight text-left">Didn't receive the<br />code?</p>
                            <div className="flex items-center gap-4">
                                <button className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider">
                                    Resend Code
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
