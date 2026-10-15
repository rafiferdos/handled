import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Check,
  FileCheck2,
  Fingerprint,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrandMark } from "@/components/shared/brand"
import { Reveal } from "@/components/motion/reveal"

function ContextDiagram() {
  return (
    <div
      aria-hidden="true"
      className="story-context-diagram relative mx-auto h-[270px] w-full max-w-[470px] sm:h-[290px]"
    >
      <div className="absolute inset-x-[15%] top-1/2 h-px bg-border" />
      <div className="absolute top-8 bottom-6 left-1/2 w-px bg-border" />
      <div className="absolute top-[37%] left-1/2 flex size-20 -translate-x-1/2 items-center justify-center rounded-full border border-signal/25 bg-signal-surface ring-8 ring-background/70">
        <BrandMark className="size-8 text-signal" />
      </div>
      <div className="story-context-question absolute top-2 left-0 w-[48%] rounded-xl border bg-background p-3.5 sm:w-[44%] sm:p-4">
        <p className="flex items-center gap-2 text-[11px] font-medium">
          <MessageSquare className="size-3.5 text-signal" />
          The question
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          “I was charged twice.”
        </p>
        <div className="mt-3 h-px bg-border" />
        <p className="mt-2 font-mono text-[8px] text-muted-foreground">
          TKT-1001 / SAMPLE
        </p>
      </div>
      <div className="story-context-record absolute top-7 right-0 w-[46%] rounded-xl border bg-background p-3.5 sm:w-[42%] sm:p-4">
        <p className="flex items-center gap-2 text-[11px] font-medium">
          <FileCheck2 className="size-3.5 text-signal" />
          Account context
        </p>
        <div className="mt-3 space-y-1.5 font-mono text-[9px] text-muted-foreground">
          <p className="flex justify-between gap-2">
            PAY-9001 <Check className="size-3 text-signal" />
          </p>
          <p className="flex justify-between gap-2">
            PAY-9002 <Check className="size-3 text-signal" />
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-[15%] w-[70%] rounded-xl border bg-background p-4 sm:left-[20%] sm:w-[60%]">
        <p className="flex items-center gap-2 text-[11px] font-medium">
          <BookOpen className="size-3.5 text-signal" />
          Published knowledge
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="font-mono text-[9px] text-muted-foreground">
            KB-REFUND · version 1
          </p>
          <span className="size-1.5 rounded-full bg-signal" />
        </div>
      </div>
    </div>
  )
}

function DecisionDiagram() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex h-[270px] w-full max-w-[330px] flex-col items-center justify-center sm:h-[290px]"
    >
      <div className="flex w-[90%] items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5">
        <Sparkles className="story-signal-on-ink size-4" />
        <div className="flex-1">
          <p className="text-[11px] font-medium">A recommendation</p>
          <p className="mt-1.5 text-[9px] text-white/55">
            Sources attached. Ready to inspect.
          </p>
        </div>
        <Check className="story-signal-on-ink size-3.5" />
      </div>
      <div className="flex h-10 items-center border-x border-dashed border-white/15 px-5">
        <ArrowDown className="size-3.5 text-white/45" />
      </div>
      <div className="relative w-full rounded-2xl border border-white/20 bg-white/[0.06] p-4 sm:p-5">
        <span className="story-signal-on-ink story-chip-on-ink absolute -top-2.5 right-4 rounded-full border px-2.5 py-1 font-mono text-[8px] uppercase">
          Human decision
        </span>
        <p className="flex items-center gap-2 text-xs font-medium">
          <ShieldCheck className="story-signal-on-ink size-4" />
          You have the final word.
        </p>
        <div className="mt-5 flex gap-1.5">
          {["Review", "Edit", "Escalate"].map((label, index) => (
            <span
              key={label}
              className={
                index === 0
                  ? "story-choice-active flex-1 rounded-lg border px-2 py-2.5 text-center text-[9px]"
                  : "flex-1 rounded-lg border border-white/10 px-2 py-2.5 text-center text-[9px] text-white/65"
              }
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 font-mono text-[8px] tracking-[0.16em] text-white/45 uppercase">
        Judgment stays with you
      </p>
    </div>
  )
}

export function TrustPanels() {
  return (
    <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-12 md:gap-5">
      <Reveal preset="panel" className="min-w-0 md:col-span-7">
        <Card className="story-trust-context material-panel relative h-full gap-0 p-6 shadow-none ring-0 sm:p-9">
          <CardContent className="relative p-0">
            <div className="mb-8 flex items-center justify-between border-b pb-4">
              <span className="eyebrow text-muted-foreground">
                Connected context
              </span>
              <span className="font-mono text-xs text-signal">01 /</span>
            </div>
            <h3 className="max-w-sm font-heading text-[2rem] leading-[1.08] font-medium tracking-[-0.045em] sm:text-[2.7rem] md:text-[clamp(1.8rem,3vw,2.7rem)]">
              The whole story.
              <br />
              Finally in the same place.
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The question, account records and published policies, brought
              together around one conversation.
            </p>
            <div className="mt-8 sm:mt-10">
              <ContextDiagram />
            </div>
            <p className="mt-6 flex items-center gap-2 font-mono text-[9px] text-muted-foreground uppercase">
              <span className="size-1.5 rounded-full bg-signal" />
              Three sources. One connected view.
            </p>
          </CardContent>
        </Card>
      </Reveal>
      <Reveal preset="panel" delay={0.08} className="min-w-0 md:col-span-5">
        <Card className="story-ink relative h-full gap-0 border p-6 shadow-none ring-0 sm:p-9">
          <CardContent className="p-0">
            <div className="mb-8 flex items-center justify-between border-b border-white/15 pb-4">
              <span className="eyebrow text-white/55">Deliberate control</span>
              <span className="story-signal-on-ink font-mono text-xs">
                02 /
              </span>
            </div>
            <h3 className="font-heading text-[2rem] leading-[1.08] font-medium tracking-[-0.045em] sm:text-[2.7rem] md:text-[clamp(1.8rem,3vw,2.7rem)]">
              A little intelligence.
              <br />A lot of human judgment.
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Check the evidence, refine the reply and choose what comes next.
              Uncertainty stays visible.
            </p>
            <div className="mt-8 sm:mt-10">
              <DecisionDiagram />
            </div>
          </CardContent>
        </Card>
      </Reveal>
      <Reveal preset="rise" className="md:col-span-12">
        <Card className="material-panel gap-0 p-6 shadow-none ring-0 sm:p-9">
          <CardContent className="grid items-center gap-8 p-0 md:grid-cols-[0.95fr_1.05fr] md:gap-16">
            <div className="flex items-start gap-5 sm:gap-7">
              <span
                aria-hidden="true"
                className="story-chapter-number font-heading text-[3.5rem] leading-none font-medium tracking-[-0.08em] sm:text-7xl"
              >
                03
              </span>
              <div>
                <p className="eyebrow mb-3 text-muted-foreground">
                  A traceable answer
                </p>
                <h3 className="font-heading text-2xl leading-[1.1] font-medium tracking-[-0.04em] sm:text-3xl">
                  Less “trust me.”
                  <br />
                  More “here’s the source.”
                </h3>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 rounded-xl border bg-background/80 p-4 sm:gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-signal/15 bg-signal-surface">
                  <BookOpen className="size-4 text-signal" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium">Duplicate-charge policy</p>
                  <p className="mt-1.5 font-mono text-[8px] text-muted-foreground sm:text-[9px]">
                    KB-REFUND-v1 / Published sample
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 border-signal/20 text-[9px] text-signal"
                >
                  <Check className="mr-1 size-3" />
                  <span className="hidden sm:inline">Referenced</span>
                  <ArrowUpRight className="size-3 sm:hidden" />
                </Badge>
              </div>
              <p className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
                <Fingerprint className="mt-0.5 size-3.5 shrink-0 text-signal" />
                Every recommendation should lead back to the records and
                policies that support it.
              </p>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  )
}
