import { cn } from "@/lib/utils"

export function MarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;
  
  const cleanText = text.replace(/\\n/g, '\n');
  const lines = cleanText.split(/\r?\n/);

  const formatLineText = (line: string) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={index} className="h-2" />;
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="text-lg font-bold mt-5 mb-2 first:mt-0 text-foreground flex items-center gap-1">
              {formatLineText(trimmed.slice(4))}
            </h3>
          );
        }
        
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="text-xl font-bold mt-7 mb-3 first:mt-0 text-foreground">
              {formatLineText(trimmed.slice(3))}
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={index} className="text-2xl font-bold mt-8 mb-4 first:mt-0 text-foreground">
              {formatLineText(trimmed.slice(2))}
            </h1>
          );
        }

        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          return (
            <div key={index} className="flex items-start gap-2 pl-4 py-1">
              <span className="text-primary font-bold text-lg leading-none select-none">•</span>
              <span className="flex-1">{formatLineText(trimmed.slice(2))}</span>
            </div>
          );
        }

        return (
          <p key={index} className="leading-relaxed">
            {formatLineText(line)}
          </p>
        );
      })}
    </div>
  );
}
