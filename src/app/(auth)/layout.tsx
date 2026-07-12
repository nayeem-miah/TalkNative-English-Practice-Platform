import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "TalkNative | Account",
  description: "Connect to your TalkNative account to practice English.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full relative bg-white overflow-hidden flex flex-col">
      {/* Abstract Background Shapes */}
      {/* Top Right Solid Shape */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#f2f8f7] pointer-events-none" />

      {/* Bottom Left Solid Shape */}
      <div className="absolute bottom-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#f2f8f7] pointer-events-none" />

      {/* Bottom Right Hollow Circle */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] rounded-full border-[1.5px] border-[#e5f0ef] pointer-events-none bg-transparent" />

      {/* Top Navigation - Back to home */}
      <div className="relative z-10 w-full p-6 sm:p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center bg-white">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          Back to home
        </Link>
      </div>

      {/* Form Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 pb-20 w-full">
        {children}
      </div>
    </div>
  )
}
