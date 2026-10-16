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
  },
  {
    title: "Bring the evidence together.",
    text: "Review account facts alongside published policies. Follow the source references and see what supports the recommendation, with uncertainty kept in view.",
    label: "02 / Investigate",
    icon: BookOpen,
  },
  {
    title: "Make a deliberate decision.",
    text: "A person reviews the proposal and its sources, adjusts the reply, or rejects or escalates the case. When evidence is incomplete or conflicting, manual review comes first.",
    label: "03 / Human review",
    icon: ShieldCheck,
  },
  {
    title: "Act safely. Keep the record.",
    text: "The workflow is designed to keep the evidence, decision and outcome together, so the reasoning behind a next step stays clear.",
    label: "04 / Outcome & record",
    icon: FileCheck2,
  },
]

function StageEvidence({ stage }: { stage: number }) {
  if (stage === 0) {
    return (
      <div className="secondary-process-evidence secondary-process-ticket">
        <div className="secondary-evidence-caption">
          <span>TKT-1001</span>
          <span>AcmeCloud / Maya Rahman</span>
        </div>
        <blockquote>
          “I noticed two charges of $29.00 for my Pro plan this month.”
        </blockquote>
        <p>A specific question, connected to the right account.</p>
      </div>
    )
  }
  if (stage === 1) {
    return (
      <div className="secondary-process-evidence secondary-process-sources">
        <div>
          <span className="secondary-evidence-label">Account record</span>
          <strong>Two settled payments</strong>
          <p>
            PAY-9001 + PAY-9002
            <br />
            $29.00 each · October
          </p>
        </div>
        <span aria-hidden="true" className="secondary-source-connector">
          +
        </span>
        <div>
          <span className="secondary-evidence-label">Published policy</span>
          <strong>Duplicate charges</strong>
          <p>
            KB-REFUND-v1
            <br />
            Eligible for human review
          </p>
        </div>
      </div>
    )
  }
  if (stage === 2) {
    return (
      <div className="secondary-process-evidence secondary-process-review">
        <p className="secondary-evidence-label">
          Suggested reply / before a decision
        </p>
        <blockquote>
          “The records support reviewing the extra $29.00 payment for a refund.”
        </blockquote>
        <p className="secondary-review-checkpoint">
          <ShieldCheck aria-hidden="true" className="size-4" />
          An agent checks the evidence and chooses the next step.
        </p>
      </div>
    )
  }
  return (
    <div className="secondary-process-evidence secondary-process-outcome">
      <ol>
        <li>
          <span>Proposed target</span>
          <strong>PAY-9002 / $29.00</strong>
        </li>
        <li>
          <span>Human decision</span>
          <strong>Required before action</strong>
        </li>
        <li>
          <span>Connected record</span>
          <strong>Reason + next step</strong>
        </li>
      </ol>
      <p>Keep the decision connected to the evidence that informed it.</p>
    </div>
  )
}

export default function HowItWorksPage() {
  return (
    <div className="secondary-process-page page-container py-20 md:py-28">
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
      <div className="secondary-process-chapters mt-16 border-b md:mt-24">
        {steps.map((step, index) => (
          <Reveal key={step.label} preset={index % 2 === 0 ? "left" : "right"}>
            <section className="process-chapter secondary-process-chapter grid gap-8 border-t py-10 md:gap-16 md:py-16">
              <div className="flex items-center gap-5 md:flex-col md:items-start md:gap-8">
                <span
                  aria-hidden="true"
                  className="story-chapter-number font-heading text-7xl leading-none tracking-[-0.08em] md:text-8xl"
                >
                  0{index + 1}
                </span>
                <p className="eyebrow flex items-center gap-3 text-muted-foreground">
                  <step.icon
                    aria-hidden="true"
                    className="size-4 text-signal"
                  />
                  {step.label}
                </p>
              </div>
              <div>
                <ScrollHeading
                  text={step.title}
                  mode="highlight"
                  className="max-w-xl font-heading text-[2rem] leading-[1.1] font-medium tracking-[-0.04em] md:text-[2.75rem]"
                />
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
                <StageEvidence stage={index} />
              </div>
            </section>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 flex flex-col justify-between gap-6 rounded-2xl border border-signal/20 bg-signal-surface p-7 md:flex-row md:items-center md:p-9">
        <div>
          <h2 className="font-heading text-xl font-medium">Follow a case.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore the case, its evidence and the review steps.
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
