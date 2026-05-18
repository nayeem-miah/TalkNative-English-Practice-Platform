"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Circle, Eye, EyeOff, Key, Languages, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useResetPasswordMutation } from "@/redux/api/auth-api"
import { toast } from "sonner"

function ResetPasswordForm() {
    const [showPassword, setShowPassword] = React.useState(false)
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")
    
    const [resetPassword, { isLoading }] = useResetPasswordMutation()

    const requirements = {
        length: password.length >= 6,
        match: password === confirmPassword && password.length > 0,
    }
    
    const isValid = requirements.length && requirements.match

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!token) {
            toast.error("Invalid or missing reset token")
            return
        }
        
        if (!isValid) {
            toast.error("Please enter at least 6 characters and ensure passwords match")
            return
        }

        try {
            const res = await resetPassword({ token, password }).unwrap()
            toast.success(res?.message || "Password reset successful!")
            router.push("/login")
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to reset password. Token might be expired.")
        }
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#f8faff] dark:bg-zinc-950 px-4 py-12 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="z-10 w-full max-w-md space-y-8 text-center">
                {/* Logo & Subtitle */}
                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="rounded-xl bg-zinc-900 p-2 shadow-xl">
                            <div className="bg-primary/20 p-1.5 rounded-lg">
                                <Languages className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">FluentFlow</h1>
                    <p className="text-muted-foreground text-sm font-medium">Secure your account access</p>
                </div>

                {/* Reset Password Card */}
                <Card className="border-none shadow-2xl shadow-primary/5 rounded-3xl p-4 text-left">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-heading font-bold">Reset Password</CardTitle>
                        <CardDescription className="text-sm">
                            Choose a strong password to protect your learning progress.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-11 pr-11 h-12 rounded-xl bg-muted/30 border-muted focus:ring-primary/20"
                                        required
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

                            {/* Password Requirements Grid */}
                            <div className="grid grid-cols-2 gap-y-2 px-1">
                                <Requirement text="6+ characters" met={requirements.length} />
                                <Requirement text="Passwords match" met={requirements.match} />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-bold text-foreground ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-11 h-12 rounded-xl bg-muted/30 border-muted focus:ring-primary/20"
                                        required
                                    />
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-xs text-red-500 ml-1">Passwords do not match</p>
                                )}
                            </div>

                            <Button 
                                type="submit"
                                disabled={isLoading || !isValid}
                                className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 mt-4"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
                            </Button>
                        </form>

                        <div className="text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm font-bold text-primary hover:underline gap-2"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function Requirement({ text, met }: { text: string; met: boolean }) {
    return (
        <div className="flex items-center gap-2 text-xs font-medium">
            {met ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
                <Circle className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className={met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                {text}
            </span>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#f8faff] dark:bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ResetPasswordForm />
        </React.Suspense>
    )
}
