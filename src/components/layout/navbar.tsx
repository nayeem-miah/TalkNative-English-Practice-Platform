"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { MessageSquare, Menu, X, Languages } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useGetMeQuery, useLogoutMutation } from "@/redux/api/auth-api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LayoutDashboard, LogOut, Settings, PhoneCall, BookOpen } from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Resources", href: "/resources" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()
  const { data: userResponse, isLoading: isUserLoading } = useGetMeQuery(undefined)
  const [logout] = useLogoutMutation()
  const user = userResponse?.data?.result?.user || userResponse?.data?.result || userResponse?.data
  const isLoggedIn = !!user && (userResponse?.success !== false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap()
      window.location.href = "/login"
    } catch (err) {
      // Even if API fails, onQueryStarted in auth-api handles local cleanup
      window.location.href = "/login"
    }
  }

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password" || pathname === "/verify-user" || pathname === "/live-call" || pathname === "/feedback"

  if (isAuthPage) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1.5 shadow-sm shadow-primary/20">
              <Languages className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight">FluentFlow</span>
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
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "relative h-10 w-10 rounded-full p-0 border border-border/50 hover:bg-muted/50 transition-colors"
                )}>
                  <Avatar className="h-9 w-9 border border-primary/10">
                    <AvatarImage src={user?.image} alt={user?.name || "User"} />
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
                      <Link href="/dashboard" className="flex items-center gap-3 w-full">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="font-semibold text-sm">Dashboard</span>
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
                  className={cn(buttonVariants({ variant: "ghost" }), "text-sm font-semibold")}
                >
                  Login
                </Link>
                <Link
                  href="/live-call"
                  className={cn(buttonVariants(), "h-9 px-5 text-sm font-semibold rounded-full")}
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
                    <div className="flex justify-center p-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  ) : isLoggedIn ? (
                    <>
                      {/* User Profile Summary in Mobile Sidebar */}
                      <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-2xl bg-muted/40 border border-border/40">
                        <Avatar className="h-10 w-10 border border-primary/10">
                          <AvatarImage src={user?.image} alt={user?.name || "User"} />
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
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link
                        href="/live-call"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/live-call" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <PhoneCall className="h-5 w-5" />
                        <span>Live Call</span>
                      </Link>

                      <Link
                        href="/resources"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/resources" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <BookOpen className="h-5 w-5" />
                        <span>Resources</span>
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
                        <Languages className="h-5 w-5" />
                        <span>Home</span>
                      </Link>

                      <Link
                        href="/resources"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          pathname === "/resources" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <BookOpen className="h-5 w-5" />
                        <span>Resources</span>
                      </Link>

                      <hr className="my-4 border-muted/60" />

                      <div className="flex flex-col gap-3 mt-2">
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className={cn(buttonVariants({ variant: "outline" }), "w-full h-11 font-bold text-sm rounded-full")}
                        >
                          Login
                        </Link>
                        <Link
                          href="/live-call"
                          onClick={() => setIsOpen(false)}
                          className={cn(buttonVariants(), "w-full h-11 rounded-full font-bold text-sm shadow-lg shadow-primary/20")}
                        >
                          Practice Now
                        </Link>
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
