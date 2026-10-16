"use client"

import {
  ArrowUpRight,
  BookOpen,
  Check,
  Layers3,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import { usePointerMotion } from "@/hooks/use-enhanced-motion"
import { BrandMark } from "@/components/shared/brand"
import { SculptureArtwork } from "./sculpture-artwork"
import StudioMotion from "./liquid-sculpture"

function DecisionStudio() {
  return (
    <div className="hero-studio-composition">
      <div className="hero-studio-backdrop" aria-hidden="true">
        <div className="hero-art-panel glass-scene-panel" />
        <div className="hero-studio-halo" />
        <div className="hero-studio-lens" />
        <div className="hero-sculpture-layer">
          <SculptureArtwork />
        </div>
        <svg
          className="hero-studio-links"
          viewBox="0 0 620 660"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M140 150V210Q140 238 170 238H230M150 565V510Q150 480 190 480H245" />
          <circle cx="140" cy="150" r="4" />
          <circle cx="150" cy="565" r="4" />
        </svg>
      </div>
      <div className="hero-studio-caption">
        <span>SUPPORT, BROUGHT TOGETHER.</span>
        <span>01 / 03</span>
      </div>
      <div className="hero-question-sheet hero-source-sheet glass-inset glass-on-ink">
        <div className="hero-source-label">
          <MessageSquare />
          <span>Customer conversation</span>
          <span className="hero-source-number">01</span>
        </div>
        <div className="hero-question-body">
          <span className="hero-customer-avatar">MR</span>
          <p>“I was charged twice.”</p>
        </div>
      </div>
      <div className="hero-human-label glass-surface glass-smoked">
        <span className="hero-human-dot" />
        <span>Human in the loop</span>
        <ArrowUpRight />
      </div>
      <div className="hero-proof-card glass-surface glass-smoked">
        <div className="hero-dossier-header">
          <span className="hero-dossier-brand">
            <BrandMark />
            <span>handled</span>
          </span>
          <span className="hero-sample-label">Sample investigation</span>
        </div>
        <div className="hero-dossier-copy">
          <p className="hero-dossier-eyebrow">
            <Layers3 />
            Context, connected
          </p>
          <h2>
            A clearer
            <br />
            <span>next step.</span>
          </h2>
        </div>
        <div className="hero-dossier-evidence">
          <span>
            <Check />
            Two source references
          </span>
          <span className="hero-dossier-version">v1</span>
        </div>
        <div className="hero-review-bar">
          <span className="hero-review-icon">
            <ShieldCheck />
          </span>
          <span>
            <strong>Ready for your review</strong>
            <small>One thoughtful decision. Yours.</small>
          </span>
          <ArrowUpRight className="hero-review-arrow" />
        </div>
      </div>
      <div className="hero-policy-sheet hero-source-sheet glass-inset glass-on-ink">
        <span className="hero-policy-icon">
          <BookOpen />
        </span>
        <div>
          <p className="hero-source-label">Published knowledge</p>
          <p className="hero-policy-title">Duplicate-charge policy</p>
          <span className="hero-policy-reference">KB-REFUND / version 1</span>
        </div>
        <Check className="hero-policy-check" />
      </div>
      <div className="hero-studio-footnote">
        <span>QUESTION</span>
        <i />
        <span>CONTEXT</span>
        <i />
        <span>YOUR CALL</span>
      </div>
    </div>
  )
}

export function HeroVisual() {
  const enhanced = usePointerMotion()
  return (
    <div
      className="hero-visual hero-stage expressive-hero-stage hero-studio relative mx-auto w-full max-w-[620px]"
      aria-hidden="true"
    >
      <StudioMotion enabled={enhanced}>
        <DecisionStudio />
      </StudioMotion>
    </div>
  )
}
