"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForgotPasswordMutation } from "@/redux/api/auth-api"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react"
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
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send reset link. Please try again.", { id: toastId })
        }
    }, [email, forgotPassword])

    const handleTryAnotherEmail = React.useCallback(() => {
        setIsSubmitted(false)
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-6">
                {/* Forgot Password Card */}
                <Card className="border border-border/60 bg-card shadow-sm rounded-3xl p-4">
                    <CardHeader className="text-center space-y-2 pb-2">
                        <CardTitle className="text-2xl font-heading font-bold tracking-tight">
                            {isSubmitted ? "Check your email" : "Forgot Password?"}
                        </CardTitle>
                        <CardDescription className="text-sm px-2 leading-relaxed">
                            {isSubmitted
                                ? "We've sent a password reset link to your email. Please check your inbox and spam folder."
                                : "No worries! Enter your registered email and we'll send you a recovery link to get back to your practice."
                            }
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-4">
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-foreground/80 tracking-wide ml-1 uppercase">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            placeholder="e.g. name@example.com"
                                            className="pl-11 h-12 rounded-xl bg-muted/20 border-muted focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 mt-2 transition-all active:scale-[0.98] group flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            Send Reset Link
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-5 py-2">
                                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-1 animate-pulse">
                                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleTryAnotherEmail}
                                    className="w-full h-12 rounded-xl text-base font-bold border-2 border-muted hover:bg-muted/50 transition-colors"
                                >
                                    Try another email
                                </Button>
                            </div>
                        )}

                        <div className="text-center pt-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Link */}
                <p className="text-center text-sm text-muted-foreground pt-2">
                    Still having trouble?{" "}
                    <Link href="/contact" className="text-foreground font-bold hover:underline">Contact Support</Link>
                </p>

            </div>
        </div>
    )
}
