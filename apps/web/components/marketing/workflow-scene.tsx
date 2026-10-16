"use client"

import type { RefObject } from "react"
import { useScroll, useSpring, useTransform } from "motion/react"
import { WorkflowArtwork } from "./workflow-artwork"

export default function WorkflowScene({
  target,
}: {
  target: RefObject<HTMLDivElement | null>
}) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 25%", "end 80%"],
  })
  const p = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 38,
    mass: 0.25,
    restDelta: 0.001,
  })
  const ticketX = useTransform(p, [0, 0.22, 0.45, 1], [0, -22, -48, -48])
  const ticketY = useTransform(p, [0, 0.18, 0.4, 1], [22, 0, -142, -160])
  const ticketRotate = useTransform(p, [0, 0.18, 0.4], [-3, -2, -9])
  const ticketScale = useTransform(p, [0, 0.18, 0.4], [0.96, 1, 0.84])
  const ticketOpacity = useTransform(p, [0, 0.18, 0.29, 0.42], [1, 1, 0.15, 0])
  const recordsX = useTransform(p, [0, 0.17, 0.32, 0.58], [88, 88, 0, 16])
  const recordsY = useTransform(p, [0, 0.17, 0.32, 0.58], [36, 36, 0, -40])
  const recordsRotate = useTransform(p, [0, 0.17, 0.32, 0.58], [7, 7, 2, 0])
  const evidenceOpacity = useTransform(
    p,
    [0, 0.18, 0.3, 0.43, 0.57],
    [0, 0, 1, 1, 0]
  )
  const knowledgeX = useTransform(p, [0, 0.2, 0.34, 0.58], [-88, -88, 0, -14])
  const knowledgeY = useTransform(p, [0, 0.2, 0.34, 0.58], [36, 36, 0, -28])
  const knowledgeRotate = useTransform(p, [0, 0.2, 0.34, 0.58], [-7, -7, -2, 0])
  const decisionY = useTransform(
    p,
    [0, 0.4, 0.55, 0.71, 0.85],
    [95, 95, 0, 0, -58]
  )
  const decisionScale = useTransform(
    p,
    [0, 0.4, 0.55, 0.85],
    [0.9, 0.9, 1, 0.94]
  )
  const decisionOpacity = useTransform(
    p,
    [0, 0.42, 0.53, 0.71, 0.83, 1],
    [0, 0, 1, 1, 0, 0]
  )
  const receiptY = useTransform(p, [0, 0.74, 0.92, 1], [118, 118, 0, 0])
  const receiptRotate = useTransform(p, [0, 0.74, 0.92], [5, 5, 0])
  const receiptOpacity = useTransform(p, [0, 0.75, 0.88, 1], [0, 0, 1, 1])
  const questionPhase = useTransform(p, [0, 0.2, 0.24], [1, 1, 0])
  const contextPhase = useTransform(p, [0.24, 0.28, 0.44, 0.48], [0, 1, 1, 0])
  const decisionPhase = useTransform(p, [0.48, 0.53, 0.73, 0.77], [0, 1, 1, 0])
  const outcomePhase = useTransform(p, [0.77, 0.86, 1], [0, 1, 1])
  return (
    <WorkflowArtwork
      progress={{ scaleX: p }}
      phases={[
        { opacity: questionPhase },
        { opacity: contextPhase },
        { opacity: decisionPhase },
        { opacity: outcomePhase },
      ]}
      layers={{
        ticket: {
          x: ticketX,
          y: ticketY,
          rotate: ticketRotate,
          scale: ticketScale,
          opacity: ticketOpacity,
        },
        records: {
          x: recordsX,
          y: recordsY,
          rotate: recordsRotate,
          opacity: evidenceOpacity,
        },
        knowledge: {
          x: knowledgeX,
          y: knowledgeY,
          rotate: knowledgeRotate,
          opacity: evidenceOpacity,
        },
        decision: {
          y: decisionY,
          scale: decisionScale,
          opacity: decisionOpacity,
        },
        receipt: {
          y: receiptY,
          rotate: receiptRotate,
          opacity: receiptOpacity,
        },
      }}
    />
  )
}
