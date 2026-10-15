"use client"

import {
  ArrowUpRight,
  BookOpen,
  Check,
  CircleHelp,
  FileCheck2,
  Layers3,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrandMark } from "@/components/shared/brand"
import { ButtonLink } from "@/components/shared/button-link"
import type { TicketPreview } from "@/lib/api/schemas"
import { GlassFold } from "./glass-fold"

export type ShowcaseCopy = {
  label: string
  outcome: string
  explanation: string
  evidenceNotes: [string, string]
  signal: string
}

export function SampleShowcase({
  cases,
}: {
  cases: { ticket: TicketPreview; copy: ShowcaseCopy }[]
}) {
  return (
    <Tabs
      defaultValue={cases[0]?.ticket.reference}
      className="sample-tabs gap-5"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2.5 font-mono text-[10px] tracking-wider text-[#b5c1c7] uppercase">
          <span className="size-1.5 rounded-full bg-[#90bba8]" /> Choose a
          sample case
        </p>
        <TabsList
          aria-label="Explore sample support cases"
          className="grid w-full grid-cols-3 gap-1 rounded-full bg-white/5 p-1 group-data-horizontal/tabs:h-auto sm:w-auto"
        >
          {cases.map(({ ticket, copy }) => (
            <TabsTrigger
              key={ticket.reference}
              value={ticket.reference}
              className="min-h-11 min-w-0 rounded-full px-3 py-2 text-[10px] whitespace-normal sm:min-h-10 sm:px-5 sm:text-[11px]"
            >
              {copy.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <GlassFold>
        <div className="case-stage p-2 sm:p-3">
          <div className="overflow-hidden rounded-[1.2rem] border border-white/15 bg-[#f4f6f5] text-[#1d282e]">
            <div className="flex h-11 items-center justify-between border-b border-black/8 bg-white/80 px-4">
              <div className="flex gap-1.5" aria-hidden="true">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="size-2 rounded-full bg-[#ccd3d4]"
                  />
                ))}
              </div>
              <span className="font-mono text-[9px] text-[#62727a]">
                handled / acme-cloud / sample workspace
              </span>
              <ShieldCheck
                aria-hidden="true"
                className="size-3.5 text-[#62727a]"
              />
            </div>
            <div className="flex">
              <aside
                aria-hidden="true"
                className="hidden w-44 shrink-0 flex-col border-r border-black/8 bg-[#eaf0ed] p-4 md:flex"
              >
                <div className="mb-8 flex items-center gap-2 font-heading text-sm font-medium">
                  <BrandMark className="size-5" />
                  AcmeCloud
                </div>
                {[
                  { icon: MessageSquare, label: "Inbox", active: true },
                  { icon: Sparkles, label: "Investigations" },
                  { icon: BookOpen, label: "Knowledge" },
                  { icon: FileCheck2, label: "Activity" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`mb-1 flex items-center gap-2 rounded-lg px-2.5 py-2.5 text-[11px] ${item.active ? "bg-white font-medium shadow-xs" : "text-[#62727a]"}`}
                  >
                    <item.icon className="size-3.5" />
                    {item.label}
                    {item.active && (
                      <span className="ml-auto text-[9px]">3</span>
                    )}
                  </div>
                ))}
                <div className="mt-auto pt-10">
                  <div className="rounded-xl border border-black/7 bg-white/60 p-3 text-[10px] leading-relaxed text-[#62727a]">
                    <ShieldCheck className="mb-2 size-4" />
                    Your workspace.
                    <br />
                    Your evidence.
                    <br />
                    Your decision.
                  </div>
                </div>
              </aside>
              <div className="min-w-0 flex-1">
                {cases.map(({ ticket, copy }) => {
                  const incomplete = ticket.confidence === "LOW"
                  return (
                    <TabsContent
                      key={ticket.reference}
                      value={ticket.reference}
                      className="case-panel m-0 min-h-[560px] p-5 sm:min-h-[475px] sm:p-7 lg:p-8"
                    >
                      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <p className="font-mono text-[10px] text-[#62727a]">
                          {ticket.reference}{" "}
                          <span className="mx-2 text-[#9aa7ad]">/</span>{" "}
                          Illustrative workflow
                        </p>
                        <Badge
                          variant="outline"
                          className={
                            incomplete
                              ? "border-[#dfd1b0] bg-[#f3eddf] text-[10px] text-[#71571f]"
                              : "border-[#ccdad2] bg-[#e6eee8] text-[10px] text-[#375c4e]"
                          }
                        >
                          {incomplete
                            ? "Needs manual review"
                            : ticket.status === "NEW"
                              ? "New case"
                              : "Awaiting review"}
                        </Badge>
                      </div>
                      <div className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-black/7 bg-white text-[10px] font-medium text-[#62727a]"
                        >
                          {ticket.customer.initials}
                        </span>
                        <div>
                          <p className="mb-2 text-[10px] text-[#62727a]">
                            {ticket.customer.name}{" "}
                            <span className="mx-1.5">·</span> {ticket.category}
                          </p>
                          <h3 className="max-w-xl font-heading text-[1.4rem] leading-[1.2] font-medium tracking-tight sm:text-3xl">
                            “{ticket.subject}”
                          </h3>
                        </div>
                      </div>
                      <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                        <div>
                          <p className="mb-3 flex items-center gap-2 text-[11px] font-medium">
                            <Layers3 className="size-3.5" />
                            The context behind the answer
                          </p>
                          <div className="space-y-2.5">
                            {ticket.evidence.map((source, index) => (
                              <div
                                key={source.reference}
                                className="rounded-xl border border-black/8 bg-white p-3.5"
                              >
                                <div className="flex items-center gap-2 text-[11px] font-medium">
                                  {source.kind === "policy" ? (
                                    <BookOpen className="size-3.5 shrink-0 text-[#4c7465]" />
                                  ) : (
                                    <FileCheck2 className="size-3.5 shrink-0 text-[#4c7465]" />
                                  )}
                                  {source.title}
                                </div>
                                <p className="mt-2 text-[11px] leading-relaxed text-[#62727a]">
                                  {copy.evidenceNotes[index]}
                                </p>
                                <p className="mt-2 font-mono text-[9px] text-[#62727a]">
                                  {source.reference}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div
                          className={`flex flex-col rounded-xl border p-4 sm:p-5 ${incomplete ? "border-[#dfd1b0] bg-[#f3eddf]" : "border-[#c9d8ce] bg-[#e5eee7]"}`}
                        >
                          <p className="flex items-center gap-2 text-[11px] font-medium">
                            {incomplete ? (
                              <CircleHelp className="size-3.5" />
                            ) : (
                              <Sparkles className="size-3.5" />
                            )}
                            A thoughtful next step
                          </p>
                          <p className="mt-4 max-w-[265px] font-heading text-2xl leading-[1.15] tracking-tight">
                            {copy.outcome}
                          </p>
                          <p className="mt-3 text-[11px] leading-relaxed text-[#53675c]">
                            {copy.explanation}
                          </p>
                          <p className="mt-5 flex items-start gap-1.5 text-[10px] leading-relaxed">
                            {incomplete ? (
                              <CircleHelp className="mt-0.5 size-3 shrink-0" />
                            ) : (
                              <Check className="mt-0.5 size-3 shrink-0" />
                            )}
                            {copy.signal}
                          </p>
                          <ButtonLink
                            href={`/tickets/${ticket.id}`}
                            className="mt-4 h-10 w-full justify-between rounded-lg bg-[#233d33] px-3 text-[11px] text-white hover:bg-[#345345]"
                          >
                            Inspect sample case
                            <ArrowUpRight className="size-3.5" />
                          </ButtonLink>
                        </div>
                      </div>
                      <p className="mt-5 flex items-center gap-2 text-[10px] text-[#62727a]">
                        <ShieldCheck className="size-3 shrink-0" />
                        Sample evidence. No account changes or real actions.
                      </p>
                    </TabsContent>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </GlassFold>
    </Tabs>
  )
}
