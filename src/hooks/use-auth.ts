"use client"

import { useGetMeQuery } from "@/redux/api/auth-api"
import type { User } from "@/types"
import * as React from "react"

interface UseAuthReturn {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  isLoading: boolean
  mounted: boolean
}

/**
 * Shared authentication hook.
 * Wraps useGetMeQuery and exposes derived auth state.
 * Use this instead of calling useGetMeQuery directly in every component.
 */
export function useAuth(): UseAuthReturn {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const { data: userResponse, isLoading } = useGetMeQuery(undefined, {
    skip: !mounted,
  })

  const user: User | null =
    userResponse?.data?.result?.user ||
    userResponse?.data?.result ||
    userResponse?.data ||
    null

  const isLoggedIn = !!user && userResponse?.success !== false
  const isAdmin = user?.role?.toUpperCase() === "ADMIN"

  return { user, isLoggedIn, isAdmin, isLoading, mounted }
}
