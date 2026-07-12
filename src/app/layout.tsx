import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "TalkNative | Master English with AI-Powered Conversations",
  description: "Practice your English speaking skills with real-time AI feedback and immersive native-like conversations.",
  keywords: ["English learning", "AI speaking practice", "ESL", "Language learning app", "TalkNative"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased selection:bg-primary/20",
          inter.variable,
          outfit.variable
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ReduxProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster position="top-center" richColors />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
