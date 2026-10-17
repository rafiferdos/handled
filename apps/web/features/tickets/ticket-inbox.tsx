"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ListFilter, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeading } from "@/components/dashboard/page-heading"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/dashboard/data-state"
import { useWorkspace } from "@/components/dashboard/workspace-provider"
import {
  ticketStatuses,
  ticketPriorities,
  type TicketStatus,
  type TicketPriority,
} from "@/lib/api/schemas"
import { humanize, StatusBadge, PriorityBadge } from "./ticket-status"
import { useTickets } from "./use-tickets"

export function TicketInbox() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<TicketStatus | "ALL">("ALL")
  const [priority, setPriority] = useState<TicketPriority | "ALL">("ALL")
  const [page, setPage] = useState(1)
  const { workspace, profile, mode } = useWorkspace()
  const tickets = useTickets({ search, status, priority }, page)
  const shortDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: profile.timeZone,
  })
  const fullDate = new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: profile.timeZone,
  })
  const filtered = search || status !== "ALL" || priority !== "ALL"
  const reset = () => {
    setSearch("")
    setStatus("ALL")
    setPriority("ALL")
    setPage(1)
  }
  return (
    <>
      <PageHeading
        eyebrow={`${workspace.name} / Tickets`}
        title="One queue. The whole picture."
        description="Find conversations, review their status and choose the next case for this workspace."
      />
      <div className="mb-6 flex flex-col justify-between gap-3 rounded-2xl border bg-card p-3 sm:flex-row">
        <div className="relative sm:w-80">
          <Search className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            aria-label="Search tickets"
            placeholder="Search subject or reference…"
            className="workspace-control h-11 rounded-xl border-transparent bg-muted/45 pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ListFilter className="mx-1 hidden size-4 text-muted-foreground sm:block" />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value ?? "ALL")
              setPage(1)
            }}
            items={[
              { value: "ALL", label: "All statuses" },
              ...ticketStatuses.map((value) => ({
                value,
                label: humanize(value),
              })),
            ]}
          >
            <SelectTrigger
              aria-label="Filter by status"
              className="min-w-36 flex-1 rounded-xl data-[size=default]:h-11 sm:flex-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value="ALL" className="min-h-11">
                All statuses
              </SelectItem>
              {ticketStatuses.map((value) => (
                <SelectItem key={value} value={value} className="min-h-11">
                  {humanize(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priority}
            onValueChange={(value) => {
              setPriority(value ?? "ALL")
              setPage(1)
            }}
            items={[
              { value: "ALL", label: "All priorities" },
              ...ticketPriorities.map((value) => ({
                value,
                label: humanize(value),
              })),
            ]}
          >
            <SelectTrigger
              aria-label="Filter by priority"
              className="min-w-32 flex-1 rounded-xl data-[size=default]:h-11 sm:flex-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value="ALL" className="min-h-11">
                All priorities
              </SelectItem>
              {ticketPriorities.map((value) => (
                <SelectItem key={value} value={value} className="min-h-11">
                  {humanize(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filtered && (
            <Button
              variant="ghost"
              size="icon"
              className="size-11"
              aria-label="Clear ticket filters"
              onClick={reset}
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {tickets.data
            ? `${tickets.data.meta.total} ${tickets.data.meta.total === 1 ? "ticket" : "tickets"}`
            : "Loading tickets…"}
        </p>
        <Button
          variant="ghost"
          size="sm"
          disabled={tickets.isFetching}
          onClick={() => void tickets.refetch()}
        >
          Refresh queue
        </Button>
      </div>
      {tickets.isPending ? (
        <LoadingState />
      ) : tickets.isError ? (
        <ErrorState retry={() => void tickets.refetch()} />
      ) : !tickets.data.data.length ? (
        <EmptyState
          title={
            filtered
              ? "No matching conversations."
              : "This workspace is a clean slate."
          }
          description={
            filtered
              ? "Try another search or clear the filters to see all cases."
              : "There are no tickets in this workspace. Each workspace keeps its own queue."
          }
          action={
            filtered ? (
              <Button variant="outline" className="h-11" onClick={reset}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <section
          aria-label="Ticket list"
          className="overflow-hidden rounded-2xl border"
        >
          <div className="hidden grid-cols-[2fr_0.8fr_0.6fr_24px] gap-5 border-b bg-muted/35 px-6 py-3 font-mono text-xs tracking-wider text-muted-foreground uppercase md:grid">
            <span>Conversation</span>
            <span>Status</span>
            <span>Priority</span>
            <span className="sr-only">Open</span>
          </div>
          {tickets.data.data.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className="group grid gap-4 border-b px-5 py-6 transition-colors last:border-0 hover:bg-muted/40 focus-visible:outline-2 md:grid-cols-[2fr_0.8fr_0.6fr_24px] md:items-center md:gap-5 md:px-6"
            >
              <div className="flex min-w-0 items-start gap-3.5">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-muted text-xs">
                    {ticket.customer.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground">
                    {ticket.reference}
                    <span className="mx-2">/</span>
                    {ticket.customer.name}
                  </p>
                  <h2 className="mt-2 text-sm leading-relaxed font-medium">
                    {ticket.subject}
                  </h2>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {ticket.category} <span className="mx-1.5">·</span>{" "}
                    <time
                      dateTime={ticket.createdAt}
                      title={`${fullDate.format(new Date(ticket.createdAt))} (${profile.timeZone})`}
                    >
                      {shortDate.format(new Date(ticket.createdAt))}
                    </time>
                  </p>
                </div>
              </div>
              <div className="ml-12 flex items-center gap-3 md:ml-0">
                <StatusBadge status={ticket.status} />
                <span className="md:hidden">
                  <PriorityBadge priority={ticket.priority} />
                </span>
              </div>
              <div className="hidden md:block">
                <PriorityBadge priority={ticket.priority} />
              </div>
              <ArrowUpRight className="hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:block" />
            </Link>
          ))}
        </section>
      )}
      {mode === "live" &&
        tickets.data &&
        (page > 1 || tickets.data.meta.hasNext) && (
          <nav
            aria-label="Ticket pages"
            className="mt-5 flex items-center justify-end gap-3"
          >
            <Button
              variant="outline"
              disabled={page === 1 || tickets.isFetching}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <Button
              variant="outline"
              disabled={!tickets.data.meta.hasNext || tickets.isFetching}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </Button>
          </nav>
        )}
    </>
  )
}
