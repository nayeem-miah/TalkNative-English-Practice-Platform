"use client"

import { useGetMeQuery } from "@/redux/api/auth-api"
import type { User } from "@/types"
import { getCookie } from "@/utils/cookie"
import * as React from "react"

interface UseAuthReturn {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  isLoading: boolean
  mounted: boolean
}

export function useAuth(): UseAuthReturn {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const token = typeof window !== "undefined" && mounted ? getCookie("accessToken") : ""
  const hasToken = !!token

  const { data: userResponse, isLoading: isQueryLoading } = useGetMeQuery(undefined, {
    skip: !mounted || !hasToken,
  })

  const user: User | null = hasToken
    ? (userResponse?.data?.result?.user ||
       userResponse?.data?.result ||
       userResponse?.data ||
       null)
    : null

  const isLoggedIn = hasToken && !!user && userResponse?.success !== false
  const isAdmin = isLoggedIn && user?.role?.toUpperCase() === "ADMIN"
  const isLoading = hasToken ? isQueryLoading : false

  return { user, isLoggedIn, isAdmin, isLoading, mounted }
}
