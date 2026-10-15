import {
  ArrowUpRight,
  BookOpen,
  Check,
  CircleCheck,
  Command,
  FileCheck2,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BrandMark } from "@/components/shared/brand"
import { GlassFold } from "./glass-fold"

const evidence = [
  {
    icon: CircleCheck,
    title: "Account context",
    detail: "Two settled charges · same billing period",
    ref: "PAY-9001 / PAY-9002",
  },
  {
    icon: BookOpen,
    title: "Published refund policy",
    detail: "Duplicate payment eligible for review",
    ref: "KB-REFUND · version 1",
  },
]

export function ProductPreview() {
  return (
    <GlassFold>
      <div className="relative rounded-[1.75rem] border border-white/15 bg-white/5 p-2 shadow-[0_40px_100px_-45px_rgb(0_0_0/0.7)] sm:p-3">
        <div className="pointer-events-none absolute -top-px right-12 left-12 h-px bg-linear-to-r from-transparent via-white/80 to-transparent" />
        <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#f5f6f6] text-[#1d282e]">
          <div className="flex h-11 items-center justify-between border-b border-black/8 bg-white/80 px-4">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2 rounded-full bg-[#bcc3c5]" />
              <span className="size-2 rounded-full bg-[#d3d8da]" />
              <span className="size-2 rounded-full bg-[#e1e5e6]" />
            </div>
            <span className="font-mono text-[9px] text-[#667780]">
              handled / acme-cloud / TKT-1001
            </span>
            <Command className="size-3 text-[#667780]" />
          </div>
          <div className="flex min-h-[440px]">
            <aside className="hidden w-44 shrink-0 flex-col border-r border-black/8 bg-[#ecf0f0] p-4 sm:flex">
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
                  className={`mb-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] ${item.active ? "bg-white font-medium shadow-xs" : "text-[#667780]"}`}
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                  {item.active && <span className="ml-auto text-[9px]">3</span>}
                </div>
              ))}
              <div className="mt-auto rounded-xl border border-black/7 bg-white/60 p-3 text-[10px] leading-relaxed text-[#667780]">
                <ShieldCheck className="mb-2 size-4" />
                Your workspace.
                <br />
                Your evidence.
                <br />
                Your decision.
              </div>
            </aside>
            <div className="min-w-0 flex-1 p-5 sm:p-7 lg:p-8">
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-mono text-[9px] text-[#667780]">
                  <span>TKT-1001</span>
                  <span>/</span>
                  <span>Illustrative workflow</span>
                </div>
                <Badge className="border-[#cfddd7] bg-[#e7efeb] text-[9px] text-[#375c4e]">
                  Awaiting review
                </Badge>
              </div>
              <h3 className="max-w-md font-heading text-2xl leading-tight font-medium tracking-tight sm:text-3xl">
                “I was charged twice
                <br className="hidden lg:block" /> for my Pro plan.”
              </h3>
              <p className="mt-3 text-[11px] text-[#667780]">
                Maya Rahman <span className="mx-2">·</span> Billing{" "}
                <span className="mx-2">·</span> Sample ticket
              </p>
              <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-medium">
                    <Search className="size-3.5" />
                    Evidence, brought together
                  </div>
                  <div className="space-y-2">
                    {evidence.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-xl border border-black/8 bg-white p-3.5"
                      >
                        <div className="flex items-center gap-2 text-[11px] font-medium">
                          <item.icon className="size-3.5 text-[#4c7465]" />
                          {item.title}
                        </div>
                        <p className="mt-2 text-[10px] text-[#667780]">
                          {item.detail}
                        </p>
                        <p className="mt-2 font-mono text-[8px] text-[#667780]">
                          {item.ref}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col rounded-xl border border-[#c9d6d0] bg-[#e8efeb] p-4">
                  <div className="flex items-center gap-2 text-[11px] font-medium">
                    <Sparkles className="size-3.5" />
                    Suggested next step
                  </div>
                  <p className="mt-4 font-heading text-xl leading-tight tracking-tight">
                    Review a $29.00
                    <br />
                    duplicate refund.
                  </p>
                  <p className="mt-3 text-[10px] leading-relaxed text-[#567065]">
                    Based on account records and the published policy. Nothing
                    happens without your approval.
                  </p>
                  <div className="mt-5 flex items-center gap-1.5 text-[9px] text-[#375c4e]">
                    <Check className="size-3" />2 source references
                  </div>
                  <Link
                    href="/tickets/10000000-0000-4000-8000-000000001001"
                    className="mt-4 flex items-center justify-between rounded-lg bg-[#233d33] px-3 py-2.5 text-[10px] font-medium text-white hover:bg-[#345345] focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Inspect sample case
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassFold>
  )
}
