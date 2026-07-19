import * as React from "react"

function renderFormattedInline(text: string) {
  if (!text) return null

  // Remove leftover raw symbols like ######------- or trailing pipes
  const cleaned = text.trim()
  if (!cleaned) return null

  // Split by bold (**text**)
  const parts = cleaned.split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2)
      return (
        <strong key={i} className="font-bold text-slate-900 dark:text-white">
          {boldText}
        </strong>
      )
    }
    // Handle inline code (`code`)
    if (part.includes("`")) {
      const codeParts = part.split(/(`[^`]+`)/g)
      return codeParts.map((cPart, j) => {
        if (cPart.startsWith("`") && cPart.endsWith("`")) {
          return (
            <code
              key={`${i}-${j}`}
              className="bg-slate-200/70 dark:bg-slate-800 px-1.5 py-0.5 rounded text-teal-700 dark:text-teal-300 font-mono text-xs font-semibold"
            >
              {cPart.slice(1, -1)}
            </code>
          )
        }
        return cPart
      })
    }
    return part
  })
}

export function formatMessageContent(content: string) {
  if (!content) return null

  // Fix common spelling glitches
  const cleanContent = content
    .replace(/you are welcom/gi, "You're welcome")
    .replace(/you are welcome/gi, "You're welcome")

  const lines = cleanContent.split("\n")
  const elements: React.ReactNode[] = []

  let inTable = false
  let tableRows: string[][] = []

  const flushTable = (keyPrefix: number) => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0]
      const bodyRows = tableRows.slice(1)

      elements.push(
        <div key={`table-${keyPrefix}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <table className="w-full text-xs sm:text-sm text-left">
            {headerRow && (
              <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} className="px-3.5 py-2">
                      {renderFormattedInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {bodyRows.map((r, rIdx) => (
                <tr key={rIdx} className="bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  {r.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2 text-slate-700 dark:text-slate-300">
                      {renderFormattedInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      tableRows = []
    }
    inTable = false
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()

    // 1. Skip table border rows like |---|---| or |:---|:---|
    if (/^\|[\s:\-]+\|$/.test(trimmed) || /^\|[\s:\-|]+\|$/.test(trimmed)) {
      inTable = true
      return
    }

    // 2. Table content row starting with |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      inTable = true
      const cells = trimmed
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim())
      tableRows.push(cells)
      return
    }

    // If we were in a table and hit a non-table line, flush the table
    if (inTable) {
      flushTable(idx)
    }

    // 3. Skip empty lines
    if (!trimmed) {
      elements.push(<div key={`space-${idx}`} className="h-1.5" />)
      return
    }

    // 4. Horizontal Dividers (---, ***, ___)
    if (/^[\-\*_]{3,}$/.test(trimmed)) {
      elements.push(
        <hr key={`hr-${idx}`} className="my-3 border-slate-200 dark:border-slate-800" />
      )
      return
    }

    // 5. Blockquotes (> Quote text)
    if (trimmed.startsWith(">")) {
      const quoteText = trimmed.replace(/^>\s*/, "").trim()
      elements.push(
        <blockquote
          key={`quote-${idx}`}
          className="my-2 border-l-4 border-teal-500 dark:border-teal-400 bg-teal-50/60 dark:bg-teal-950/40 p-3 rounded-r-xl text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm"
        >
          {renderFormattedInline(quoteText)}
        </blockquote>
      )
      return
    }

    // 6. Headers (# Header, ## Header, ### Header)
    const headerMatch = /^#{1,6}\s+(.*)/.exec(trimmed)
    if (headerMatch) {
      const headerText = headerMatch[1].trim()
      elements.push(
        <h3
          key={`header-${idx}`}
          className="font-bold text-sm sm:text-base text-teal-700 dark:text-teal-400 pt-2 pb-1 tracking-tight flex items-center gap-1.5"
        >
          {renderFormattedInline(headerText)}
        </h3>
      )
      return
    }

    // 7. Numbered lists (1. Item)
    const numListMatch = /^(\d+)\.\s+(.*)/.exec(trimmed)
    if (numListMatch) {
      elements.push(
        <div key={`num-${idx}`} className="flex gap-2 text-xs sm:text-sm leading-relaxed pl-1 py-0.5">
          <span className="font-extrabold text-teal-600 dark:text-teal-400 shrink-0">
            {numListMatch[1]}.
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">
            {renderFormattedInline(numListMatch[2])}
          </span>
        </div>
      )
      return
    }

    // 8. Bullet lists (* Item, - Item)
    const bulletMatch = /^[\*\-]\s+(.*)/.exec(trimmed)
    if (bulletMatch) {
      elements.push(
        <div key={`bullet-${idx}`} className="flex gap-2 text-xs sm:text-sm leading-relaxed pl-2 py-0.5 items-start">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 shrink-0 mt-2" />
          <span className="text-slate-800 dark:text-slate-200 font-medium">
            {renderFormattedInline(bulletMatch[2] || bulletMatch[1])}
          </span>
        </div>
      )
      return
    }

    // 9. Standard paragraph text
    elements.push(
      <p key={`p-${idx}`} className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
        {renderFormattedInline(trimmed)}
      </p>
    )
  })

  // Flush table if message ends with a table
  if (inTable) {
    flushTable(lines.length)
  }

  return <div className="space-y-1">{elements}</div>
}

