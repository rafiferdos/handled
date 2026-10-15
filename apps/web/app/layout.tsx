import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

const heading = localFont({
  src: "./fonts/outfit.woff2",
  variable: "--font-heading",
  display: "swap",
  weight: "100 900",
})
const sans = localFont({
  src: "./fonts/inter.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
})
const mono = localFont({
  src: "./fonts/geist-mono.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "100 900",
  preload: false,
})

export const metadata: Metadata = {
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
  title: {
    default: "Handled — Clarity before action",
    template: "%s · Handled",
  },
  description:
    "Evidence-first AI support operations. Investigate the context, review the evidence, and keep every decision in human hands.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        sans.variable,
        heading.variable,
        mono.variable
      )}
    >
      <body>
        <Providers>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          {children}
        </Providers>
      </body>
    </html>
  )
}
