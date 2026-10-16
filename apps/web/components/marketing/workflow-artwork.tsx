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
  phases,
}: {
  layers?: WorkflowLayerStyles
  progress?: MotionStyle
  phases?: MotionStyle[]
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
        <span>QUESTION TO RESOLUTION</span>
      </div>
      <div className="workflow-scene-phases">
        {[
          "01 / A QUESTION, HEARD.",
          "02 / THE PIECES, CONNECTED.",
          "03 / A MOMENT FOR JUDGMENT.",
          "04 / THE WHOLE STORY, KEPT.",
        ].map((phase, index) => (
          <m.span
            initial={false}
            style={phases?.[index]}
            className="workflow-scene-phase"
            key={phase}
          >
            <i /> {phase}
          </m.span>
        ))}
      </div>
      <svg
        className="workflow-scene-connections"
        viewBox="0 0 500 500"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M410 130H310Q290 130 290 150V325Q290 345 270 345H90" />
        <circle cx="410" cy="130" r="3" />
        <circle cx="90" cy="345" r="3" />
      </svg>
      <m.div
        initial={false}
        style={layers.ticket}
        className="workflow-layer workflow-ticket glass-inset"
        data-workflow-layer="ticket"
      >
        <p className="workflow-art-label">
          <MessageSquare className="size-3.5" /> THE QUESTION <span>01</span>
        </p>
        <p className="workflow-ticket-question">
          “I was charged twice
          <br />
          for my Pro plan.”
        </p>
        <p className="workflow-ticket-person">
          <span>MR</span>
          Maya Rahman · Customer conversation
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
        <div className="workflow-payment-records">
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
        <p className="workflow-record-note">
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
        <p className="workflow-knowledge-title">Duplicate-charge policy</p>
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          KB-REFUND · version 1
        </p>
        <span className="workflow-source-status">
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
        <p className="workflow-decision-title">
          A recommendation.
          <br />
          <span className="text-signal">Still your decision.</span>
        </p>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Review a $29.00 duplicate refund.
          <br />
          Evidence attached. Human judgment required.
        </p>
        <div className="workflow-decision-options">
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
        <span className="workflow-receipt-mark">
          <Check className="size-5" />
        </span>
        <p className="workflow-receipt-label">THE CONNECTED RECORD / 04</p>
        <p className="workflow-receipt-title">
          Clarity, all the
          <br />
          way through.
        </p>
        <div className="workflow-receipt-record">
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
        <p className="workflow-receipt-note">
          Evidence, decision and outcome. Together.
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
