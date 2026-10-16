"use client"

import { useRef } from "react"
import { useScroll, useTransform } from "motion/react"
import * as m from "motion/react-m"

export default function GlassFoldEffect({
  children,
}: {
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 12%"],
  })
  const rotateX = useTransform(scrollYProgress, [0, 1], [16, 0])
  const y = useTransform(scrollYProgress, [0, 1], [72, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  return (
    <div ref={ref} style={{ perspective: 1400 }}>
      <m.div style={{ rotateX, y, scale, transformOrigin: "center bottom" }}>
        {children}
      </m.div>
    </div>
  )
}
