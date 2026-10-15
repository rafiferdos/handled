import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const heading = localFont({ src: "./fonts/outfit.ttf", variable: "--font-heading", display: "swap", weight: "100 900" })
const sans = localFont({ src: "./fonts/inter.ttf", variable: "--font-sans", display: "swap", weight: "100 900" })
const mono = localFont({ src: "./fonts/geist-mono.ttf", variable: "--font-mono", display: "swap", weight: "100 900", preload: false })

export const metadata: Metadata = {
  title: { default: "Handled — Clarity before action", template: "%s · Handled" },
  description: "Evidence-first AI support operations. Investigate the context, review the evidence, and keep every decision in human hands.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", sans.variable, heading.variable, mono.variable)}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
