"use client"

import * as m from "motion/react-m"
import { useReducedMotion } from "motion/react"

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  return (
    <m.div
      className={className}
      initial={false}
      whileInView={reduced ? undefined : { y: [16, 0], opacity: [0.55, 1] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ delay, duration: 0.55 }}
    >
      {children}
    </m.div>
  )
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  return (
    <m.div
      initial={false}
      animate={reduced ? undefined : { y: [6, 0], opacity: [0.7, 1] }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </m.div>
  )
}
