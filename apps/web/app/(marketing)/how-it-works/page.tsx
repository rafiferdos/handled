import type { Metadata } from "next"
import {
  ArrowUpRight,
  BookOpen,
  FileCheck2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import { ButtonLink } from "@/components/shared/button-link"
import { Reveal } from "@/components/motion/reveal"
import { ScrollHeading } from "@/components/motion/scroll-heading"

export const metadata: Metadata = { title: "How it works" }
const steps = [
  {
    title: "Start with the customer’s question.",
    text: "A ticket is the starting point. The account and workspace establish the boundary for every piece of context that follows.",
    label: "01 / Intake",
    icon: MessageSquare,
    sample: "The question comes with its account and workspace.",
  },
  {
    title: "Bring the evidence together.",
    text: "Review account facts alongside published policies. Follow the source references and see what supports the recommendation, with uncertainty kept in view.",
    label: "02 / Investigate",
    icon: BookOpen,
    sample: "A published policy. A recorded payment. A source to check.",
  },
  {
    title: "Make a deliberate decision.",
    text: "A person reviews the proposal and its sources, adjusts the reply, or rejects or escalates the case. When evidence is incomplete or conflicting, manual review comes first.",
    label: "03 / Human review",
    icon: ShieldCheck,
    sample: "Your judgment stays between a suggestion and an action.",
  },
  {
    title: "Act safely. Keep the record.",
    text: "The reviewed workflow is designed to keep the evidence, decision and outcome together. In this preview, decision rehearsals stay local; they do not create an account change or a durable activity record.",
    label: "04 / Outcome & record",
    icon: FileCheck2,
    sample: "A clear record of what was reviewed and what came next.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="page-container py-20 md:py-28">
      <Reveal preset="left">
        <p className="eyebrow mb-7 flex items-center gap-3 text-muted-foreground">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-signal"
          />
          How it works / Context to clarity
        </p>
      </Reveal>
      <ScrollHeading
        as="h1"
        className="max-w-5xl font-heading text-[clamp(2.8rem,6.6vw,6.4rem)] leading-[1.02] font-medium tracking-[-0.06em]"
        text={[
          { text: "From “what happened?”" },
          { text: "to a thoughtful next step.", className: "text-signal" },
        ]}
      />
      <Reveal delay={0.12}>
        <p className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground">
          Four connected stages. Clear evidence. A human decision at the center.
        </p>
      </Reveal>
      <div className="mt-16 border-b md:mt-24">
        {steps.map((step, index) => (
          <Reveal key={step.label} preset={index % 2 === 0 ? "left" : "right"}>
            <section className="process-chapter grid gap-8 border-t py-10 md:grid-cols-[0.75fr_1.25fr] md:gap-16 md:py-16">
              <div className="flex items-center gap-5 md:flex-col md:items-start md:gap-8">
                <span
                  aria-hidden="true"
                  className="story-chapter-number font-heading text-7xl leading-none tracking-[-0.08em] md:text-8xl"
                >
                  0{index + 1}
                </span>
                <p className="eyebrow flex items-center gap-3 text-muted-foreground">
                  <step.icon className="size-4 text-signal" />
                  {step.label}
                </p>
              </div>
              <div>
                <ScrollHeading
                  text={step.title}
                  mode="highlight"
                  className="max-w-xl font-heading text-[2rem] leading-[1.1] font-medium tracking-[-0.04em] md:text-[2.75rem]"
                />
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
                <div className="process-visual mt-7 flex max-w-xl items-start gap-4 rounded-xl border border-signal/15 p-5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-signal/20 bg-background">
                    <step.icon className="size-4 text-signal" />
                  </span>
                  <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
                    {step.sample}
                  </p>
                </div>
              </div>
            </section>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 flex flex-col justify-between gap-6 rounded-2xl border border-signal/20 bg-signal-surface p-7 md:flex-row md:items-center md:p-9">
        <div>
          <h2 className="font-heading text-xl font-medium">
            Follow a sample case.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The current preview uses sample data. No real account is connected.
          </p>
        </div>
        <ButtonLink
          href="/tickets/10000000-0000-4000-8000-000000001001"
          className="signal-button h-11 rounded-full px-5"
        >
          Inspect TKT-1001 <ArrowUpRight className="ml-3 size-4" />
        </ButtonLink>
      </div>
    </div>
  )
}
