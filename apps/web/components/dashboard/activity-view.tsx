"use client"

import { ArrowRight, CircleCheck, FileSearch, ShieldCheck } from "lucide-react"
import { PageHeading } from "./page-heading"
import { EmptyState } from "./data-state"
import { useWorkspace } from "./workspace-provider"

export function ActivityView() {
  const { workspace } = useWorkspace()
  return (
    <>
      <PageHeading
        eyebrow={`${workspace.name} / Activity`}
        title="A record of what really happened."
        description="Explore how evidence, decisions and outcomes fit into one activity record."
      />
      <EmptyState
        title="No connected activity yet."
        description="Completed actions and their results will appear here when account connections are available. Decisions you try in this preview stay on the page and do not create activity records."
      />
      <section className="mt-10">
        <p className="eyebrow mb-5 text-xs leading-relaxed text-muted-foreground">
          Example sequence · No actions executed
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: FileSearch,
              title: "Context gathered",
              text: "See the account records and policy used to review the case.",
            },
            {
              icon: ShieldCheck,
              title: "Human decision recorded",
              text: "See who reviewed the recommendation and what they decided.",
            },
            {
              icon: CircleCheck,
              title: "Action outcome verified",
              text: "Check whether the action completed and what changed in the account.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="workspace-panel relative rounded-2xl border p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl border border-signal/15 bg-signal-surface">
                  <item.icon className="size-4 text-signal" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h2 className="font-heading text-lg font-medium tracking-tight">
                {item.title}
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {item.text}
              </p>
              {i < 2 && (
                <ArrowRight className="absolute top-1/2 -right-4 z-10 hidden size-4 text-muted-foreground md:block" />
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
