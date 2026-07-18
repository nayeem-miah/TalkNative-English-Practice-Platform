/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
interface IconProps extends React.SVGProps<SVGSVGElement> {}

function Twitter(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function Linkedin(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function Instagram(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}


export function Footer() {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password" || pathname === "/verify-user" || pathname === "/live-call" || pathname === "/feedback"

  if (isAuthPage) return null

  return (
    <footer className="bg-[#051e1b] dark:bg-[#020e0d] border-t border-[#09302b] py-20 text-zinc-300">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-[#0d463e]/40 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  TalkNative
                </span>
              </Link>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs font-medium">
              Empowering global voices through conversational AI and human connection.
              Practice anywhere, anytime.
            </p>
          </div>
          <div>
            <h4 className="font-extrabold mb-6 text-white uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm text-zinc-400 font-medium">
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">History</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Premium</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold mb-6 text-white uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm text-zinc-400 font-medium">
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Safety Guides</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold mb-6 text-white uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4 text-sm text-zinc-400 font-medium">
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-zinc-500 font-medium">
          <p>© {new Date().getFullYear()} TalkNative Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" aria-label="Twitter" className="text-zinc-400 hover:text-emerald-400 transition-colors">
              <Twitter className="h-4.5 w-4.5" />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="text-zinc-400 hover:text-emerald-400 transition-colors">
              <Linkedin className="h-4.5 w-4.5" />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-zinc-400 hover:text-emerald-400 transition-colors">
              <Instagram className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
