import * as React from "react"

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={`min-h-[400px] w-full bg-background flex flex-col items-center justify-center p-6 text-center ${className || ""}`}>
      <div className="h-9 w-9 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      <p className="text-muted-foreground font-bold mt-4 text-xs uppercase tracking-wider">{message}</p>
    </div>
  )
}
