"use client"

import dynamic from "next/dynamic"
import { BookOpen, Check, Layers3 } from "lucide-react"
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
      className="hero-visual hero-stage relative mx-auto aspect-[1.14] w-full max-w-[580px] md:aspect-[0.98]"
      aria-hidden="true"
    >
      <div className="hero-orbit" />
      <div className="hero-orbit hero-orbit-secondary" />
      <span className="hero-crosshair top-[11%] left-[17%]" />
      <span className="hero-crosshair right-[8%] bottom-[16%]" />
      <div className="absolute inset-0">
        {enhanced ? <LiquidSculpture /> : <SculptureArtwork />}
      </div>
      <div className="glass-surface hero-annotation absolute top-[16%] right-0 flex items-center gap-2 rounded-full px-3.5 py-2.5 font-mono text-[9px] tracking-widest uppercase md:right-3">
        <span className="size-1.5 rounded-full bg-success" />
        Human in the loop
      </div>
      <div className="glass-surface hero-annotation absolute bottom-[5%] left-1 w-[210px] rounded-2xl p-3.5 md:bottom-[13%] md:-left-2">
        <p className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
          <Layers3 className="size-3" /> Context, connected
        </p>
        <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3 text-[11px] font-medium">
          <span className="flex items-center gap-2">
            <BookOpen className="size-3.5 text-muted-foreground" /> Two source
            references
          </span>
          <Check className="size-3.5 text-success" />
        </div>
        <p className="mt-3 flex items-center justify-between gap-2 text-[11px]">
          One thoughtful decision.
          <span className="rounded-full bg-foreground px-2 py-1 text-[9px] text-background">
            Yours.
          </span>
        </p>
      </div>
    </div>
  )
}
