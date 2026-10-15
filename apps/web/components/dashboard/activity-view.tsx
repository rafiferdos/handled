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
        description="Durable activity must come from the backend. The current preview does not create or display real audit records."
      />
      <EmptyState
        title="No connected activity yet."
        description="When the action and audit API is connected, workspace-scoped outcomes will appear here. Local decision rehearsals are never presented as durable events."
      />
      <section className="mt-10">
        <p className="eyebrow mb-5 text-[11px] leading-relaxed text-muted-foreground">
          Illustrative event sequence / Not executed
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: FileSearch,
              title: "Context gathered",
              text: "Recorded read-only tool outcomes and source references.",
            },
            {
              icon: ShieldCheck,
              title: "Human decision recorded",
              text: "An authenticated actor and immutable proposal version.",
            },
            {
              icon: CircleCheck,
              title: "Action outcome verified",
              text: "A durable, idempotent simulated result with an audit reference.",
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
                <span className="font-mono text-[11px] text-muted-foreground">
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
