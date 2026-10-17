"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import {
  Check,
  FilePenLine,
  GitBranch,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import type { LiveProposal } from "@/lib/api/business"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBusinessApi } from "./use-tickets"
import { humanize } from "./ticket-status"

export function LiveProposalPanel({
  proposal,
  writable,
  onChanged,
}: {
  proposal: LiveProposal
  writable: boolean
  onChanged: () => Promise<void>
}) {
  const business = useBusinessApi()
  const [summary, setSummary] = useState(proposal.summary)
  const [reply, setReply] = useState(proposal.replyDraft)
  const [editOpen, setEditOpen] = useState(false)
  const [decisionOpen, setDecisionOpen] = useState(false)
  const [decision, setDecision] = useState<"reject" | "escalate">("escalate")
  const [reason, setReason] = useState("")
  const [approvalKey] = useState(() => crypto.randomUUID())
  const low = proposal.confidence === "LOW"
  const editable = writable && ["READY", "DRAFT"].includes(proposal.status)
  const approvable =
    writable && proposal.status === "READY" && !low && !!proposal.recommendation
  const mutation = useMutation({
    mutationFn: async (
      kind: "edit" | "approve" | "decision"
    ): Promise<unknown> => {
      if (!business) throw new Error("The workspace connection is unavailable.")
      if (kind === "edit")
        return business.editProposal(proposal, summary.trim(), reply.trim())
      if (kind === "approve")
        return business.approveProposal(proposal, approvalKey)
      return business.decideProposal(proposal, decision, reason.trim())
    },
    onSuccess: async (_result, kind) => {
      setEditOpen(false)
      setDecisionOpen(false)
      await onChanged()
      toast.success(
        kind === "approve"
          ? "Approval saved · action queued"
          : kind === "edit"
            ? "New proposal version saved"
            : "Decision saved",
        {
          description:
            kind === "approve"
              ? "Review the Outcome tab for the persisted execution result."
              : "The decision and current version are recorded by the service.",
        }
      )
    },
    onError: async (error) => {
      toast.error(error.message)
      await onChanged()
    },
  })
  return (
    <section
      aria-label="Recommendation"
      className="min-w-0 overflow-hidden rounded-2xl border"
    >
      <div className="border-b bg-muted/35 p-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="flex items-center gap-2 text-[13px] font-medium">
            <Sparkles className="size-4" />
            Recommendation
          </span>
          <Badge variant="outline" className="font-mono text-xs">
            v{proposal.version}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={
              low
                ? "border-warning/20 bg-warning-surface text-xs text-warning"
                : "border-success/20 bg-success-surface text-xs text-success"
            }
          >
            {humanize(proposal.confidence)} confidence
          </Badge>
          <Badge variant="outline">{humanize(proposal.status)}</Badge>
        </div>
        <h2 className="mt-4 font-heading text-2xl leading-tight font-medium tracking-tight">
          {proposal.summary}
        </h2>
        {proposal.recommendation && (
          <div className="mt-4 rounded-xl border bg-card p-3">
            <p className="text-[13px] font-medium">
              {humanize(proposal.recommendation.type)}
            </p>
            <p className="mt-2 font-mono text-xs break-all text-muted-foreground">
              {proposal.recommendation.targetRef}
            </p>
            {proposal.recommendation.type === "REFUND_DUPLICATE_PAYMENT" && (
              <p className="mt-2 text-sm">
                {proposal.recommendation.params.amountMinor} minor units ·{" "}
                {proposal.recommendation.params.currency}
              </p>
            )}
          </div>
        )}
        {!!proposal.missingFacts.length && (
          <div className="mt-4 text-[13px] text-warning">
            <p className="font-medium">Missing facts</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {proposal.missingFacts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="space-y-5 p-5">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[13px] font-medium">Suggested reply</h3>
            {editable && (
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-11 text-[13px]"
                    />
                  }
                >
                  <FilePenLine className="mr-1 size-3" />
                  Edit draft
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit recommendation and reply</DialogTitle>
                    <DialogDescription>
                      Saving creates a new version for human review. The
                      evidence and action remain subject to server validation.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="proposal-summary">Summary</Label>
                      <Textarea
                        id="proposal-summary"
                        value={summary}
                        onChange={(event) => setSummary(event.target.value)}
                        maxLength={4000}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reply-draft">Reply draft</Label>
                      <Textarea
                        id="reply-draft"
                        value={reply}
                        onChange={(event) => setReply(event.target.value)}
                        maxLength={10000}
                        className="min-h-44"
                      />
                      <p className="text-xs text-muted-foreground">
                        {reply.length} / 10000 characters · Saving does not send
                        the reply.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setEditOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={
                        !summary.trim() || !reply.trim() || mutation.isPending
                      }
                      onClick={() => mutation.mutate("edit")}
                    >
                      {mutation.isPending ? "Saving…" : "Save new version"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <blockquote className="rounded-xl border bg-muted/20 p-4 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {proposal.replyDraft}
          </blockquote>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-muted/40 p-3 text-[13px] leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <p>
            Review the exact proposal version and its evidence. Approval queues
            an action; the Outcome tab confirms its saved result.
          </p>
        </div>
        {mutation.isError && (
          <p role="alert" className="text-sm text-warning">
            {mutation.error.message}
          </p>
        )}
        {editable ? (
          <>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    className="h-11 w-full text-[13px]"
                    disabled={!approvable || mutation.isPending}
                  />
                }
              >
                <Check className="mr-2 size-3.5" />
                Approve proposal
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Approve proposal version {proposal.version}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Your decision will be saved and this exact action will be
                    queued. Check the Outcome tab for completion. Test company
                    actions run in simulation.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="h-11">
                    Keep reviewing
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="h-11"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate("approve")}
                  >
                    Confirm approval
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {!approvable && (
              <p className="text-xs text-warning">
                {low
                  ? "Approval is unavailable for low-confidence evidence."
                  : !proposal.recommendation
                    ? "No executable action was recommended."
                    : "The proposal must be ready before approval."}
              </p>
            )}
            <Dialog open={decisionOpen} onOpenChange={setDecisionOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    className="h-11 w-full text-[13px]"
                    disabled={mutation.isPending}
                  />
                }
              >
                <GitBranch className="mr-2 size-3.5" />
                Reject or escalate
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Choose a different next step</DialogTitle>
                  <DialogDescription>
                    Your reason and decision will be saved for proposal version{" "}
                    {proposal.version}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label id="decision-label">Decision</Label>
                    <Select
                      value={decision}
                      onValueChange={(value) => value && setDecision(value)}
                      items={[
                        { value: "escalate", label: "Escalate for review" },
                        { value: "reject", label: "Reject recommendation" },
                      ]}
                    >
                      <SelectTrigger
                        aria-labelledby="decision-label"
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="escalate">
                          Escalate for review
                        </SelectItem>
                        <SelectItem
                          value="reject"
                          disabled={proposal.status !== "READY"}
                        >
                          Reject recommendation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="decision-reason">Reason (required)</Label>
                    <Textarea
                      id="decision-reason"
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      maxLength={2000}
                      placeholder="Explain what needs a closer look…"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDecisionOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      !reason.trim() ||
                      mutation.isPending ||
                      (decision === "reject" && proposal.status !== "READY")
                    }
                    onClick={() => mutation.mutate("decision")}
                  >
                    {mutation.isPending ? "Saving…" : "Save decision"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <p
            role="status"
            className="rounded-xl border p-4 text-sm leading-relaxed text-muted-foreground"
          >
            {proposal.status === "APPROVED"
              ? "Approval is recorded. Open Outcome to review action execution."
              : writable
                ? `This proposal is ${humanize(proposal.status).toLowerCase()}. Its saved history is preserved.`
                : "Your workspace role allows you to review this proposal."}
          </p>
        )}
      </div>
    </section>
  )
}
