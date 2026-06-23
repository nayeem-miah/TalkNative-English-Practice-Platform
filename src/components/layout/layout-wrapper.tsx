"use client"

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isDashboard = pathname?.startsWith("/dashboard");
  const isLiveCall = pathname?.startsWith("/live-call");

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAdmin && !isDashboard && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdmin && !isDashboard && !isLiveCall && <Footer />}
    </div>
  );
}
