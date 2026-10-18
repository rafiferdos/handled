"use client"

import { useState } from "react"
import { ArrowUpRight, BookOpen, FileText, Search } from "lucide-react"
import { PageHeading } from "./page-heading"
import { EmptyState } from "./data-state"
import { useWorkspace } from "./workspace-provider"
import { sampleTickets } from "@/lib/api/fixtures"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LiveKnowledgeLibrary } from "./live-knowledge-library"

export function KnowledgeLibrary() {
  const { mode } = useWorkspace()
  return mode === "live" ? <LiveKnowledgeLibrary /> : <SampleKnowledgeLibrary />
}

function SampleKnowledgeLibrary() {
  const [search, setSearch] = useState("")
  const { workspace } = useWorkspace()
  const policies = sampleTickets
    .filter((ticket) => ticket.workspaceId === workspace.id)
    .flatMap((ticket) =>
      ticket.evidence.filter((source) => source.kind === "policy")
    )
    .filter((source) =>
      `${source.title} ${source.reference}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    )
  return (
    <>
      <PageHeading
        eyebrow={`${workspace.name} / Knowledge`}
        title="Start with a source you can trust."
        description="Review policies and source references for this workspace’s support cases."
      />
      <div className="relative mb-8 max-w-sm">
        <Search className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search knowledge"
          placeholder="Search knowledge…"
          className="workspace-control h-11 rounded-xl bg-card pl-10 text-sm"
        />
      </div>
      {!policies.length ? (
        <EmptyState
          title="No policies here."
          description={
            search
              ? "Try a different search."
              : "Knowledge from other workspaces remains separate."
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {policies.map((source) => (
            <Card
              key={source.reference}
              className="workspace-panel flex h-full flex-col rounded-2xl"
            >
              <CardHeader>
                <div className="mb-7 flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-signal/15 bg-signal-surface">
                    <BookOpen className="size-5 text-signal" />
                  </span>
                  <Badge
                    variant="outline"
                    className="border-success/20 bg-success-surface text-xs text-success"
                  >
                    Published
                  </Badge>
                </div>
                <CardTitle className="font-heading text-xl leading-tight font-medium tracking-tight">
                  {source.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="flex-1 text-[13px] leading-[1.75] text-muted-foreground">
                  {source.detail}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t pt-3">
                  <span className="min-w-0 font-mono text-xs break-all text-muted-foreground">
                    {source.reference}
                  </span>
                  <Dialog>
                    <DialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          className="h-11 shrink-0 rounded-xl px-2 text-[13px] text-signal"
                          aria-label={`Read ${source.title}`}
                        />
                      }
                    >
                      Read policy <ArrowUpRight className="ml-1 size-3.5" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{source.title}</DialogTitle>
                        <DialogDescription>
                          Published · {source.reference}
                        </DialogDescription>
                      </DialogHeader>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {source.detail}
                      </p>
                      <p className="rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                        This policy belongs to the workspace preview. Document
                        publishing is not available yet.
                      </p>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-dashed bg-muted/15 p-5 text-[13px] leading-relaxed text-muted-foreground">
        <FileText className="mt-0.5 size-4 shrink-0" />
        <p>Document editing and publishing are not available yet.</p>
      </div>
    </>
  )
}
