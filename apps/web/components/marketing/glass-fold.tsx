"use client"

import { lazy, Suspense } from "react"
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion"

const GlassFoldEffect = lazy(() => import("./glass-fold-effect"))

export function GlassFold({ children }: { children: React.ReactNode }) {
  const enhanced = useEnhancedMotion()
  // Keep the same content visible while the optional desktop effect is loading.
  return enhanced ? (
    <Suspense fallback={children}>
      <GlassFoldEffect>{children}</GlassFoldEffect>
    </Suspense>
  ) : (
    <>{children}</>
  )
}
