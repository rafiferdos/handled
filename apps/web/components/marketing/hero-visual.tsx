"use client"

import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Check,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import { usePointerMotion } from "@/hooks/use-enhanced-motion"
import { ApertureArtwork } from "./aperture-artwork"
import StudioMotion from "./liquid-sculpture"

function ContextAperture() {
  return (
    <div className="hero-aperture-composition">
      <div className="hero-aperture-caption">
        <span>
          <i /> A LITTLE CLARITY, CONNECTED.
        </span>
        <span>SAMPLE WORKFLOW</span>
      </div>
      <div className="hero-aperture-field">
        <div className="hero-aperture-atmosphere" />
        <div className="hero-aperture-light" />
        <div className="hero-aperture-horizon" />
        <div className="hero-aperture-object">
          <ApertureArtwork />
        </div>
        <svg
          className="hero-source-paths"
          viewBox="0 0 600 520"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M102 108H172Q196 108 210 132L252 205" />
          <path d="M500 400H439Q417 400 403 377L353 306" />
          <path
            className="hero-source-beam hero-source-beam-first"
            d="M102 108H172Q196 108 210 132L252 205"
            pathLength="1"
          />
          <path
            className="hero-source-beam hero-source-beam-second"
            d="M500 400H439Q417 400 403 377L353 306"
            pathLength="1"
          />
          <circle cx="102" cy="108" r="3" />
          <circle cx="500" cy="400" r="3" />
        </svg>
        <div className="hero-source-station hero-source-conversation">
          <span className="hero-station-icon">
            <MessageSquare />
          </span>
          <div>
            <p>01 / THE CONVERSATION</p>
            <strong>“I was charged twice.”</strong>
          </div>
        </div>
        <div className="hero-source-station hero-source-knowledge">
          <span className="hero-station-icon">
            <BookOpen />
          </span>
          <div>
            <p>02 / PUBLISHED KNOWLEDGE</p>
            <strong>Duplicate-charge policy</strong>
            <span className="hero-station-reference">
              <Check /> Source connected
            </span>
          </div>
        </div>
        <div className="hero-lens-label">
          <span>CONTEXT</span>
          <span>CONNECTED</span>
        </div>
        <div className="hero-aperture-coordinate">H / 01</div>
      </div>
      <div className="hero-review-strip glass-surface glass-smoked">
        <span className="hero-review-avatar">
          <ShieldCheck />
        </span>
        <div className="hero-review-copy">
          <span className="hero-review-eyebrow">
            THE INTELLIGENCE IS ASSISTED.
          </span>
          <strong>The decision is yours.</strong>
          <span className="hero-review-detail">
            Two sources. One clearer next step.
          </span>
        </div>
        <ArrowUpRight className="hero-review-arrow" />
      </div>
      <div className="hero-aperture-footnote">
        <span>EVIDENCE IN.</span>
        <ArrowDown />
        <span>HUMAN JUDGMENT OUT.</span>
      </div>
    </div>
  )
}

export function HeroVisual() {
  const enhanced = usePointerMotion()
  return (
    <div
      className="hero-visual hero-stage hero-aperture relative mx-auto w-full max-w-[640px]"
      aria-hidden="true"
    >
      <StudioMotion enabled={enhanced}>
        <ContextAperture />
      </StudioMotion>
    </div>
  )
}
