"use client"

import * as m from "motion/react-m"
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion"

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const enhanced = useEnhancedMotion()
  return (
    <m.div
      className={className}
      initial={false}
      whileInView={!enhanced ? undefined : { y: [16, 0], opacity: [0.55, 1] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ delay, duration: 0.55 }}
    >
      {children}
    </m.div>
  )
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const enhanced = useEnhancedMotion()
  return (
    <m.div
      initial={false}
      animate={!enhanced ? undefined : { y: [6, 0], opacity: [0.7, 1] }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </m.div>
  )
}
