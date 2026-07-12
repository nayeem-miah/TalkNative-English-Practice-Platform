export const siteConfig = {
  name: "TalkNative",
  description:
    "Practice your English speaking skills with real-time AI feedback and immersive native-like conversations.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://talknative.com",
  keywords: [
    "English learning",
    "AI speaking practice",
    "ESL",
    "Language learning app",
    "TalkNative",
  ],
  social: {
    twitter: "https://twitter.com/talknative",
    github: "https://github.com/talknative",
  },
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Community", href: "/community" },
  ],
  dashboardLinks: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Courses", href: "/dashboard/my-courses" },
    { label: "Announcements", href: "/dashboard/announcements" },
    { label: "Support", href: "/dashboard/support" },
  ],
} as const

export type SiteConfig = typeof siteConfig
