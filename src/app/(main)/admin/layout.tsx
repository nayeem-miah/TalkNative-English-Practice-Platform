/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import * as React from "react"
import AdminLayoutClient from "./components/AdminLayoutClient"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  if (!token) {
    redirect("/login?redirect=/admin/dashboard")
  }

  const cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api/v1"

  let user: any = null
  try {
    const res = await fetch(`${baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${cleanToken}`,
      },
      cache: "no-store",
    })

    if (res.ok) {
      const resData = await res.json()
      user = resData?.data?.result?.user || resData?.data?.result || resData?.data || resData?.result?.user || resData?.result || resData
    }
  } catch (error) {
    console.error("Error fetching user in server layout:", error)
  }

  if (!user || typeof user !== "object") {
    redirect("/login?redirect=/admin/dashboard")
  }

  const isAdmin = user?.role?.toUpperCase() === "ADMIN"
  if (!isAdmin) {
    redirect("/dashboard")
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
