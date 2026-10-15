"use client"

import { useRef } from "react"
import { useInView, useSpring } from "motion/react"
import * as m from "motion/react-m"
import { SculptureArtwork } from "./sculpture-artwork"

export default function LiquidSculpture() {
  const ref = useRef<HTMLDivElement>(null)
  const active = useInView(ref, { margin: "80px" })
  const rotateX = useSpring(0, { stiffness: 90, damping: 22 })
  const rotateY = useSpring(0, { stiffness: 90, damping: 22 })
  return (
    <div
      ref={ref}
      className={`h-full w-full ${active ? "liquid-active" : ""}`}
      style={{ perspective: 1000 }}
      data-liquid-interactive
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !active) return
        const bounds = event.currentTarget.getBoundingClientRect()
        rotateX.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -9)
        rotateY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12)
      }}
      onPointerLeave={() => {
        rotateX.set(0)
        rotateY.set(0)
      }}
    >
      <m.div className="h-full w-full" style={{ rotateX, rotateY }}>
        <SculptureArtwork />
      </m.div>
    </div>
  )
}
