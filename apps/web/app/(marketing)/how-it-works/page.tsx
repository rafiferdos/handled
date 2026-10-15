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
      <p className="eyebrow mb-6 text-muted-foreground">
        How it works / Context to clarity
      </p>
      <h1 className="max-w-3xl font-heading text-5xl leading-[1.04] font-medium tracking-[-0.05em] md:text-7xl">
        From “what happened?”
        <br />
        <span className="text-muted-foreground">
          to a thoughtful next step.
        </span>
      </h1>
      <p className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground">
        Four connected stages. Clear evidence. A human decision at the center.
      </p>
      <div className="mt-16 border-b md:mt-24">
        {steps.map((step) => (
          <Reveal key={step.label}>
            <section className="grid gap-5 border-t py-10 md:grid-cols-[0.6fr_1.4fr] md:py-14">
              <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-5">
                <span className="flex size-14 items-center justify-center rounded-2xl border bg-muted/30">
                  <step.icon className="size-5 text-muted-foreground" />
                </span>
                <p className="eyebrow text-muted-foreground">{step.label}</p>
              </div>
              <div>
                <h2 className="font-heading text-3xl font-medium tracking-tight">
                  {step.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
                <p className="mt-6 max-w-xl border-l-2 border-foreground/15 pl-4 font-mono text-[10px] leading-relaxed text-muted-foreground">
                  {step.sample}
                </p>
              </div>
            </section>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 flex flex-col justify-between gap-6 rounded-2xl bg-muted p-7 md:flex-row md:items-center">
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
          className="h-11 rounded-full px-5"
        >
          Inspect TKT-1001 <ArrowUpRight className="ml-3 size-4" />
        </ButtonLink>
      </div>
    </div>
  )
}
