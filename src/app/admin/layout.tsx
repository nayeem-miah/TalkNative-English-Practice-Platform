import { AdminSidebar } from "@/components/layout/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#f9fafb] dark:bg-zinc-950 font-sans antialiased">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 max-w-[1600px] w-full mx-auto">
          {children}
        </div>
        <footer className="px-10 py-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            © {new Date().getFullYear()} FluentFlow Administrative Console • Version 1.0.3
          </p>
        </footer>
      </main>
    </div>
  )
}
