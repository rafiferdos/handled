"use client"

import { useRef } from "react"
import { useScroll, useTransform, type MotionValue } from "motion/react"
import * as m from "motion/react-m"
import {
  useEnhancedMotion,
  useMotionAllowed,
} from "@/hooks/use-enhanced-motion"
import { cn } from "@/lib/utils"

type HeadingLine = { text: string; className?: string }
type WordEntrance = { index: number; desktop: boolean; delay: number }

const headings = { h1: m.h1, h2: m.h2, h3: m.h3 }
const wordVariants = {
  still: {
    y: 0,
    rotateX: 0,
    opacity: 1,
    transition: { duration: 0, delay: 0 },
  },
  revealed: ({ index, desktop, delay }: WordEntrance) => ({
    y: [desktop ? 64 : 30, 0],
    rotateX: [desktop ? 18 : 8, 0],
    opacity: [0.15, 1],
    transition: {
      duration: desktop ? 0.85 : 0.6,
      delay: delay + Math.min(index * (desktop ? 0.045 : 0.025), 0.32),
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

function HeadingWord({
  word,
  index,
  count,
  progress,
  highlight,
  desktop,
  delay,
}: {
  word: string
  index: number
  count: number
  progress: MotionValue<number>
  highlight: boolean
  desktop: boolean
  delay: number
}) {
  const start = (index / Math.max(count, 1)) * 0.72
  const opacity = useTransform(progress, [start, start + 0.24], [0.3, 1])

  return (
    <span className="scroll-word-mask">
      <m.span
        className="scroll-word"
        custom={{ index, desktop, delay }}
        variants={wordVariants}
      >
        <m.span style={{ opacity: highlight ? opacity : 1 }}>{word}</m.span>
      </m.span>
    </span>
  )
}

/** The complete heading is server-visible; motion only decorates its visual copy. */
export function ScrollHeading({
  as = "h2",
  text,
  className,
  mode = "reveal",
  delay = 0,
}: {
  as?: keyof typeof headings
  text: string | readonly HeadingLine[]
  className?: string
  mode?: "reveal" | "highlight"
  delay?: number
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const allowed = useMotionAllowed()
  const desktop = useEnhancedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.94", "end 0.4"],
  })
  const lines = typeof text === "string" ? [{ text }] : text
  const label = lines.map((line) => line.text).join(" ")
  const count = label.trim().split(/\s+/).length
  const Heading = headings[as]
  let wordIndex = 0

  return (
    <Heading
      ref={ref}
      className={cn("scroll-heading", className)}
      initial={false}
      animate={allowed ? undefined : "still"}
      whileInView={allowed ? "revealed" : undefined}
      viewport={{ once: true, amount: 0.35, margin: "0px 0px -5% 0px" }}
      data-scroll-heading={mode}
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="scroll-heading-visual">
        {lines.map((line, lineIndex) => (
          <span
            key={`${lineIndex}-${line.text}`}
            className={cn(
              typeof text !== "string" && "scroll-heading-line",
              line.className
            )}
          >
            {line.text
              .trim()
              .split(/\s+/)
              .map((word, index, words) => {
                const position = wordIndex++
                return (
                  <span key={`${position}-${word}`}>
                    <HeadingWord
                      word={word}
                      index={position}
                      count={count}
                      progress={scrollYProgress}
                      highlight={allowed && desktop && mode === "highlight"}
                      desktop={desktop}
                      delay={Math.min(Math.max(delay, 0), 0.3)}
                    />
                    {index < words.length - 1 ? " " : null}
                  </span>
                )
              })}
          </span>
        ))}
      </span>
    </Heading>
  )
}
