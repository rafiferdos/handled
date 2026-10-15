"use client"

import { useState } from "react"
import {
  Check,
  FilePenLine,
  GitBranch,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"
import { toast } from "sonner"
import type { TicketPreview } from "@/lib/api/schemas"
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
import { humanize } from "./ticket-status"

export function ProposalPanel({ ticket }: { ticket: TicketPreview }) {
  const [reply, setReply] = useState(ticket.replyDraft)
  const [draft, setDraft] = useState(ticket.replyDraft)
  const [editOpen, setEditOpen] = useState(false)
  const [decisionOpen, setDecisionOpen] = useState(false)
  const [decision, setDecision] = useState<"reject" | "escalate">("escalate")
  const [reason, setReason] = useState("")
  const [recorded, setRecorded] = useState<string | null>(null)
  const low = ticket.confidence === "LOW"
  function record(value: string) {
    if (recorded) return
    setRecorded(value)
    setDecisionOpen(false)
    toast.info("Local rehearsal recorded", {
      description:
        "No API request, account change or durable audit event was created.",
    })
  }
  return (
    <section
      aria-label="Sample recommendation"
      className="overflow-hidden rounded-2xl border"
    >
      <div className="border-b bg-muted/35 p-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-medium">
            <Sparkles className="size-4" />
            Sample proposal
          </span>
          <Badge variant="outline" className="font-mono text-[8px]">
            v1 · SAMPLE
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              low
                ? "border-warning/20 bg-warning-surface text-[9px] text-warning"
                : "border-success/20 bg-success-surface text-[9px] text-success"
            }
          >
            {humanize(ticket.confidence)} confidence
          </Badge>
          <span className="text-[9px] text-muted-foreground">
            Fixture assessment
          </span>
        </div>
        <h2 className="mt-4 font-heading text-2xl leading-tight font-medium tracking-tight">
          {ticket.recommendation}
        </h2>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          {low
            ? "Verify the missing product mapping before any action. Low confidence blocks approval."
            : "Account records and a published policy support this sample suggestion. A human review is still required."}
        </p>
      </div>
      <div className="space-y-5 p-5">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-medium">Suggested reply</h3>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => setDraft(reply)}
                  />
                }
              >
                <FilePenLine className="mr-1 size-3" />
                Edit draft
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit sample reply</DialogTitle>
                  <DialogDescription>
                    Edits stay in this page. No reply will be sent.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Label htmlFor="reply-draft">Reply draft</Label>
                  <Textarea
                    id="reply-draft"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    maxLength={4000}
                    className="min-h-44"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {draft.length} / 4000 characters
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={!draft.trim()}
                    onClick={() => {
                      setReply(draft.trim())
                      setEditOpen(false)
                      toast.info(
                        "Sample draft updated locally. No message was sent."
                      )
                    }}
                  >
                    Save local draft
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <blockquote className="rounded-xl border bg-muted/20 p-4 text-xs leading-relaxed text-muted-foreground">
            {reply}
          </blockquote>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-muted/40 p-3 text-[10px] leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <p>
            Preview controls rehearse a decision locally. Real decisions require
            authenticated, versioned API validation.
          </p>
        </div>
        {recorded ? (
          <div
            role="status"
            className="rounded-xl border border-success/20 bg-success-surface p-4"
          >
            <p className="flex items-center gap-2 text-xs font-medium text-success">
              <Check className="size-4" />
              Local rehearsal: {recorded}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-success">
              No payment, subscription or access changed. This is not a durable
              audit record.
            </p>
            <Button
              variant="link"
              className="mt-3 h-auto p-0 text-[10px] text-success"
              onClick={() => {
                setRecorded(null)
                setReason("")
              }}
            >
              Reset rehearsal
            </Button>
          </div>
        ) : (
          <>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button className="h-10 w-full text-xs" disabled={low} />
                }
              >
                <Check className="mr-2 size-3.5" />
                Rehearse approval
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Rehearse this approval?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This records a local preview decision for {ticket.reference}
                    . No API request, real refund, subscription change or
                    product access update will occur. The real workflow must
                    recheck evidence, role, latest version and idempotency on
                    the server.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep reviewing</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => record("approval reviewed")}
                  >
                    Confirm local rehearsal
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {low && (
              <p className="-mt-3 text-[10px] text-warning">
                Approval unavailable for low-confidence evidence.
              </p>
            )}
            <Dialog open={decisionOpen} onOpenChange={setDecisionOpen}>
              <DialogTrigger
                render={
                  <Button variant="outline" className="h-10 w-full text-xs" />
                }
              >
                <GitBranch className="mr-2 size-3.5" />
                Reject or escalate
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Review a different next step</DialogTitle>
                  <DialogDescription>
                    Give a reason for this local rehearsal. No real decision
                    will be submitted.
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
                        <SelectItem value="reject">
                          Reject recommendation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="decision-reason">
                      Reason{" "}
                      <span className="text-muted-foreground">(required)</span>
                    </Label>
                    <Textarea
                      id="decision-reason"
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      maxLength={1000}
                      placeholder="Explain what needs a closer look…"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDecisionOpen(false)}
                  >
                    <X className="mr-1 size-3" />
                    Cancel
                  </Button>
                  <Button
                    disabled={!reason.trim()}
                    onClick={() =>
                      record(
                        decision === "reject"
                          ? "recommendation rejected"
                          : "escalated for manual review"
                      )
                    }
                  >
                    Record local decision
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </section>
  )
}
