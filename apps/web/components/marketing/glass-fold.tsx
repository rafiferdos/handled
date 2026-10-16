"use client"

import { usePointerMotion } from "@/hooks/use-enhanced-motion"

export function GlassFold({ children }: { children: React.ReactNode }) {
  const enabled = usePointerMotion()
  return (
    <div
      className="showcase-fold"
      data-fold-enhanced={enabled ? "true" : undefined}
    >
      <div className="showcase-fold-surface">{children}</div>
    </div>
  )
}
