"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  BookOpen,
  FileSearch,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react"
import { toast } from "sonner"
import { useWorkspace } from "@/components/dashboard/workspace-provider"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/dashboard/data-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBusinessApi } from "./use-tickets"
import { humanize, PriorityBadge, StatusBadge } from "./ticket-status"
import { LiveProposalPanel } from "./live-proposal-panel"

export function LiveTicketDetail({ ticketId }: { ticketId: string }) {
  const { workspace, profile } = useWorkspace()
  const business = useBusinessApi()
  const cache = useQueryClient()
  const key = ["live", workspace.id, "ticket", ticketId]
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [customerId, setCustomerId] = useState("")
  const [reason, setReason] = useState("")
  const writable = workspace.role === "ADMIN" || workspace.role === "AGENT"
  const ticket = useQuery({
    queryKey: [...key, "detail"],
    queryFn: () => business!.ticket(ticketId),
    enabled: !!business,
    refetchInterval: (query) =>
      ["QUEUED", "INVESTIGATING", "EXECUTING"].includes(
        query.state.data?.data.status ?? ""
      )
        ? 3000
        : false,
  })
  const messages = useQuery({
    queryKey: [...key, "messages"],
    queryFn: () => business!.messages(ticketId),
    enabled: !!business,
  })
  const runs = useQuery({
    queryKey: [...key, "investigations"],
    queryFn: () => business!.investigations(ticketId),
    enabled: !!business,
    refetchInterval: (query) =>
      query.state.data?.data.some((run) =>
        ["QUEUED", "RUNNING"].includes(run.status)
      )
        ? 3000
        : false,
  })
  const latestRun = runs.data?.data.toSorted((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  )[0]
  const investigation = useQuery({
    queryKey: [...key, "investigation", latestRun?.id],
    queryFn: () => business!.investigation(latestRun!.id),
    enabled: !!business && !!latestRun,
    refetchInterval: (query) =>
      ["QUEUED", "RUNNING"].includes(query.state.data?.data.status ?? "")
        ? 2000
        : false,
  })
  const actions = useQuery({
    queryKey: [...key, "actions"],
    queryFn: () => business!.actions(ticketId),
    enabled: !!business,
    refetchInterval: (query) =>
      query.state.data?.data.some((action) =>
        ["QUEUED", "RUNNING"].includes(action.status)
      )
        ? 2500
        : false,
  })
  const audit = useQuery({
    queryKey: [...key, "audit"],
    queryFn: () => business!.audit(ticketId),
    enabled: !!business,
  })
  const customers = useQuery({
    queryKey: ["live", workspace.id, "customers"],
    queryFn: () => business!.customers(),
    enabled: !!business && verifyOpen,
  })
  const customer = useQuery({
    queryKey: ["live", workspace.id, "customer", ticket.data?.data.customerId],
    queryFn: () => business!.customer(ticket.data!.data.customerId!),
    enabled: !!business && !!ticket.data?.data.customerId,
  })
  const refresh = async () => {
    await Promise.all([
      cache.invalidateQueries({ queryKey: key }),
      cache.invalidateQueries({ queryKey: ["live", workspace.id, "tickets"] }),
      cache.invalidateQueries({ queryKey: ["live", workspace.id, "audit"] }),
    ])
  }
  const mutation = useMutation({
    mutationFn: async (kind: "verify" | "start" | "retry") => {
      if (!business || !ticket.data)
        throw new Error("The workspace connection is unavailable.")
      if (kind === "verify")
        return business.verifyCustomer(
          ticketId,
          customerId,
          reason.trim(),
          ticket.data.data.version
        )
      if (kind === "retry" && latestRun)
        return business.retryInvestigation(latestRun.id)
      return business.startInvestigation(ticketId)
    },
    onSuccess: async (_data, kind) => {
      setVerifyOpen(false)
      await refresh()
      toast.success(
        kind === "verify"
          ? "Customer verification saved"
          : "Investigation queued",
        {
          description:
            kind === "verify"
              ? "Your verification reason is recorded in the audit trail."
              : "The recorded investigation will update as work completes.",
        }
      )
    },
    onError: async (error) => {
      toast.error(error.message)
      await refresh()
    },
  })
  const actionMutation = useMutation({
    mutationFn: async ({
      id,
      version,
      reconcile,
    }: {
      id: string
      version: number
      reconcile: boolean
    }): Promise<unknown> =>
      reconcile
        ? business!.reconcileAction(id, version)
        : business!.retryAction(id, version),
    onSuccess: async () => {
      await refresh()
      toast.success("Action state refreshed")
    },
    onError: async (error) => {
      toast.error(error.message)
      await refresh()
    },
  })
  if (!business)
    return (
      <ErrorState
        title="The workspace connection is unavailable."
        retry={() => window.location.reload()}
      />
    )
  if (ticket.isPending) return <LoadingState />
  if (ticket.isError)
    return (
      <ErrorState
        title="This ticket isn’t available in this workspace."
        retry={() => void ticket.refetch()}
      />
    )
  const data = ticket.data.data
  const proposal = investigation.data?.data.proposal
  const active = latestRun && ["QUEUED", "RUNNING"].includes(latestRun.status)
  const canVerify =
    writable &&
    ["NEW", "NEEDS_REVIEW", "REJECTED"].includes(data.status) &&
    !active
  const verified = !!data.customerId && !!data.customerVerifiedAt
  const canStart =
    writable &&
    verified &&
    ["NEW", "NEEDS_REVIEW", "REJECTED"].includes(data.status) &&
    !active
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: profile.timeZone,
    }).format(new Date(value))
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
          <Button variant="ghost" size="sm" onClick={() => void refresh()}>
            <RefreshCw className="size-3.5" />
            Refresh case
          </Button>
        </div>
        <h1 className="max-w-3xl font-heading text-3xl leading-tight font-medium tracking-[-0.04em] md:text-4xl">
          {data.subject}
        </h1>
        <p className="mt-3 text-[13px] text-muted-foreground">
          {customer.data?.data.name ??
            data.requesterEmail ??
            "Unverified requester"}
          <span className="mx-2">/</span>
          {data.category ? humanize(data.category) : "Uncategorized"}
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
              <TabsTrigger value="outcome" className="px-2.5 text-[13px]">
                Outcome
              </TabsTrigger>
            </TabsList>
            <TabsContent value="conversation">
              <section
                aria-label="Conversation messages"
                className="space-y-5 rounded-2xl border p-5 md:p-6"
              >
                {messages.isPending ? (
                  <LoadingState />
                ) : messages.isError ? (
                  <ErrorState
                    title="Conversation could not be loaded."
                    retry={() => void messages.refetch()}
                  />
                ) : !messages.data.data.length ? (
                  <p className="text-sm text-muted-foreground">
                    No messages are recorded.
                  </p>
                ) : (
                  messages.data.data.map((message) => (
                    <article
                      key={message.id}
                      className="border-b pb-5 last:border-0 last:pb-0"
                    >
                      <div className="mb-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                        <span>
                          {humanize(message.authorType)} ·{" "}
                          {humanize(message.visibility)}
                        </span>
                        <time dateTime={message.createdAt}>
                          {formatDate(message.createdAt)}
                        </time>
                      </div>
                      <p className="text-sm leading-[1.9] whitespace-pre-wrap text-muted-foreground">
                        {message.body}
                      </p>
                    </article>
                  ))
                )}
                <p className="border-t pt-4 text-xs leading-relaxed text-muted-foreground">
                  Replies remain drafts until a delivery channel is connected.
                </p>
              </section>
              <section className="mt-5 rounded-2xl border p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-[13px] font-medium">
                    <User className="size-4 text-muted-foreground" />
                    Customer context
                  </h2>
                  <Badge variant="outline">
                    {verified ? "Verified" : "Verification required"}
                  </Badge>
                </div>
                <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Name</dt>
                    <dd className="mt-1.5 text-[13px]">
                      {customer.data?.data.name ?? "Not linked"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Requester email
                    </dt>
                    <dd className="mt-1.5 text-[13px] break-all">
                      {data.requesterEmail ??
                        customer.data?.data.email ??
                        "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Customer reference
                    </dt>
                    <dd className="mt-1.5 text-[13px] break-all">
                      {customer.data?.data.externalRef ??
                        data.requesterCustomerRef ??
                        "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      Verified at
                    </dt>
                    <dd className="mt-1.5 text-[13px]">
                      {data.customerVerifiedAt
                        ? formatDate(data.customerVerifiedAt)
                        : "Not verified"}
                    </dd>
                  </div>
                </dl>
                {customer.isError && (
                  <p role="alert" className="mt-4 text-sm text-warning">
                    Customer details could not be loaded.{" "}
                    <Button
                      variant="link"
                      onClick={() => void customer.refetch()}
                    >
                      Retry
                    </Button>
                  </p>
                )}
                {canVerify && (
                  <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
                    <DialogTrigger
                      render={
                        <Button variant="outline" className="mt-5 h-11" />
                      }
                    >
                      <ShieldCheck className="size-4" />
                      {verified
                        ? "Update customer verification"
                        : "Verify customer"}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Verify the requester</DialogTitle>
                        <DialogDescription>
                          Match the requester to an account and record how you
                          verified their identity. A matching email alone is not
                          verification.
                        </DialogDescription>
                      </DialogHeader>
                      {customers.isPending ? (
                        <LoadingState />
                      ) : customers.isError ? (
                        <ErrorState retry={() => void customers.refetch()} />
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label id="customer-label">Customer account</Label>
                            <Select
                              value={customerId}
                              onValueChange={(value) =>
                                setCustomerId(value ?? "")
                              }
                              items={customers.data.data
                                .filter((item) => item.status === "ACTIVE")
                                .map((item) => ({
                                  value: item.id,
                                  label: `${item.name} · ${item.email} · ${item.externalRef}`,
                                }))}
                            >
                              <SelectTrigger
                                aria-labelledby="customer-label"
                                className="w-full"
                              >
                                <SelectValue placeholder="Choose a verified account" />
                              </SelectTrigger>
                              <SelectContent>
                                {customers.data.data
                                  .filter((item) => item.status === "ACTIVE")
                                  .map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                      {item.name} · {item.email} ·{" "}
                                      {item.externalRef}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            {!customers.data.data.length && (
                              <p className="text-sm text-muted-foreground">
                                No customer accounts exist in this workspace.
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="verification-reason">
                              Verification reason
                            </Label>
                            <Textarea
                              id="verification-reason"
                              value={reason}
                              onChange={(event) =>
                                setReason(event.target.value)
                              }
                              maxLength={2000}
                              placeholder="Describe the evidence used to verify the requester…"
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setVerifyOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={
                            !customerId || !reason.trim() || mutation.isPending
                          }
                          onClick={() => mutation.mutate("verify")}
                        >
                          {mutation.isPending ? "Saving…" : "Save verification"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </section>
            </TabsContent>
            <TabsContent value="evidence">
              <section className="rounded-2xl border p-5">
                <h2 className="font-heading text-xl font-medium tracking-tight">
                  The sources behind the suggestion
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  Recorded account and policy snapshots from this investigation.
                </p>
                {investigation.isError ? (
                  <ErrorState retry={() => void investigation.refetch()} />
                ) : !proposal?.sources.length ? (
                  <p className="mt-5 text-sm text-muted-foreground">
                    No evidence has been recorded yet.
                  </p>
                ) : (
                  <div className="mt-5 space-y-3">
                    {proposal.sources.map((source) => (
                      <article
                        key={source.sourceRefId}
                        className="rounded-xl border p-4"
                      >
                        <h3 className="flex items-center gap-2 text-sm font-medium">
                          {source.sourceType === "KNOWLEDGE" ? (
                            <BookOpen className="size-4" />
                          ) : (
                            <FileSearch className="size-4" />
                          )}
                          {source.title}
                        </h3>
                        <p className="mt-3 text-[13px] leading-relaxed whitespace-pre-wrap text-muted-foreground">
                          {source.excerpt}
                        </p>
                        <p className="mt-3 font-mono text-xs break-all text-muted-foreground">
                          {source.sourceRefId}
                          {source.sourceType === "KNOWLEDGE" &&
                            ` · document v${source.documentVersion}`}
                        </p>
                        <time
                          dateTime={source.observedAt}
                          className="mt-2 block text-xs text-muted-foreground"
                        >
                          Observed {formatDate(source.observedAt)}
                        </time>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </TabsContent>
            <TabsContent value="timeline">
              <section className="rounded-2xl border p-5">
                <h2 className="font-heading text-xl font-medium tracking-tight">
                  An investigation, made visible.
                </h2>
                {runs.isError ? (
                  <ErrorState retry={() => void runs.refetch()} />
                ) : !latestRun ? (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No investigation has started.
                  </p>
                ) : (
                  <>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Badge variant="outline">
                        {humanize(
                          investigation.data?.data.status ?? latestRun.status
                        )}
                      </Badge>
                      {investigation.data?.data.model && (
                        <span className="text-xs text-muted-foreground">
                          Model: {investigation.data.data.model}
                        </span>
                      )}
                    </div>
                    {investigation.isPending ? (
                      <LoadingState />
                    ) : investigation.isError ? (
                      <ErrorState retry={() => void investigation.refetch()} />
                    ) : (
                      <ol className="mt-6 space-y-5">
                        {investigation.data.data.steps.map((step) => (
                          <li key={step.id} className="flex gap-4">
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-muted font-mono text-xs">
                              {step.sequence}
                            </span>
                            <div>
                              <h3 className="text-[13px] font-medium">
                                {step.label}
                              </h3>
                              <p className="mt-1.5 text-xs text-muted-foreground">
                                {humanize(step.status)}
                                {step.toolName && ` · ${step.toolName}`}
                                {step.durationMs !== null &&
                                  ` · ${step.durationMs} ms`}
                              </p>
                              {step.errorCode && (
                                <p className="mt-2 text-xs text-warning">
                                  {humanize(step.errorCode)}
                                </p>
                              )}
                              {!!step.sourceRefs.length && (
                                <p className="mt-2 font-mono text-xs break-all text-muted-foreground">
                                  {step.sourceRefs.join(", ")}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                    {latestRun.failureCode && (
                      <p role="alert" className="mt-4 text-sm text-warning">
                        Investigation stopped: {humanize(latestRun.failureCode)}
                        .
                      </p>
                    )}
                    {writable &&
                      ["FAILED", "NEEDS_REVIEW"].includes(latestRun.status) && (
                        <Button
                          className="mt-5"
                          disabled={mutation.isPending}
                          onClick={() => mutation.mutate("retry")}
                        >
                          Retry investigation
                        </Button>
                      )}
                  </>
                )}
                <div className="mt-7 border-t pt-5">
                  <h3 className="text-sm font-medium">
                    Recorded case activity
                  </h3>
                  {audit.isPending ? (
                    <LoadingState />
                  ) : audit.isError ? (
                    <ErrorState retry={() => void audit.refetch()} />
                  ) : (
                    <ol className="mt-4 space-y-4">
                      {audit.data.data.map((event) => (
                        <li key={event.id}>
                          <p className="text-[13px]">
                            {humanize(event.eventType.replaceAll(".", "_"))}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {humanize(event.actorType)} ·{" "}
                            {formatDate(event.createdAt)}
                          </p>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </section>
            </TabsContent>
            <TabsContent value="outcome">
              <section className="rounded-2xl border p-5">
                <h2 className="font-heading text-xl font-medium tracking-tight">
                  Action outcome
                </h2>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  Approval queues work. Completion is confirmed only by a
                  recorded result.
                </p>
                {actions.isPending ? (
                  <LoadingState />
                ) : actions.isError ? (
                  <ErrorState retry={() => void actions.refetch()} />
                ) : !actions.data.data.length ? (
                  <EmptyState
                    title="No action has been admitted."
                    description="An approved proposal will appear here with its saved status and result."
                  />
                ) : (
                  <div className="mt-5 space-y-5">
                    {actions.data.data.map((action) => (
                      <article
                        key={action.id}
                        className="rounded-xl border p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">
                            {humanize(action.status)}
                          </Badge>
                          <Badge variant="secondary">
                            {action.simulation
                              ? "Simulation"
                              : "Live execution"}
                          </Badge>
                        </div>
                        <h3 className="mt-3 text-sm font-medium">
                          {humanize(action.type)}
                        </h3>
                        <p className="mt-2 font-mono text-xs break-all text-muted-foreground">
                          {action.targetRef} · proposal v
                          {action.proposalVersion} · {action.attempts} attempts
                        </p>
                        {action.simulation && (
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            This result is persisted in the test company. No
                            external payment, subscription or product account is
                            changed.
                          </p>
                        )}
                        {action.failureCode && (
                          <p role="alert" className="mt-3 text-sm text-warning">
                            {humanize(action.failureCode)}
                          </p>
                        )}
                        {action.status === "SUCCEEDED" && (
                          <p className="mt-3 text-sm text-success">
                            {action.simulation
                              ? "Simulated action completed and saved."
                              : "Action completed and saved."}
                          </p>
                        )}
                        {action.beforeState !== null && (
                          <details className="mt-4">
                            <summary className="cursor-pointer text-sm">
                              Before state
                            </summary>
                            <pre className="mt-3 overflow-auto rounded-lg bg-muted p-3 text-xs">
                              {JSON.stringify(action.beforeState, null, 2)}
                            </pre>
                          </details>
                        )}
                        {action.afterState !== null && (
                          <details className="mt-4" open>
                            <summary className="cursor-pointer text-sm">
                              Saved result
                            </summary>
                            <pre className="mt-3 overflow-auto rounded-lg bg-muted p-3 text-xs">
                              {JSON.stringify(action.afterState, null, 2)}
                            </pre>
                          </details>
                        )}
                        {writable && action.retryable && (
                          <Button
                            variant="outline"
                            className="mt-4"
                            disabled={actionMutation.isPending}
                            onClick={() =>
                              actionMutation.mutate({
                                id: action.id,
                                version: action.version,
                                reconcile: false,
                              })
                            }
                          >
                            Retry action
                          </Button>
                        )}
                        {writable && action.status === "OUTCOME_UNKNOWN" && (
                          <Button
                            variant="outline"
                            className="mt-4"
                            disabled={actionMutation.isPending}
                            onClick={() =>
                              actionMutation.mutate({
                                id: action.id,
                                version: action.version,
                                reconcile: true,
                              })
                            }
                          >
                            Reconcile result
                          </Button>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </TabsContent>
          </Tabs>
          <p className="mt-5 flex items-start gap-2 px-1 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3 shrink-0" />
            Review the evidence before deciding on a next step.
          </p>
        </div>
        {proposal ? (
          <LiveProposalPanel
            key={`${proposal.id}:${proposal.version}`}
            proposal={proposal}
            writable={writable}
            onChanged={refresh}
          />
        ) : (
          <section
            aria-label="Recommendation"
            className="rounded-2xl border p-5"
          >
            <h2 className="font-heading text-xl font-medium tracking-tight">
              Prepare a recommendation
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {!verified
                ? "Verify the requester’s customer account before starting an investigation."
                : active
                  ? "Investigation is in progress. Recorded evidence and a proposal will appear as they are saved."
                  : "Start an investigation to gather account context and published policy."}
            </p>
            {canStart && (
              <Button
                className="mt-5 h-11 w-full"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate("start")}
              >
                {mutation.isPending ? "Starting…" : "Start investigation"}
              </Button>
            )}
            {active && (
              <p role="status" className="mt-4 text-sm">
                {humanize(latestRun.status)} · updates automatically
              </p>
            )}
            {investigation.isError && (
              <ErrorState
                title="Recommendation could not be loaded."
                retry={() => void investigation.refetch()}
              />
            )}
            {mutation.isError && (
              <p role="alert" className="mt-4 text-sm text-warning">
                {mutation.error.message}
              </p>
            )}
          </section>
        )}
      </div>
    </>
  )
}
