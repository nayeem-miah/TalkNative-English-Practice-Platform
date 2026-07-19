"use client"

import { PageLoader } from "@/components/shared/page-loader"
import { setCookie } from "@/utils/cookie"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")
    const error = searchParams.get("error")

    if (error || !token) {
      toast.error(error ? `Google login failed: ${error}` : "Google authentication failed. Please try again.")
      router.push("/login?error=GoogleAuthFailed")
      return
    }

    try {
      if (token) {
        setCookie("accessToken", token)
        localStorage.setItem("accessToken", token)
      }
      if (refreshToken) {
        setCookie("refreshToken", refreshToken)
        localStorage.setItem("refreshToken", refreshToken)
      }

      toast.success("Successfully logged in with Google!")
      window.location.href = "/"
    } catch {
      toast.error("Failed to complete login. Please try again.")
      router.push("/login?error=GoogleAuthFailed")
    }
  }, [searchParams, router])

  return <PageLoader message="Completing Google authentication..." />
}

export default function GoogleCallbackPage() {
  return (
    <React.Suspense fallback={<PageLoader message="Processing authentication..." />}>
      <GoogleCallbackContent />
    </React.Suspense>
  )
}
