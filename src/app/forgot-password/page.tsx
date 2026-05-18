"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Languages, Mail, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { useForgotPasswordMutation } from "@/redux/api/auth-api"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const [email, setEmail] = React.useState("")
    const [isSubmitted, setIsSubmitted] = React.useState(false)
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        try {
            const res = await forgotPassword({ email }).unwrap()
            setIsSubmitted(true)
            toast.success(res?.message || "Reset link sent to your email!")
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send reset link. Please try again.")
        }
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#f8faff] dark:bg-zinc-950 px-4 py-12 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="z-10 w-full max-w-md space-y-8">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="rounded-lg bg-primary p-2 shadow-lg shadow-primary/20">
                        <Languages className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-3xl font-heading font-bold tracking-tight">FluentFlow</span>
                </div>

                {/* Forgot Password Card */}
                <Card className="border-none shadow-2xl shadow-primary/5 rounded-3xl p-4">
                    <CardHeader className="text-center space-y-2 pb-2">
                        <CardTitle className="text-3xl font-heading font-bold">
                            {isSubmitted ? "Check your email" : "Forgot Password?"}
                        </CardTitle>
                        <CardDescription className="text-base px-2">
                            {isSubmitted 
                                ? "We've sent a password reset link to your email. Please check your inbox and spam folder."
                                : "No worries! Enter your registered email and we'll send you a recovery link to get back to your practice."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="e.g. name@example.com"
                                            className="pl-11 h-12 rounded-xl bg-muted/30 border-muted focus:ring-primary/20"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isLoading || !email} 
                                    className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 group"
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
                            <div className="flex flex-col items-center justify-center space-y-4 py-4">
                                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                                </div>
                                <Button 
                                    variant="outline"
                                    onClick={() => setIsSubmitted(false)}
                                    className="w-full h-12 rounded-xl text-base font-bold border-2 border-muted"
                                >
                                    Try another email
                                </Button>
                            </div>
                        )}

                        <div className="text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm font-bold text-primary hover:underline gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Link */}
                <p className="text-center text-sm text-muted-foreground">
                    Still having trouble?{" "}
                    <Link href="/contact" className="text-foreground font-bold hover:underline">Contact Support</Link>
                </p>

            </div>
        </div>
    )
}
