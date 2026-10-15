"use client"

import dynamic from "next/dynamic"
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion"
import { SculptureArtwork } from "./sculpture-artwork"

const LiquidSculpture = dynamic(() => import("./liquid-sculpture"), {
  ssr: false,
  loading: () => <SculptureArtwork />,
})

export function HeroVisual() {
  const enhanced = useEnhancedMotion()
  return (
    <div
      className="hero-visual relative mx-auto aspect-[0.98] w-full max-w-[580px]"
      aria-hidden="true"
    >
      <div className="sculpture-orbit absolute inset-[12%] rounded-full border border-foreground/8" />
      <div className="absolute inset-0">
        {enhanced ? <LiquidSculpture /> : <SculptureArtwork />}
      </div>
      <div className="absolute top-[18%] right-1 flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-2 font-mono text-[9px] tracking-widest uppercase backdrop-blur-md md:right-6">
        <span className="size-1.5 rounded-full bg-success" />
        Human in the loop
      </div>
      <div className="absolute bottom-[15%] left-0 flex items-center gap-3 rounded-xl border border-border/70 bg-background/75 px-4 py-3 backdrop-blur-md md:left-4">
        <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-xs text-background">
          ✓
        </span>
        <div>
          <p className="text-[11px] font-medium">Clarity, before action.</p>
          <p className="mt-0.5 font-mono text-[9px] text-muted-foreground">
            Evidence → Your decision
          </p>
        </div>
      </div>
    </div>
  )
}
