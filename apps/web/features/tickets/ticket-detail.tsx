"use client"

import Link from "next/link"
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  FileSearch,
  Link2,
  ShieldCheck,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonLink } from "@/components/shared/button-link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ErrorState, LoadingState } from "@/components/dashboard/data-state"
import { useTicket } from "./use-tickets"
import { StatusBadge, PriorityBadge } from "./ticket-status"
import { ProposalPanel } from "./proposal-panel"
import { useWorkspace } from "@/components/dashboard/workspace-provider"
import { LiveTicketDetail } from "./live-ticket-detail"

export function TicketDetail({ ticketId }: { ticketId: string }) {
  const { mode } = useWorkspace()
  return mode === "live" ? (
    <LiveTicketDetail ticketId={ticketId} />
  ) : (
    <SampleTicketDetail ticketId={ticketId} />
  )
}

function SampleTicketDetail({ ticketId }: { ticketId: string }) {
  const ticket = useTicket(ticketId)
  if (ticket.isPending) return <LoadingState />
  if (ticket.isError)
    return (
      <>
        <ButtonLink
          href="/tickets"
          variant="ghost"
          className="mb-5 h-11 text-[13px]"
        >
          <ArrowLeft className="mr-2 size-3.5" />
          Ticket inbox
        </ButtonLink>
        <ErrorState
          title="This ticket isn’t available in this workspace."
          retry={() => void ticket.refetch()}
        />
      </>
    )
  const data = ticket.data.data
  return (
    <>
      <Link
        href="/tickets"
        className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-md text-[13px] text-muted-foreground hover:text-foreground focus-visible:outline-2"
      >
        <ArrowLeft className="size-3.5" />
        Back to inbox
      </Link>
      <div className="mb-7">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {data.reference}
          </span>
          <StatusBadge status={data.status} />
          <PriorityBadge priority={data.priority} />
        </div>
        <h1 className="max-w-3xl font-heading text-3xl leading-tight font-medium tracking-[-0.04em] md:text-4xl">
          {data.subject}
        </h1>
        <p className="mt-3 text-[13px] text-muted-foreground">
          {data.customer.name} <span className="mx-2">/</span>
          {data.category}
          <span className="mx-2">/</span>Support case
        </p>
      </div>
      <div className="ticket-review-layout grid items-start gap-7">
        <div className="min-w-0">
          <Tabs defaultValue="conversation">
            <TabsList className="mb-4 group-data-horizontal/tabs:h-13">
              <TabsTrigger value="conversation" className="px-2.5 text-[13px]">
                Conversation
              </TabsTrigger>
              <TabsTrigger value="evidence" className="px-2.5 text-[13px]">
                Evidence
              </TabsTrigger>
              <TabsTrigger value="timeline" className="px-2.5 text-[13px]">
                Timeline
              </TabsTrigger>
            </TabsList>
            <TabsContent value="conversation">
              <section className="rounded-2xl border p-5 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="text-xs">
                      {data.customer.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-[13px] font-medium">
                      {data.customer.name}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Customer message
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-[1.9] text-muted-foreground">
                  {data.message}
                </p>
                <div className="mt-8 border-t pt-5">
                  <p className="eyebrow text-xs text-muted-foreground">
                    Reply channel
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                    Reply sending is not connected. You can edit the draft in
                    the proposal panel.
                  </p>
                </div>
              </section>
              <section className="mt-5 rounded-2xl border p-5">
                <h2 className="flex items-center gap-2 text-[13px] font-medium">
                  <User className="size-4 text-muted-foreground" />
                  Customer context
                </h2>
                <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Name</dt>
                    <dd className="mt-1.5 text-[13px]">{data.customer.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Email</dt>
                    <dd className="mt-1.5 text-[13px] break-all">
                      {data.customer.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Category</dt>
                    <dd className="mt-1.5 text-[13px]">{data.category}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Account source
                    </dt>
                    <dd className="mt-1.5 text-[13px]">Workspace preview</dd>
                  </div>
                </dl>
              </section>
            </TabsContent>
            <TabsContent value="evidence">
              <section className="rounded-2xl border p-5">
                <h2 className="font-heading text-xl font-medium tracking-tight">
                  The sources behind the suggestion
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  Review the records and policy behind this recommendation.
                </p>
                <div className="mt-5 space-y-3">
                  {data.evidence.map((source) => (
                    <Dialog key={source.reference}>
                      <DialogTrigger
                        render={
                          <Button
                            variant="outline"
                            className="h-auto w-full justify-start gap-3 rounded-xl p-4 text-left whitespace-normal"
                          />
                        }
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                          {source.kind === "policy" ? (
                            <BookOpen />
                          ) : (
                            <FileSearch />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px]">
                            {source.title}
                          </span>
                          <span className="mt-1 block font-mono text-xs font-normal text-muted-foreground">
                            {source.reference}
                          </span>
                        </span>
                        <ArrowUpRight className="size-3.5" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{source.title}</DialogTitle>
                          <DialogDescription>
                            Source reference · {source.reference}
                          </DialogDescription>
                        </DialogHeader>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {source.detail}
                        </p>
                        <div className="flex items-center gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                          <Link2 className="size-3.5" />
                          Example record. No external account is connected.
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </section>
            </TabsContent>
            <TabsContent value="timeline">
              <section className="rounded-2xl border p-5">
                <h2 className="font-heading text-xl font-medium tracking-tight">
                  An investigation, made visible.
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  Example investigation stages. No live tools were run.
                </p>
                <ol className="mt-7 space-y-7">
                  {[
                    {
                      title: "Ticket received",
                      detail: "Question linked to its workspace.",
                    },
                    {
                      title: "Account context gathered",
                      detail: "Account records attached to the case.",
                    },
                    {
                      title: "Published policy referenced",
                      detail: "Versioned knowledge source linked.",
                    },
                    {
                      title: "Recommendation prepared",
                      detail: `${data.confidence.toLowerCase()} confidence in this example. Human review remains required.`,
                    },
                  ].map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-muted font-mono text-xs">
                        {i < 3 ? <Check className="size-3" /> : "04"}
                      </span>
                      <div>
                        <h3 className="text-[13px] font-medium">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </TabsContent>
          </Tabs>
          <p className="mt-5 flex items-start gap-2 px-1 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3 shrink-0" />
            Review the evidence before deciding on a next step.
          </p>
        </div>
        <ProposalPanel key={data.id} ticket={data} />
      </div>
    </>
  )
}
