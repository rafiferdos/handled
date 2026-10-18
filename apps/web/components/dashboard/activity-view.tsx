"use client"

import { ArrowRight, CircleCheck, FileSearch, ShieldCheck } from "lucide-react"
import { PageHeading } from "./page-heading"
import { EmptyState } from "./data-state"
import { useWorkspace } from "./workspace-provider"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useBusinessApi } from "@/features/tickets/use-tickets"
import { humanize } from "@/features/tickets/ticket-status"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ErrorState, LoadingState } from "./data-state"

export function ActivityView() {
  const { mode } = useWorkspace()
  return mode === "live" ? <LiveActivityView /> : <SampleActivityView />
}

function LiveActivityView() {
  const [page, setPage] = useState(1)
  const { workspace, profile } = useWorkspace()
  const business = useBusinessApi()
  const allowed = workspace.role === "ADMIN"
  const activity = useQuery({
    queryKey: ["live", workspace.id, "audit", page],
    queryFn: () => business!.audit(undefined, page),
    enabled: !!business && allowed,
  })
  const date = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: profile.timeZone,
  })
  return (
    <>
      <PageHeading
        eyebrow={`${workspace.name} / Activity`}
        title="A record of what really happened."
        description="Review persisted workspace events, human decisions and action outcomes."
      />
      {!allowed ? (
        <EmptyState
          title="Administrator access required."
          description="Workspace activity is available to administrators. Individual case timelines remain available from the ticket inbox."
        />
      ) : !business ? (
        <ErrorState
          title="The workspace connection is unavailable."
          retry={() => window.location.reload()}
        />
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {activity.data
                ? `${activity.data.meta.total} recorded events`
                : "Loading activity…"}
            </p>
            <Button
              variant="outline"
              disabled={activity.isFetching}
              onClick={() => void activity.refetch()}
            >
              Refresh activity
            </Button>
          </div>
          {activity.isPending ? (
            <LoadingState />
          ) : activity.isError ? (
            <ErrorState
              title={activity.error.message}
              retry={() => void activity.refetch()}
            />
          ) : !activity.data.data.length ? (
            <EmptyState
              title="No activity recorded yet."
              description="Saved customer verification, policy changes, decisions and actions will appear here."
            />
          ) : (
            <section
              aria-label="Workspace activity"
              className="divide-y rounded-2xl border"
            >
              {activity.data.data.map((event) => (
                <article key={event.id} className="p-5 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-sm font-medium">
                      {humanize(event.eventType.replaceAll(".", "_"))}
                    </h2>
                    <time
                      dateTime={event.createdAt}
                      className="text-xs text-muted-foreground"
                    >
                      {date.format(new Date(event.createdAt))}
                    </time>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{humanize(event.actorType)}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {humanize(event.entityType)}
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-xs break-all text-muted-foreground">
                    Record {event.entityId}
                  </p>
                  {event.actorId && (
                    <p className="mt-2 font-mono text-xs break-all text-muted-foreground">
                      Actor {event.actorId}
                    </p>
                  )}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-xs text-muted-foreground">
                      Recorded details
                    </summary>
                    <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-muted p-3 text-xs">
                      {JSON.stringify(event.metadata, null, 2)}
                    </pre>
                    <p className="mt-2 font-mono text-xs break-all text-muted-foreground">
                      Request {event.requestId}
                    </p>
                  </details>
                </article>
              ))}
            </section>
          )}
          {activity.data && (page > 1 || activity.data.meta.hasNext) && (
            <nav
              aria-label="Activity pages"
              className="mt-5 flex items-center justify-end gap-3"
            >
              <Button
                variant="outline"
                disabled={page === 1 || activity.isFetching}
                onClick={() => setPage((value) => value - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {page}</span>
              <Button
                variant="outline"
                disabled={!activity.data.meta.hasNext || activity.isFetching}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </>
  )
}

function SampleActivityView() {
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
