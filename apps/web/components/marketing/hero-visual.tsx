"use client"

import dynamic from "next/dynamic"
import { ArrowUpRight, BookOpen, Check, Layers3 } from "lucide-react"
import { usePointerMotion } from "@/hooks/use-enhanced-motion"
import { SculptureArtwork } from "./sculpture-artwork"

const LiquidSculpture = dynamic(() => import("./liquid-sculpture"), {
  ssr: false,
  loading: () => <SculptureArtwork />,
})

export function HeroVisual() {
  const enhanced = usePointerMotion()
  return (
    <div
      className="hero-visual hero-stage expressive-hero-stage relative mx-auto aspect-[1.04] w-full max-w-[620px] md:aspect-[0.93]"
      aria-hidden="true"
    >
      <div className="hero-art-panel glass-scene-panel absolute inset-0 overflow-hidden rounded-[1.75rem] md:inset-x-5 md:inset-y-6 md:rounded-[2rem]">
        <div className="hero-coordinate-grid absolute inset-0" />
        <div className="hero-orbit" />
        <div className="hero-orbit hero-orbit-secondary" />
        <span className="absolute top-6 left-6 font-mono text-[8px] tracking-[0.18em] text-[#c0d5c8]/65 md:text-[9px]">
          SUPPORT, CONSIDERED.
        </span>
        <span className="absolute right-6 bottom-6 font-mono text-[8px] tracking-[0.18em] text-[#c0d5c8]/65 md:text-[9px]">
          CONTEXT / CARE / CLARITY
        </span>
        <span className="hero-crosshair top-[14%] right-[13%]" />
        <span className="hero-crosshair bottom-[19%] left-[12%]" />
        <div className="hero-signal-ring" />
      </div>
      <div className="hero-sculpture-layer absolute inset-0">
        {enhanced ? <LiquidSculpture /> : <SculptureArtwork />}
      </div>
      <div className="hero-human-label hero-annotation glass-surface glass-smoked absolute top-[17%] right-3 flex items-center gap-2.5 rounded-full px-3.5 py-2.5 font-mono text-[8px] tracking-widest uppercase md:top-[16%] md:right-0 md:px-4 md:text-[9px]">
        <span className="flex size-3 items-center justify-center rounded-full border border-[#bcf4d4]/30">
          <span className="size-1 rounded-full bg-[#bcf4d4]" />
        </span>
        Human in the loop <ArrowUpRight className="size-3" />
      </div>
      <div className="hero-proof-card hero-annotation glass-surface glass-smoked absolute bottom-[6%] left-3 w-[218px] rounded-2xl p-4 md:bottom-[9%] md:left-0 md:w-[244px] md:p-5">
        <p className="glass-muted mb-3 flex items-center gap-2 font-mono text-[8px] tracking-[0.13em] uppercase md:text-[9px]">
          <Layers3 className="size-3" /> Context, connected
        </p>
        <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-3 text-[11px] font-medium">
          <span className="flex items-center gap-2">
            <BookOpen className="glass-muted size-3.5" /> Two source references
          </span>
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-[#bcf4d4]/25 bg-[#bcf4d4]/10">
            <Check className="size-3 text-[#bcf4d4]" />
          </span>
        </div>
        <p className="mt-3 flex items-center justify-between gap-2 text-[11px]">
          One thoughtful decision.
          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] text-white">
            Yours.
          </span>
        </p>
      </div>
    </div>
  )
}
