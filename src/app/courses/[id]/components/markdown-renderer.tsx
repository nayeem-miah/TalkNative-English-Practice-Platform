import * as React from "react"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null

  const lines = content.split(/\r?\n/)

  return (
    <div className="space-y-4 text-xs font-semibold text-muted-foreground leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-2" />

        // Header ###
        if (trimmed.startsWith("###")) {
          return (
            <h4 key={idx} className="text-sm font-black text-foreground tracking-tight mt-6 mb-2 uppercase">
              {parseBoldText(trimmed.replace(/^###\s*/, ""))}
            </h4>
          )
        }
        // Header ##
        if (trimmed.startsWith("##")) {
          return (
            <h3 key={idx} className="text-base font-black text-foreground tracking-tight mt-6 mb-2">
              {parseBoldText(trimmed.replace(/^##\s*/, ""))}
            </h3>
          )
        }
        // Header #
        if (trimmed.startsWith("#")) {
          return (
            <h2 key={idx} className="text-lg font-black text-foreground tracking-tight mt-6 mb-2">
              {parseBoldText(trimmed.replace(/^#\s*/, ""))}
            </h2>
          )
        }

        // List item starting with * or - or ✅ or 🚀
        if (trimmed.startsWith("*") || trimmed.startsWith("-") || trimmed.startsWith("✅") || trimmed.startsWith("🚀")) {
          const isCheck = trimmed.startsWith("✅")
          const isRocket = trimmed.startsWith("🚀")
          const text = trimmed.replace(/^[\*\-\s✅🚀]+/, "")

          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-primary font-bold mt-0.5">
                {isCheck ? "✓" : isRocket ? "🚀" : "•"}
              </span>
              <p className="text-foreground/80 font-medium">{parseBoldText(text)}</p>
            </div>
          )
        }

        // Default Paragraph
        return (
          <p key={idx} className="text-foreground/80 font-normal">
            {parseBoldText(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

function parseBoldText(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g)
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-extrabold text-foreground">
          {part}
        </strong>
      )
    }
    return part
  })
}
