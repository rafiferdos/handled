import {
  ArrowUpRight,
  BookOpen,
  FileCheck2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import { ButtonLink } from "@/components/shared/button-link"
import { ScrollHeading } from "@/components/motion/scroll-heading"
import { WorkflowStory } from "./workflow-story"

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
    <section className="story-workflow workflow-section relative border-y py-20 md:py-28">
      <div className="workflow-ambient" aria-hidden="true" />
      <div className="page-container relative">
        <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow mb-5 flex items-center gap-3 text-muted-foreground">
              <span className="h-px w-7 bg-signal" />
              One workspace. Fewer loose ends.
            </p>
            <ScrollHeading
              as="h2"
              text="A better rhythm for the actual work."
              mode="highlight"
              className="max-w-2xl font-heading text-[2.6rem] leading-[1.04] font-medium tracking-[-0.05em] md:text-6xl"
            />
          </div>
          <ButtonLink
            variant="outline"
            href="/how-it-works"
            className="glass-inset h-11 w-fit rounded-full px-5 text-xs"
          >
            Follow the process
            <ArrowUpRight className="ml-5 size-3.5" />
          </ButtonLink>
        </div>
        <WorkflowStory>
          <ol className="workflow-steps">
            {stages.map((stage) => (
              <li key={stage.n} className="workflow-step">
                <div className="workflow-step-card">
                  <div className="workflow-chapter-heading">
                    <span className="story-chapter-number workflow-chapter-number">
                      {stage.n}
                    </span>
                    <span className="workflow-chapter-icon glass-inset">
                      <stage.icon className="size-5" />
                    </span>
                  </div>
                  <p className="workflow-chapter-detail">{stage.detail}</p>
                  <h3 className="workflow-chapter-title">{stage.title}</h3>
                  <p className="workflow-chapter-copy">{stage.copy}</p>
                  <div className="workflow-chapter-footer" aria-hidden="true">
                    <span />
                    {stage.n} / 04
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </WorkflowStory>
        <p className="mt-6 flex items-center justify-between gap-5 border-t pt-5 font-mono text-[9px] text-muted-foreground">
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
