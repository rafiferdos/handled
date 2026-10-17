"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BookOpen, Plus, Search } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import {
  actionTypes,
  type KnowledgeDocument,
  type KnowledgeInput,
  knowledgeDetailSchema,
} from "@/lib/api/business"
import { useBusinessApi } from "@/features/tickets/use-tickets"
import { humanize } from "@/features/tickets/ticket-status"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PageHeading } from "./page-heading"
import { EmptyState, ErrorState, LoadingState } from "./data-state"
import { useWorkspace } from "./workspace-provider"

type Detail = z.infer<typeof knowledgeDetailSchema>

export function LiveKnowledgeLibrary() {
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const { workspace } = useWorkspace()
  const business = useBusinessApi()
  const cache = useQueryClient()
  const key = ["live", workspace.id, "knowledge"]
  const documents = useQuery({
    queryKey: key,
    queryFn: () => business!.knowledge(),
    enabled: !!business,
  })
  const isAdmin = workspace.role === "ADMIN"
  const filtered =
    documents.data?.data.filter((item) =>
      `${item.title} ${item.slug}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    ) ?? []
  return (
    <>
      <PageHeading
        eyebrow={`${workspace.name} / Knowledge`}
        title="Start with a source you can trust."
        description="Publish versioned policies and review their actual search indexing status."
      />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search knowledge"
            placeholder="Search knowledge…"
            className="workspace-control h-11 rounded-xl bg-card pl-10 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={documents.isFetching}
            onClick={() => void documents.refetch()}
          >
            Refresh
          </Button>
          {isAdmin && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger render={<Button className="h-11" />}>
                <Plus className="size-4" />
                New policy
              </DialogTrigger>
              <DialogContent className="max-h-[90dvh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create a policy</DialogTitle>
                  <DialogDescription>
                    Save a draft, then publish and confirm indexing before using
                    it in investigations.
                  </DialogDescription>
                </DialogHeader>
                <KnowledgeEditor
                  key={String(createOpen)}
                  onSaved={async () => {
                    await cache.invalidateQueries({ queryKey: key })
                    setCreateOpen(false)
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      {!business ? (
        <ErrorState
          title="The workspace connection is unavailable."
          retry={() => window.location.reload()}
        />
      ) : documents.isPending ? (
        <LoadingState />
      ) : documents.isError ? (
        <ErrorState
          title={documents.error.message}
          retry={() => void documents.refetch()}
        />
      ) : !filtered.length ? (
        <EmptyState
          title="No policies here."
          description={
            search
              ? "Try a different search."
              : isAdmin
                ? "Create and publish your first workspace policy."
                : "An administrator can publish policies for this workspace."
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((document) => (
            <KnowledgeCard
              key={document.id}
              document={document}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
      {documents.data?.meta.hasNext && (
        <p className="mt-5 text-sm text-muted-foreground">
          Showing the latest 100 documents.
        </p>
      )}
    </>
  )
}

function KnowledgeCard({
  document,
  isAdmin,
}: {
  document: KnowledgeDocument
  isAdmin: boolean
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const { workspace } = useWorkspace()
  const business = useBusinessApi()
  const cache = useQueryClient()
  const key = ["live", workspace.id, "knowledge", document.id]
  const detail = useQuery({
    queryKey: key,
    queryFn: () => business!.knowledgeDetail(document.id),
    enabled: !!business && open,
    refetchInterval: (query) =>
      query.state.data?.data.publishedRevision?.indexStatus === "PENDING"
        ? 2500
        : false,
  })
  const refresh = async () => {
    await cache.invalidateQueries({
      queryKey: ["live", workspace.id, "knowledge"],
    })
  }
  const mutation = useMutation({
    mutationFn: async (kind: "publish" | "reindex"): Promise<unknown> =>
      kind === "publish"
        ? business!.publishKnowledge(document.id, detail.data!.data.version)
        : business!.reindexKnowledge(document.id, detail.data!.data.version),
    onSuccess: async () => {
      await refresh()
      toast.success("Indexing requested", {
        description:
          "Check the recorded index status before using this policy.",
      })
    },
    onError: async (error) => {
      toast.error(error.message)
      await refresh()
    },
  })
  const data = detail.data?.data
  return (
    <Card className="workspace-panel flex h-full flex-col rounded-2xl">
      <CardHeader>
        <div className="mb-7 flex items-center justify-between">
          <span className="flex size-11 items-center justify-center rounded-xl border border-signal/15 bg-signal-surface">
            <BookOpen className="size-5 text-signal" />
          </span>
          <Badge variant="outline">{humanize(document.status)}</Badge>
        </div>
        <CardTitle className="font-heading text-xl leading-tight font-medium tracking-tight">
          {document.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="text-[13px] text-muted-foreground">
          Draft v{document.version} ·{" "}
          {document.publishedVersion
            ? `Published v${document.publishedVersion}`
            : "Not published"}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t pt-3">
          <span className="min-w-0 font-mono text-xs break-all text-muted-foreground">
            {document.slug}
          </span>
          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value)
              if (!value) setEditing(false)
            }}
          >
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  className="h-11 shrink-0 rounded-xl px-2 text-[13px] text-signal"
                  aria-label={`Read ${document.title}`}
                />
              }
            >
              Read policy
            </DialogTrigger>
            <DialogContent className="max-h-[90dvh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{document.title}</DialogTitle>
                <DialogDescription>
                  Versioned workspace policy · {document.slug}
                </DialogDescription>
              </DialogHeader>
              {detail.isPending ? (
                <LoadingState />
              ) : detail.isError ? (
                <ErrorState
                  title={detail.error.message}
                  retry={() => void detail.refetch()}
                />
              ) : (
                data &&
                (editing ? (
                  <KnowledgeEditor
                    document={data}
                    onSaved={async () => {
                      await refresh()
                      setEditing(false)
                    }}
                  />
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {humanize(data.status)} · v{data.version}
                      </Badge>
                      <Badge variant="outline">
                        Index:{" "}
                        {data.publishedRevision
                          ? humanize(data.publishedRevision.indexStatus)
                          : "Not published"}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                      {data.body}
                    </p>
                    <div className="rounded-xl border bg-muted/20 p-4 text-xs leading-relaxed">
                      <p>
                        Allowed actions:{" "}
                        {data.policyRules.allowedActions.length
                          ? data.policyRules.allowedActions
                              .map(humanize)
                              .join(", ")
                          : "None"}
                      </p>
                      {data.policyRules.maxRefundMinor !== undefined && (
                        <p className="mt-2">
                          Maximum refund: {data.policyRules.maxRefundMinor}{" "}
                          minor units
                        </p>
                      )}
                      {data.publishedRevision?.embeddingModel && (
                        <p className="mt-2">
                          Embedding model:{" "}
                          {data.publishedRevision.embeddingModel}
                        </p>
                      )}
                      {data.publishedRevision?.failureCode && (
                        <p role="alert" className="mt-2 text-warning">
                          Indexing failed:{" "}
                          {humanize(data.publishedRevision.failureCode)}.
                        </p>
                      )}
                      <p className="mt-2 text-muted-foreground">
                        {data.publishedRevision?.indexStatus === "READY"
                          ? `Published version ${data.publishedVersion} is indexed for retrieval.`
                          : "Publishing admits indexing work. This policy is searchable after its recorded index status is Ready."}
                      </p>
                    </div>
                    {mutation.isError && (
                      <p role="alert" className="text-sm text-warning">
                        {mutation.error.message}
                      </p>
                    )}
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => void detail.refetch()}
                      >
                        Refresh status
                      </Button>
                      {isAdmin && (
                        <>
                          <Button
                            variant="outline"
                            disabled={mutation.isPending}
                            onClick={() => setEditing(true)}
                          >
                            Edit policy
                          </Button>
                          {data.status === "PUBLISHED" &&
                          data.publishedVersion === data.version ? (
                            <Button
                              disabled={
                                mutation.isPending ||
                                data.publishedRevision?.indexStatus ===
                                  "PENDING"
                              }
                              onClick={() => mutation.mutate("reindex")}
                            >
                              {mutation.isPending ? "Requesting…" : "Reindex"}
                            </Button>
                          ) : (
                            <Button
                              disabled={mutation.isPending}
                              onClick={() => mutation.mutate("publish")}
                            >
                              {mutation.isPending
                                ? "Publishing…"
                                : "Publish version"}
                            </Button>
                          )}
                        </>
                      )}
                    </DialogFooter>
                  </>
                ))
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

function KnowledgeEditor({
  document,
  onSaved,
}: {
  document?: Detail
  onSaved: () => Promise<void>
}) {
  const business = useBusinessApi()
  const [slug, setSlug] = useState(document?.slug ?? "")
  const [title, setTitle] = useState(document?.title ?? "")
  const [body, setBody] = useState(document?.body ?? "")
  const [allowedActions, setAllowedActions] = useState<
    KnowledgeInput["policyRules"]["allowedActions"]
  >(document?.policyRules.allowedActions ?? [])
  const [maxRefund, setMaxRefund] = useState(
    document?.policyRules.maxRefundMinor?.toString() ?? ""
  )
  const refundSelected = allowedActions.includes("REFUND_DUPLICATE_PAYMENT")
  const validRefund =
    !refundSelected ||
    (Number.isInteger(Number(maxRefund)) &&
      Number(maxRefund) > 0 &&
      Number(maxRefund) <= 2147483647)
  const mutation = useMutation({
    mutationFn: () => {
      const input: KnowledgeInput = {
        slug: slug.trim(),
        title: title.trim(),
        body: body.trim(),
        policyRules: {
          allowedActions,
          ...(refundSelected ? { maxRefundMinor: Number(maxRefund) } : {}),
          ...(document?.policyRules.deniedActions
            ? { deniedActions: document.policyRules.deniedActions }
            : {}),
        },
      }
      return document
        ? business!.updateKnowledge(document.id, document.version, input)
        : business!.createKnowledge(input)
    },
    onSuccess: async () => {
      await onSaved()
      toast.success("Policy draft saved")
    },
    onError: (error) => toast.error(error.message),
  })
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        mutation.mutate()
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="policy-title">Title</Label>
        <Input
          id="policy-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          maxLength={256}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="policy-slug">Reference slug</Label>
        <Input
          id="policy-slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          required
          minLength={3}
          maxLength={100}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          placeholder="duplicate-payment-policy"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="policy-body">Policy text</Label>
        <Textarea
          id="policy-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
          maxLength={100000}
          className="min-h-44"
        />
      </div>
      <fieldset className="space-y-3">
        <legend className="mb-3 text-sm font-medium">Allowed actions</legend>
        {actionTypes.map((action) => (
          <Label
            key={action}
            className="flex min-h-9 cursor-pointer items-center gap-3"
          >
            <Checkbox
              checked={allowedActions.includes(action)}
              onCheckedChange={(checked) =>
                setAllowedActions((current) =>
                  checked
                    ? [...current, action]
                    : current.filter((item) => item !== action)
                )
              }
            />
            {humanize(action)}
          </Label>
        ))}
      </fieldset>
      {refundSelected && (
        <div className="space-y-2">
          <Label htmlFor="max-refund">
            Maximum refund in minor currency units
          </Label>
          <Input
            id="max-refund"
            type="number"
            min={1}
            max={2147483647}
            step={1}
            value={maxRefund}
            onChange={(event) => setMaxRefund(event.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            For example, 10000 means 100.00 in a currency with two decimal
            places.
          </p>
        </div>
      )}
      {mutation.isError && (
        <p role="alert" className="text-sm text-warning">
          {mutation.error.message}
        </p>
      )}
      <DialogFooter>
        <Button
          type="submit"
          disabled={
            !business ||
            !title.trim() ||
            !body.trim() ||
            !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim()) ||
            slug.trim().length < 3 ||
            !validRefund ||
            mutation.isPending
          }
        >
          {mutation.isPending ? "Saving…" : "Save draft"}
        </Button>
      </DialogFooter>
    </form>
  )
}
