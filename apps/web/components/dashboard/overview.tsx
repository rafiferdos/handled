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
      label: "Sample tickets",
      value: data.length,
      icon: Inbox,
      note: data.length
        ? "Three canonical support scenarios"
        : "No sample records in this workspace",
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
        description="A little context for your day. Explore how evidence and human decisions fit together in this sample workspace."
      >
        <ButtonLink href="/tickets" className="h-10 rounded-full px-5 text-xs">
          Open ticket inbox <ArrowUpRight className="ml-3 size-3.5" />
        </ButtonLink>
      </PageHeading>
      {tickets.isPending ? (
        <LoadingState />
      ) : tickets.isError ? (
        <ErrorState retry={() => void tickets.refetch()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className={`relative rounded-2xl border shadow-none ring-0 ${stat.tone}`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-xs font-normal text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <span
                    className={`flex size-8 items-center justify-center rounded-xl border ${stat.iconTone}`}
                  >
                    <stat.icon className="size-3.5" />
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="font-heading text-4xl font-medium tracking-tight tabular-nums">
                    {stat.value}
                    <span className="ml-2 font-mono text-[10px] font-normal tracking-normal text-muted-foreground">
                      SAMPLE
                    </span>
                  </p>
                  <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                    {stat.note}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
            <section className="min-w-0 rounded-2xl border">
              <div className="flex items-center justify-between border-b px-5 py-5">
                <div>
                  <h2 className="font-heading text-lg font-medium tracking-tight">
                    The next conversation
                  </h2>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    A sample of your support queue
                  </p>
                </div>
                <Link
                  href="/tickets"
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
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
                    className="group flex flex-wrap items-center gap-3 border-b px-5 py-5 last:border-0 hover:bg-muted/40 focus-visible:outline-2"
                  >
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-muted text-[10px]">
                        {ticket.customer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[8px] text-muted-foreground">
                        {ticket.reference} · {ticket.customer.name}
                      </p>
                      <h3 className="mt-1.5 text-xs leading-relaxed font-medium">
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
                    description="PixelDesk has no sample records. Switching workspaces does not carry AcmeCloud data across."
                  />
                </div>
              )}
            </section>
            <aside className="flex flex-col gap-5">
              <Card className="border-success/15 bg-success-surface/40 shadow-none">
                <CardHeader>
                  <Badge
                    variant="outline"
                    className="mb-3 w-fit border-success/20 bg-success-surface text-[9px] text-success"
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
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Review the source, check the recommendation, and make the
                    decision. In this preview, every outcome stays local.
                  </p>
                  {nextReview && (
                    <ButtonLink
                      href={`/tickets/${nextReview.id}`}
                      className="mt-5 h-10 w-full justify-between rounded-xl px-4 text-[11px]"
                    >
                      Review next sample
                      <ArrowUpRight className="size-3.5" />
                    </ButtonLink>
                  )}
                  <ButtonLink
                    variant="outline"
                    href="/how-it-works"
                    className="mt-5 h-9 rounded-full border-success/20 bg-transparent text-[11px]"
                  >
                    Explore the process
                    <ArrowUpRight className="ml-3 size-3" />
                  </ButtonLink>
                </CardContent>
              </Card>
              <div className="rounded-2xl border p-5">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <BookOpen className="size-4 text-muted-foreground" />
                  Start with the source
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                  The knowledge library holds three published sample policies
                  for the golden cases.
                </p>
                <Link
                  href="/knowledge"
                  className="mt-4 flex items-center gap-2 text-[11px] font-medium"
                >
                  Browse knowledge
                  <ArrowDownRight className="size-3" />
                </Link>
              </div>
              <p className="flex items-start gap-2 px-2 text-[9px] leading-relaxed text-muted-foreground">
                <CheckCheck className="mt-0.5 size-3 shrink-0" />
                Counts are calculated from sample records. They are not measured
                product outcomes.
              </p>
            </aside>
          </div>
        </>
      )}
    </>
  )
}
