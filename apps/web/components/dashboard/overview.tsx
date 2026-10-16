"use client"

import Link from "next/link"
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCheck,
  CircleHelp,
  Clock3,
  Inbox,
  ShieldCheck,
} from "lucide-react"
import { useWorkspace } from "./workspace-provider"
import { PageHeading } from "./page-heading"
import { EmptyState, ErrorState, LoadingState } from "./data-state"
import { ButtonLink } from "@/components/shared/button-link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTickets } from "@/features/tickets/use-tickets"
import { StatusBadge } from "@/features/tickets/ticket-status"

export function Overview() {
  const { workspace } = useWorkspace()
  const tickets = useTickets()
  const data = tickets.data?.data ?? []
  const nextReview = data.find(
    (ticket) => ticket.status === "AWAITING_APPROVAL"
  )
  const stats = [
    {
      label: "Tickets",
      value: data.length,
      icon: Inbox,
      note: data.length
        ? "Three support scenarios"
        : "No records in this workspace",
      tone: "border-border",
      iconTone: "border-border bg-muted/35 text-muted-foreground",
    },
    {
      label: "Ready for review",
      value: data.filter((ticket) => ticket.status === "AWAITING_APPROVAL")
        .length,
      icon: Clock3,
      note: "A human decision comes next",
      tone: "border-success/20",
      iconTone: "border-success/20 bg-success-surface/60 text-success",
    },
    {
      label: "Needs a closer look",
      value: data.filter((ticket) => ticket.status === "NEEDS_REVIEW").length,
      icon: CircleHelp,
      note: "Incomplete evidence stays in review",
      tone: "border-warning/20",
      iconTone: "border-warning/20 bg-warning-surface/60 text-warning",
    },
  ]
  return (
    <>
      <PageHeading
        eyebrow={`${workspace.name} / Overview`}
        title="A clear view of what’s next."
        description="See which conversations need review and choose the next case."
      >
        <ButtonLink
          href="/tickets"
          className="signal-button h-11 rounded-xl px-5 text-[13px]"
        >
          Open ticket inbox <ArrowUpRight className="ml-3 size-3.5" />
        </ButtonLink>
      </PageHeading>
      {tickets.isPending ? (
        <LoadingState />
      ) : tickets.isError ? (
        <ErrorState retry={() => void tickets.refetch()} />
      ) : (
        <>
          <section
            aria-label="Workspace summary"
            className="workspace-metrics grid gap-2 sm:grid-cols-3 sm:gap-3"
          >
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className={`workspace-metric-card workspace-panel relative rounded-2xl border ring-0 ${stat.tone}`}
              >
                <CardHeader className="workspace-metric-header flex flex-row items-center justify-between pb-0">
                  <CardTitle className="workspace-metric-label text-[13px] font-normal text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <span
                    className={`workspace-metric-icon flex size-9 items-center justify-center rounded-xl border ${stat.iconTone}`}
                  >
                    <stat.icon className="size-3.5" />
                  </span>
                </CardHeader>
                <CardContent className="workspace-metric-content">
                  <p className="workspace-metric-value font-heading text-[2.75rem] leading-none font-medium tracking-[-0.045em] tabular-nums">
                    {stat.value}
                  </p>
                  <p className="workspace-metric-note mt-2 text-xs leading-relaxed text-muted-foreground">
                    {stat.note}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
            <section className="workspace-panel min-w-0 overflow-hidden rounded-2xl border">
              <div className="flex items-center justify-between gap-4 border-b px-5 py-5 md:px-6">
                <div>
                  <h2 className="font-heading text-xl font-medium tracking-tight">
                    The next conversation
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Conversations that need attention
                  </p>
                </div>
                <Link
                  href="/tickets"
                  className="flex min-h-11 shrink-0 items-center gap-1 rounded-md px-1 text-[13px] text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  View all
                  <ArrowRight className="size-3" />
                </Link>
              </div>
              {data.length ? (
                data.map((ticket) => (
                  <Link
                    href={`/tickets/${ticket.id}`}
                    key={ticket.id}
                    className="workspace-row group flex flex-wrap items-center gap-3 border-b px-5 py-5 last:border-0 focus-visible:outline-2 focus-visible:-outline-offset-2 md:px-6"
                  >
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-muted text-xs">
                        {ticket.customer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {ticket.reference} · {ticket.customer.name}
                      </p>
                      <h3 className="mt-1.5 text-sm leading-relaxed font-medium">
                        {ticket.subject}
                      </h3>
                    </div>
                    <div className="ml-12 flex w-full items-center justify-between gap-2 sm:ml-0 sm:w-auto">
                      <StatusBadge status={ticket.status} />
                      <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-5">
                  <EmptyState
                    title="This workspace is a clean slate."
                    description="PixelDesk has no records. Each workspace keeps its own queue."
                  />
                </div>
              )}
            </section>
            <aside className="flex flex-col gap-5">
              <Card className="workspace-panel border-signal/20 bg-signal-surface/40">
                <CardHeader>
                  <Badge
                    variant="outline"
                    className="mb-3 w-fit border-signal/20 bg-signal-surface text-xs text-signal"
                  >
                    <ShieldCheck className="mr-1 size-3" />A deliberate pause
                  </Badge>
                  <CardTitle className="font-heading text-2xl leading-tight font-medium tracking-tight">
                    Good judgment
                    <br />
                    is part of the workflow.
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    Review the source, check the recommendation, and make the
                    decision.
                  </p>
                  {nextReview && (
                    <ButtonLink
                      href={`/tickets/${nextReview.id}`}
                      className="signal-button mt-5 h-11 w-full justify-between rounded-xl px-4 text-[13px]"
                    >
                      Review next case
                      <ArrowUpRight className="size-3.5" />
                    </ButtonLink>
                  )}
                  <ButtonLink
                    variant="outline"
                    href="/how-it-works"
                    className="mt-4 h-11 rounded-xl border-signal/20 bg-transparent text-[13px]"
                  >
                    Explore the process
                    <ArrowUpRight className="ml-3 size-3" />
                  </ButtonLink>
                </CardContent>
              </Card>
              <div className="workspace-panel rounded-2xl border p-5">
                <div className="flex items-center gap-2 text-[13px] font-medium">
                  <BookOpen className="size-4 text-signal" />
                  Start with the source
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  The knowledge library holds three policies for the support
                  cases.
                </p>
                <Link
                  href="/knowledge"
                  className="mt-3 flex min-h-11 items-center gap-2 text-[13px] font-medium"
                >
                  Browse knowledge
                  <ArrowDownRight className="size-3" />
                </Link>
              </div>
              <p className="flex items-start gap-2 px-2 text-xs leading-relaxed text-muted-foreground">
                <CheckCheck className="mt-0.5 size-3 shrink-0" />
                Counts reflect the records in this workspace.
              </p>
            </aside>
          </div>
        </>
      )}
    </>
  )
}
