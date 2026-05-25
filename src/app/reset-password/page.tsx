"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useResetPasswordMutation } from "@/redux/api/auth-api"
import { CheckCircle2, Circle, Eye, EyeOff, Key, Loader2, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

// Memoized Requirement helper component to prevent unnecessary repaints
const Requirement = React.memo(function Requirement({ text, met }: { text: string; met: boolean }) {
    return (
        <div className="flex items-center gap-2 text-xs font-semibold select-none">
            {met ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 transition-colors duration-200" />
            ) : (
                <Circle className="h-4 w-4 text-muted-foreground transition-colors duration-200" />
            )}
            <span className={cn(
                "transition-colors duration-200",
                met ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-muted-foreground"
            )}>
                {text}
            </span>
        </div>
    )
})

function ResetPasswordForm() {
    const [showPassword, setShowPassword] = React.useState(false)
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [resetPassword, { isLoading }] = useResetPasswordMutation()

    // Stable input change handlers
    const handlePasswordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }, [])

    const handleConfirmPasswordChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value)
    }, [])

    // Stable password visibility toggle
    const handleTogglePassword = React.useCallback(() => {
        setShowPassword((prev) => !prev)
    }, [])

    // useMemo for requirements to avoid unnecessary recalculations
    const requirements = React.useMemo(() => ({
        length: password.length >= 6,
        match: password === confirmPassword && password.length > 0,
    }), [password, confirmPassword])

    const isValid = React.useMemo(() => {
        return requirements.length && requirements.match
    }, [requirements])

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
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to reset password. Token might be expired.", { id: toastId })
        }
    }, [token, isValid, password, resetPassword, router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-6">
                {/* Reset Password Card */}
                <Card className="border border-border/60 bg-card shadow-sm rounded-3xl p-4">
                    <CardHeader className="space-y-1 pb-3">
                        <CardTitle className="text-2xl font-heading font-bold tracking-tight">Reset Password</CardTitle>
                        <CardDescription className="text-sm">
                            Choose a strong password to protect your learning progress.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-5 pt-3">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-foreground/80 tracking-wide ml-1 uppercase">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        className="pl-11 pr-11 h-12 rounded-xl bg-muted/20 border-muted focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleTogglePassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/80 dark:hover:bg-zinc-800 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements Grid */}
                            <div className="grid grid-cols-2 gap-y-2 px-1 py-1 bg-muted/10 dark:bg-zinc-950/20 rounded-xl p-3 border border-border/10">
                                <Requirement text="6+ characters" met={requirements.length} />
                                <Requirement text="Passwords match" met={requirements.match} />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5 pt-1">
                                <label className="text-xs font-bold text-foreground/80 tracking-wide ml-1 uppercase">Confirm Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        placeholder="••••••••"
                                        className="pl-11 h-12 rounded-xl bg-muted/20 border-muted focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-xs text-destructive font-semibold ml-1.5 animate-pulse">
                                        Passwords do not match
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || !isValid}
                                className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 mt-2 transition-all active:scale-[0.98] flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Update Password"
                                )}
                            </Button>
                        </form>

                        <div className="text-center pt-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors gap-2"
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

export default function ResetPasswordPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#f8faff] dark:bg-zinc-950 transition-colors duration-300">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <ResetPasswordForm />
        </React.Suspense>
    )
}
