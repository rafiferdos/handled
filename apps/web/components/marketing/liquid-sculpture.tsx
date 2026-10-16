"use client"

import { useEffect, useRef } from "react"
import { useInView, usePageInView, useSpring } from "motion/react"
import * as m from "motion/react-m"

export default function LiquidSculpture({
  children,
  enabled,
}: {
  children: React.ReactNode
  enabled: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "80px" })
  const pageVisible = usePageInView()
  const active = enabled && inView && pageVisible
  const rotateX = useSpring(0, { stiffness: 90, damping: 22 })
  const rotateY = useSpring(0, { stiffness: 90, damping: 22 })
  useEffect(() => {
    if (!active) {
      rotateX.jump(0)
      rotateY.jump(0)
    }
  }, [active, rotateX, rotateY])
  return (
    <div
      ref={ref}
      className={`h-full w-full ${active ? "liquid-active" : ""}`}
      style={enabled ? { perspective: 1000 } : undefined}
      data-liquid-interactive={enabled ? "" : undefined}
      onPointerMove={
        enabled
          ? (event) => {
              if (event.pointerType !== "mouse" || !active) return
              const bounds = event.currentTarget.getBoundingClientRect()
              rotateX.set(
                ((event.clientY - bounds.top) / bounds.height - 0.5) * -5
              )
              rotateY.set(
                ((event.clientX - bounds.left) / bounds.width - 0.5) * 6
              )
            }
          : undefined
      }
      onPointerLeave={
        enabled
          ? () => {
              rotateX.set(0)
              rotateY.set(0)
            }
          : undefined
      }
    >
      <m.div
        className="h-full w-full"
        style={enabled ? { rotateX, rotateY } : undefined}
      >
        {children}
      </m.div>
    </div>
  )
}
