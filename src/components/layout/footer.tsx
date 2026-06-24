"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password" || pathname === "/verify-user" || pathname === "/live-call" || pathname === "/feedback"

  if (isAuthPage) return null

  return (
    <footer className="bg-background border-t py-20">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
                 <Link href="/" className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-primary via-emerald-600 to-teal-500 dark:from-primary dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
              TalkNative
            </span>
          </Link>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Empowering global voices through conversational AI and human connection.
              Practice anywhere, anytime.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-foreground uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">History</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Resources</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Premium</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-foreground uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Safety Guides</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-foreground uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TalkNative Inc. All rights reserved.</p>
          <div className="flex gap-8">
             <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
             <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
             <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
