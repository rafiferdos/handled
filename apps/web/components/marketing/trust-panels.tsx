import {
  ArrowDown,
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
      className="relative mx-auto h-[245px] w-full max-w-[430px]"
    >
      <div className="absolute inset-x-12 inset-y-5 rounded-full border border-dashed border-foreground/10" />
      <svg
        className="absolute inset-0 size-full text-border"
        viewBox="0 0 430 245"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M100 60C180 60 165 122 215 122M330 60C250 60 265 122 215 122M215 210V122"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="215"
          cy="122"
          r="47"
          stroke="currentColor"
          strokeDasharray="3 6"
        />
      </svg>
      <div className="absolute top-[calc(50%-27px)] left-[calc(50%-27px)] flex size-[54px] items-center justify-center rounded-2xl border bg-background shadow-[0_8px_24px_-10px_var(--border)]">
        <BrandMark className="size-7" />
      </div>
      <div className="absolute top-6 left-0 w-[45%] rotate-[-4deg] rounded-xl border bg-background p-3 shadow-xs">
        <p className="flex items-center gap-2 text-[11px] font-medium">
          <MessageSquare className="size-3.5 text-muted-foreground" />
          The question
        </p>
        <p className="mt-2 text-[10px] text-muted-foreground">
          “I was charged twice.”
        </p>
      </div>
      <div className="absolute top-6 right-0 w-[43%] rotate-[4deg] rounded-xl border bg-background p-3 shadow-xs">
        <p className="flex items-center gap-2 text-[11px] font-medium">
          <FileCheck2 className="size-3.5 text-muted-foreground" />
          Account context
        </p>
        <p className="mt-2 font-mono text-[9px] text-muted-foreground">
          PAY-9001 / PAY-9002
        </p>
      </div>
      <div className="absolute bottom-0 left-[22%] w-[57%] rounded-xl border bg-background p-3 shadow-xs">
        <p className="flex items-center gap-2 text-[11px] font-medium">
          <BookOpen className="size-3.5 text-muted-foreground" />
          Published knowledge
        </p>
        <p className="mt-2 font-mono text-[9px] text-muted-foreground">
          KB-REFUND · version 1
        </p>
      </div>
    </div>
  )
}

function DecisionDiagram() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex h-[245px] w-full max-w-[320px] flex-col items-center justify-center"
    >
      <div className="flex w-[85%] items-center gap-3 rounded-xl border bg-background px-4 py-3">
        <Sparkles className="size-4 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-[11px] font-medium">A recommendation</p>
          <p className="mt-1 text-[9px] text-muted-foreground">
            Sources attached. Ready to inspect.
          </p>
        </div>
        <Check className="size-3.5 text-success" />
      </div>
      <div className="flex h-10 items-center border-x border-dashed px-5">
        <ArrowDown className="size-3.5 text-muted-foreground" />
      </div>
      <div className="relative w-full rounded-2xl border border-success/25 bg-success-surface/70 p-4 shadow-xs">
        <span className="absolute -top-2.5 right-4 rounded-full border border-success/20 bg-background px-2.5 py-1 font-mono text-[8px] text-success uppercase">
          Human decision
        </span>
        <p className="flex items-center gap-2 text-xs font-medium">
          <ShieldCheck className="size-4 text-success" />
          You have the final word.
        </p>
        <div className="mt-4 flex gap-1.5">
          {["Review", "Edit", "Escalate"].map((label) => (
            <span
              key={label}
              className="flex-1 rounded-md border border-success/15 bg-background/70 px-2 py-2 text-center text-[9px]"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TrustPanels() {
  return (
    <div className="mt-12 grid gap-5 md:grid-cols-12 md:gap-6">
      <Reveal className="md:col-span-7">
        <Card className="material-panel h-full gap-0 p-6 shadow-none ring-0 sm:p-8">
          <CardContent className="p-0">
            <div className="mb-7">
              <span className="eyebrow text-muted-foreground">
                01 / Connected context
              </span>
              <h3 className="mt-3 max-w-sm font-heading text-[1.75rem] leading-[1.12] font-medium tracking-[-0.035em] sm:text-3xl">
                The whole story.
                <br />
                Finally in the same place.
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                The question, account records and published policies, brought
                together around one conversation.
              </p>
            </div>
            <ContextDiagram />
          </CardContent>
        </Card>
      </Reveal>
      <Reveal delay={0.08} className="md:col-span-5">
        <Card className="material-panel h-full gap-0 p-6 shadow-none ring-0 sm:p-8">
          <CardContent className="p-0">
            <div className="mb-7">
              <span className="eyebrow text-muted-foreground">
                02 / Deliberate control
              </span>
              <h3 className="mt-3 font-heading text-[1.75rem] leading-[1.12] font-medium tracking-[-0.035em] sm:text-3xl">
                A little intelligence.
                <br />A lot of human judgment.
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Check the evidence, refine the reply and choose what comes next.
                Uncertainty stays visible.
              </p>
            </div>
            <DecisionDiagram />
          </CardContent>
        </Card>
      </Reveal>
      <Reveal className="md:col-span-12">
        <Card className="material-panel gap-0 p-6 shadow-none ring-0 sm:p-8">
          <CardContent className="grid items-center gap-7 p-0 md:grid-cols-[0.85fr_1.15fr] md:gap-12">
            <div>
              <p className="eyebrow mb-3 text-muted-foreground">
                03 / A traceable answer
              </p>
              <h3 className="font-heading text-2xl font-medium tracking-[-0.035em] sm:text-3xl">
                Less “trust me.”
                <br />
                More “here’s the source.”
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border bg-background/70 p-3.5">
                <BookOpen className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium">Duplicate-charge policy</p>
                  <p className="mt-1 font-mono text-[9px] text-muted-foreground">
                    KB-REFUND-v1 / Published sample
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 border-success/20 text-[9px] text-success"
                >
                  <Check className="mr-1 size-3" />
                  Referenced
                </Badge>
              </div>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Fingerprint className="mt-0.5 size-3.5 shrink-0" />
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
