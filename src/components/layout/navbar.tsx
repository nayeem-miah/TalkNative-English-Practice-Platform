/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useGetMeQuery, useLogoutMutation } from "@/redux/api/auth-api"
import { getCookie, removeCookie } from "@/utils/cookie"
import { Bot, GraduationCap, Home, LayoutDashboard, LogOut, PhoneCall, User, Users } from "lucide-react"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Community", href: "/community" },
  { name: "AI Tutor", href: "/ai-tutor" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const token = typeof window !== "undefined" && mounted ? getCookie("accessToken") : ""
  const hasToken = !!token

  const { data: userResponse, isLoading: isUserLoading, error: userError } = useGetMeQuery(undefined, {
    skip: !mounted || !hasToken,
  })
  const [logout] = useLogoutMutation()
  const user = hasToken ? (userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data) : null
  const isLoggedIn = hasToken && !!user && (userResponse?.success !== false)

  React.useEffect(() => {
    if (mounted && !isUserLoading && !isLoggedIn && hasToken) {
      const isAuthError =
        (userResponse && userResponse.success === false) ||
        (userError && ('status' in userError) && (userError.status === 401 || userError.status === 403));

      if (isAuthError) {
        removeCookie()
        window.location.href = "/login"
      }
    }
  }, [mounted, isUserLoading, isLoggedIn, userResponse, userError, hasToken])

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap()
    } catch {}
    removeCookie()
    window.location.href = "/login"
  }

  const handleMobileRedirect = (href: string) => {
    setIsOpen(false)
    window.location.href = href
  }

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password" || pathname === "/verify-user" || pathname === "/feedback"

  if (isAuthPage) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-primary via-emerald-600 to-teal-500 dark:from-primary dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
              TalkNative
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            {!mounted || isUserLoading ? (
              <div className="h-9 w-9 rounded-full bg-muted-foreground/10" />
            ) : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "relative h-10 w-10 rounded-full p-0 border border-border/50 hover:bg-muted/50 transition-colors"
                )}>
                  <Avatar className="h-9 w-9 border border-primary/10">
                    <AvatarImage src={user?.profilePicture || user?.image} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                      {user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-2xl shadow-primary/5 border-border/50" align="end" sideOffset={10}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal p-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-muted/50" />
                  <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 focus:bg-primary/5 focus:text-primary">
                      <Link href={user?.role?.toUpperCase() === "ADMIN" ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-3 w-full">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="font-semibold text-sm">
                          {user?.role?.toUpperCase() === "ADMIN" ? "Admin Dashboard" : "Dashboard"}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 focus:bg-primary/5 focus:text-primary">
                      <Link href="/live-call" className="flex items-center gap-3 w-full">
                        <PhoneCall className="h-4 w-4" />
                        <span className="font-semibold text-sm">Live Call</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 focus:bg-primary/5 focus:text-primary">
                      <Link href="/profile" className="flex items-center gap-3 w-full">
                        <User className="h-4 w-4" />
                        <span className="font-semibold text-sm">Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-muted/50" />


                  <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-xl cursor-pointer py-2.5 text-destructive focus:bg-destructive/5 focus:text-destructive"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <LogOut className="h-4 w-4" />
                        <span className="font-bold text-sm">Log out</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-9 px-5 text-sm font-semibold rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-foreground transition-all duration-200"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/live-call"
                  className={cn(
                    buttonVariants(),
                    "h-9 px-5 text-sm font-semibold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow transition-all duration-200"
                  )}
                >
                  Practice Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-2 mt-10">
                  {!mounted || isUserLoading ? (
                    <>
                      {/* Quiet skeleton for mobile menu */}
                      <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-2xl bg-muted/30 border border-border/20">
                        <div className="h-10 w-10 rounded-full bg-muted-foreground/10" />
                        <div className="flex flex-col gap-2 w-28">
                          <div className="h-3.5 bg-muted-foreground/10 rounded w-4/5" />
                          <div className="h-2.5 bg-muted-foreground/10 rounded w-3/5" />
                        </div>
                      </div>

                      <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                      </Link>

                      <Link
                        href="/courses"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/courses" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <GraduationCap className="h-5 w-5" />
                        <span>Courses</span>
                      </Link>

                      <Link
                        href="/ai-tutor"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/ai-tutor" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Bot className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        <span>AI Tutor</span>
                        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                          24/7
                        </span>
                      </Link>

                      <Link
                        href="/community"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/community" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Users className="h-5 w-5" />
                        <span>Community</span>
                      </Link>
                    </>
                  ) : isLoggedIn ? (
                    <>
                      {/* User Profile Summary in Mobile Sidebar */}
                      <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-2xl bg-muted/40 border border-border/40">
                        <Avatar className="h-10 w-10 border border-primary/10">
                          <AvatarImage src={user?.profilePicture || user?.image} alt={user?.name || "User"} />
                          <AvatarFallback className="bg-primary/5 text-primary font-bold">
                            {user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-sm truncate">{user?.name}</span>
                          <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                        </div>
                      </div>

                      <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                      </Link>

                      <Link
                        href="/ai-tutor"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/ai-tutor" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Bot className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        <span>AI Tutor</span>
                        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                          24/7
                        </span>
                      </Link>

                      <Link
                        href={user?.role?.toUpperCase() === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          (pathname === "/dashboard" || pathname === "/admin/dashboard") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>{user?.role?.toUpperCase() === "ADMIN" ? "Admin Dashboard" : "Dashboard"}</span>
                      </Link>

                      <button
                        onClick={() => handleMobileRedirect("/live-call")}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm w-full text-left cursor-pointer",
                          pathname === "/live-call" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <PhoneCall className="h-5 w-5" />
                        <span>Live Call</span>
                      </button>

                      <Link
                        href="/courses"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/courses" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <GraduationCap className="h-5 w-5" />
                        <span>Courses</span>
                      </Link>

                      <Link
                        href="/community"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/community" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Users className="h-5 w-5" />
                        <span>Community</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/profile" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <User className="h-5 w-5" />
                        <span>Profile Settings</span>
                      </Link>

                      <hr className="my-3 border-muted/60" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/5 text-destructive transition-colors w-full text-left font-bold text-sm cursor-pointer"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Log out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                      </Link>

                      <Link
                        href="/ai-tutor"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/ai-tutor" ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Bot className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        <span>AI Tutor</span>
                        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                          24/7
                        </span>
                      </Link>

                      <Link
                        href="/courses"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/courses" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <GraduationCap className="h-5 w-5" />
                        <span>Courses</span>
                      </Link>

                      <Link
                        href="/community"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/community" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Users className="h-5 w-5" />
                        <span>Community</span>
                      </Link>

                      <hr className="my-4 border-muted/60" />

                      <div className="flex flex-col gap-3 mt-2">
                        <button
                          onClick={() => handleMobileRedirect("/login")}
                          className={cn(buttonVariants({ variant: "outline" }), "w-full h-11 font-bold text-sm rounded-full flex items-center justify-center cursor-pointer")}>
                          Login
                        </button>
                        <button
                          onClick={() => handleMobileRedirect("/live-call")}
                          className={cn(buttonVariants(), "w-full h-11 rounded-full font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center cursor-pointer")}>
                          Practice Now
                        </button>
                      </div>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
