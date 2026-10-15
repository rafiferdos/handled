import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  FileCheck2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import { ButtonLink } from "@/components/shared/button-link"
import { Reveal } from "@/components/motion/reveal"

const stages = [
  {
    icon: MessageSquare,
    n: "01",
    title: "The question",
    copy: "Start with the person behind the ticket.",
    detail: "A customer needs a hand.",
  },
  {
    icon: BookOpen,
    n: "02",
    title: "The context",
    copy: "Find the relevant records and published knowledge.",
    detail: "The evidence comes into view.",
  },
  {
    icon: ShieldCheck,
    n: "03",
    title: "Your decision",
    copy: "Inspect, edit, approve or ask for a closer look.",
    detail: "A person makes the call.",
  },
  {
    icon: FileCheck2,
    n: "04",
    title: "A clear outcome",
    copy: "Keep the action and its evidence together.",
    detail: "The next step has a record.",
  },
]

export function WorkflowMap() {
  return (
    <section className="story-workflow relative overflow-hidden border-y py-20 md:py-28">
      <div className="page-container relative">
        <Reveal
          preset="rise"
          className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div>
            <p className="eyebrow mb-5 flex items-center gap-3 text-muted-foreground">
              <span className="h-px w-7 bg-signal" />
              One workspace. Fewer loose ends.
            </p>
            <h2 className="max-w-2xl font-heading text-[2.6rem] leading-[1.04] font-medium tracking-[-0.05em] md:text-6xl">
              A better rhythm
              <br />
              for the actual work.
            </h2>
          </div>
          <ButtonLink
            variant="outline"
            href="/how-it-works"
            className="h-11 w-fit rounded-full border-foreground/20 bg-transparent px-5 text-xs"
          >
            Follow the process
            <ArrowUpRight className="ml-5 size-3.5" />
          </ButtonLink>
        </Reveal>
        <Reveal preset="panel" className="mt-12 md:mt-16">
          <ol className="story-workflow-rail grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage, index) => (
              <li
                key={stage.n}
                className={
                  index === 2
                    ? "story-workflow-decision relative flex min-h-[310px] flex-col bg-signal-surface p-6 md:min-h-[340px] md:p-7"
                    : "relative flex min-h-[310px] flex-col bg-background p-6 md:min-h-[340px] md:p-7"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="story-chapter-number font-heading text-[4.5rem] leading-none font-medium tracking-[-0.08em]">
                    {stage.n}
                  </span>
                  <stage.icon className="mt-2 size-5 text-signal" />
                </div>
                <div className="mt-8">
                  <h3 className="font-heading text-[1.65rem] leading-tight font-medium tracking-[-0.035em]">
                    {stage.title}
                  </h3>
                  <p className="mt-3 max-w-[245px] text-sm leading-relaxed text-muted-foreground">
                    {stage.copy}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 border-t pt-5 text-signal">
                  <p className="mt-5 font-mono text-[8px] tracking-[0.05em] uppercase">
                    {stage.detail}
                  </p>
                  <ArrowDownRight className="mt-5 size-4 shrink-0" />
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <p className="mt-5 flex items-center justify-between gap-5 font-mono text-[9px] text-muted-foreground">
          <span>CONTEXT → EVIDENCE → JUDGMENT → OUTCOME</span>
          <span className="hidden items-center gap-2 sm:flex">
            <span className="size-1.5 rounded-full bg-signal" />
            HUMAN REVIEW AT THE CENTER
          </span>
        </p>
      </div>
    </section>
  )
}
