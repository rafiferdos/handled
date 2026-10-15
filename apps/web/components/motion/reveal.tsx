"use client"

import * as m from "motion/react-m"
import { useEnhancedMotion } from "@/hooks/use-enhanced-motion"

const entrances = {
  rise: { y: [14, 0], opacity: [0.65, 1] },
  panel: { y: [24, 0], scale: [0.98, 1], opacity: [0.75, 1] },
  left: { x: [-20, 0], opacity: [0.65, 1] },
  right: { x: [20, 0], opacity: [0.65, 1] },
  scale: { scale: [0.96, 1], opacity: [0.75, 1] },
}

export function Reveal({
  children,
  className,
  delay = 0,
  preset = "rise",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  preset?: keyof typeof entrances
}) {
  const enhanced = useEnhancedMotion()
  return (
    <m.div
      className={className}
      initial={false}
      animate={!enhanced ? { x: 0, y: 0, scale: 1, opacity: 1 } : undefined}
      whileInView={!enhanced ? undefined : entrances[preset]}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        delay: Math.min(Math.max(delay, 0), 0.18),
        duration: !enhanced ? 0 : preset === "panel" ? 0.65 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
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
      animate={!enhanced ? { y: 0, opacity: 1 } : { y: [6, 0], opacity: [0.7, 1] }}
      transition={{ duration: enhanced ? 0.25 : 0 }}
    >
      {children}
    </m.div>
  )
}
