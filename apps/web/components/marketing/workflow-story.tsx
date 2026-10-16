"use client"

import { lazy, Suspense, useRef } from "react"
import { useInView } from "motion/react"
import { useStoryMotion } from "@/hooks/use-enhanced-motion"
import { WorkflowArtwork } from "./workflow-artwork"

const AnimatedScene = lazy(() => import("./workflow-scene"))

export function WorkflowStory({ children }: { children: React.ReactNode }) {
  const target = useRef<HTMLDivElement>(null)
  const enhanced = useStoryMotion()
  const near = useInView(target, { margin: "400px 0px", once: true })
  return (
    <div
      ref={target}
      className="workflow-story"
      data-story-enhanced={enhanced ? "true" : undefined}
    >
      {children}
      <div className="workflow-scene-shell" aria-hidden="true">
        {enhanced && near ? (
          <Suspense fallback={<WorkflowArtwork />}>
            <AnimatedScene target={target} />
          </Suspense>
        ) : (
          <WorkflowArtwork />
        )}
      </div>
    </div>
  )
}
