import { LoadingSpinner } from "./loading-spinner"

interface PageLoaderProps {
  message?: string
}

export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
      <LoadingSpinner size="md" />
      <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">{message}</p>
    </div>
  )
}
