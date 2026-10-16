"use client"

import type { RefObject } from "react"
import { useScroll, useTransform } from "motion/react"
import { WorkflowArtwork } from "./workflow-artwork"

export default function WorkflowScene({
  target,
}: {
  target: RefObject<HTMLDivElement | null>
}) {
  const { scrollYProgress: p } = useScroll({
    target,
    offset: ["start 25%", "end 80%"],
  })
  const ticketX = useTransform(p, [0, 0.28, 1], [0, -42, -48])
  const ticketY = useTransform(p, [0, 0.28, 0.6, 1], [40, -110, -150, -170])
  const ticketRotate = useTransform(p, [0, 0.3, 1], [-4, -9, -9])
  const ticketScale = useTransform(p, [0, 0.4, 1], [1, 0.9, 0.86])
  const ticketOpacity = useTransform(p, [0, 0.45, 1], [1, 0.8, 0.45])
  const recordsX = useTransform(p, [0, 0.3, 1], [100, 0, 12])
  const recordsY = useTransform(p, [0, 0.3, 1], [80, 0, -60])
  const recordsRotate = useTransform(p, [0, 0.3, 1], [12, 3, -3])
  const evidenceOpacity = useTransform(
    p,
    [0, 0.1, 0.25, 0.58, 0.85],
    [0, 0, 1, 1, 0.35]
  )
  const knowledgeX = useTransform(p, [0, 0.36, 1], [-100, 0, -15])
  const knowledgeY = useTransform(p, [0, 0.36, 1], [80, 0, -90])
  const knowledgeRotate = useTransform(p, [0, 0.36, 1], [-10, -3, -6])
  const decisionY = useTransform(
    p,
    [0, 0.3, 0.52, 0.72, 1],
    [150, 150, 0, 0, -60]
  )
  const decisionScale = useTransform(p, [0, 0.3, 0.52, 1], [0.9, 0.9, 1, 0.94])
  const decisionOpacity = useTransform(
    p,
    [0, 0.32, 0.47, 0.72, 0.85, 1],
    [0, 0, 1, 1, 0, 0]
  )
  const receiptY = useTransform(p, [0, 0.7, 0.94, 1], [180, 180, 0, 0])
  const receiptRotate = useTransform(p, [0, 0.7, 0.94], [6, 6, 0])
  const receiptOpacity = useTransform(p, [0, 0.71, 0.86, 1], [0, 0, 1, 1])
  return (
    <WorkflowArtwork
      progress={{ scaleX: p }}
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
