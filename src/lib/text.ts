// Helper to strip markdown syntax for a clean plain-text snippet
export function stripMarkdown(md: string): string {
  if (!md) return ""
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .trim()
}

// Clean title helper to remove trailing draft/update words
export function cleanTitle(title: string): string {
  if (!title) return ""
  return title.replace(/\s+update\s*$/i, "").replace(/\s+Update\s*$/i, "")
}

// Clean thumbnail helper to fallback when design mockup images are uploaded
export function getCleanThumbnail(url?: string | null): string {
  if (!url) return "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
  if (
    url.includes("image_8c1d9f.png") ||
    url.includes("mockup") ||
    url.includes("placeholder")
  ) {
    return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60"
  }
  return url
}

