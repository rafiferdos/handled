"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { MotionProvider } from "@/components/motion/motion-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: false,
            refetchOnWindowFocus: false,
          },
          mutations: { retry: false },
        },
      })
  )
  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <MotionProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors closeButton position="bottom-right" />
        </MotionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
