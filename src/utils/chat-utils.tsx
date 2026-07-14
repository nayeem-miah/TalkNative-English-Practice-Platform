export function formatMessageContent(content: string) {
  if (!content) return null

  let cleanText = content
    .replace(/you are welcom/gi, "You're welcome")
    .replace(/you are welcome/gi, "You're welcome")
  if (!cleanText.includes('\n') && /1\.\s*\w+/.test(cleanText) && /2\.\s*\w+/.test(cleanText)) {
    cleanText = cleanText.replace(/(\d+\.\s*[A-Z\w])/g, '\n$1').trim()
  }

  const finalLines = cleanText.split('\n').filter(line => line.trim())

  return (
    <div className="space-y-1.5">
      {finalLines.map((line, idx) => {
        const trimmed = line.trim()
        const isMatch = /^(\d+)\.\s*(.*)/.exec(trimmed)

        if (isMatch) {
          return (
            <div key={idx} className="flex gap-2 text-xs sm:text-sm leading-relaxed pl-1 pt-0.5">
              <span className="font-extrabold text-primary shrink-0">{isMatch[1]}.</span>
              <span className="font-medium">{isMatch[2]}</span>
            </div>
          )
        }

        return (
          <p key={idx} className="text-xs sm:text-sm font-medium leading-relaxed">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}
