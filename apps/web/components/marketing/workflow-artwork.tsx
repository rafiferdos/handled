"use client"

import {
  ArrowUpRight,
  BookOpen,
  Check,
  Fingerprint,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import * as m from "motion/react-m"
import type { MotionStyle } from "motion/react"
import { BrandMark } from "@/components/shared/brand"

type Layer = "ticket" | "records" | "knowledge" | "decision" | "receipt"
export type WorkflowLayerStyles = Partial<Record<Layer, MotionStyle>>

export function WorkflowArtwork({
  layers = {},
  progress,
}: {
  layers?: WorkflowLayerStyles
  progress?: MotionStyle
}) {
  return (
    <div
      className="workflow-scene glass-panel"
      data-workflow-scene
      data-scene-static={Object.keys(layers).length === 0 ? "true" : undefined}
    >
      <div className="workflow-scene-grid" />
      <div className="workflow-scene-orbit">
        <BrandMark className="size-20" />
      </div>
      <div className="workflow-scene-caption">
        <span>THE SUPPORT LOOP</span>
        <span>ILLUSTRATIVE / NOT A LIVE ACTION</span>
      </div>
      <m.div
        initial={false}
        style={layers.ticket}
        className="workflow-layer workflow-ticket glass-inset"
        data-workflow-layer="ticket"
      >
        <p className="workflow-art-label">
          <MessageSquare className="size-3.5" /> THE QUESTION <span>01</span>
        </p>
        <p className="mt-6 font-heading text-[2rem] leading-[1.1] tracking-[-0.04em]">
          “I was charged twice
          <br />
          for my Pro plan.”
        </p>
        <p className="mt-5 text-xs text-muted-foreground">
          Maya Rahman · Sample conversation
        </p>
      </m.div>
      <m.div
        initial={false}
        style={layers.records}
        className="workflow-layer workflow-records glass-inset"
        data-workflow-layer="records"
      >
        <p className="workflow-art-label">
          <Fingerprint className="size-3.5" /> ACCOUNT CONTEXT
        </p>
        <div className="mt-5 space-y-3 font-mono text-[11px]">
          <p className="flex justify-between">
            PAY-9001{" "}
            <span>
              $29.00 <Check className="ml-1 inline size-3 text-signal" />
            </span>
          </p>
          <p className="flex justify-between">
            PAY-9002{" "}
            <span>
              $29.00 <Check className="ml-1 inline size-3 text-signal" />
            </span>
          </p>
        </div>
        <p className="mt-4 border-t pt-3 text-[10px] text-muted-foreground">
          Two settled payments. One billing period.
        </p>
      </m.div>
      <m.div
        initial={false}
        style={layers.knowledge}
        className="workflow-layer workflow-knowledge glass-inset"
        data-workflow-layer="knowledge"
      >
        <p className="workflow-art-label">
          <BookOpen className="size-3.5" /> PUBLISHED KNOWLEDGE
        </p>
        <p className="mt-4 text-sm font-medium">Duplicate-charge policy</p>
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          KB-REFUND · version 1
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-signal/20 px-2 py-1 text-[9px] text-signal">
          <Check className="size-3" /> Source attached
        </span>
      </m.div>
      <m.div
        initial={false}
        style={layers.decision}
        className="workflow-layer workflow-decision glass-panel"
        data-workflow-layer="decision"
      >
        <p className="workflow-art-label">
          <ShieldCheck className="size-3.5" /> THE HUMAN CHECKPOINT{" "}
          <span>03</span>
        </p>
        <p className="mt-6 font-heading text-[2.1rem] leading-[1.05] tracking-[-0.04em]">
          A recommendation.
          <br />
          <span className="text-signal">Still your decision.</span>
        </p>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Review a sample $29.00 duplicate refund.
          <br />
          Evidence attached. Human judgment required.
        </p>
        <div className="mt-6 flex gap-2 text-[10px]">
          <span className="rounded-lg bg-signal px-4 py-2.5 text-signal-foreground">
            Review
          </span>
          <span className="glass-inset rounded-lg px-4 py-2.5">Edit reply</span>
          <span className="glass-inset rounded-lg px-4 py-2.5">Escalate</span>
        </div>
      </m.div>
      <m.div
        initial={false}
        style={layers.receipt}
        className="workflow-layer workflow-receipt"
        data-workflow-layer="receipt"
      >
        <span className="mb-7 flex size-12 items-center justify-center rounded-full border border-current/15">
          <Check className="size-5" />
        </span>
        <p className="font-mono text-[9px] tracking-[0.12em]">
          THE CONNECTED RECORD / 04
        </p>
        <p className="mt-4 font-heading text-[2.35rem] leading-none tracking-[-0.05em]">
          Clarity, all the
          <br />
          way through.
        </p>
        <div className="mt-7 space-y-3 border-t border-current/15 pt-5 text-xs">
          <p>
            Evidence reviewed <Check className="float-right size-3.5" />
          </p>
          <p>
            Human decision explained <Check className="float-right size-3.5" />
          </p>
          <p>
            Next step traceable{" "}
            <ArrowUpRight className="float-right size-3.5" />
          </p>
        </div>
        <p className="mt-6 text-[9px] opacity-70">
          Illustrative outcome. No real account action.
        </p>
      </m.div>
      <div className="workflow-scene-progress">
        <m.span style={progress} />
      </div>
      <p className="workflow-scene-footnote">
        QUESTION <span>→</span> CONTEXT <span>→</span> YOUR CALL
      </p>
    </div>
  )
}
