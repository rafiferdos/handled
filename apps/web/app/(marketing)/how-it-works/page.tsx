import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { ButtonLink } from "@/components/shared/button-link"
import { Reveal } from "@/components/motion/reveal"

export const metadata: Metadata = { title: "How it works" }
const steps = [
  {
    title: "Start with the customer’s question.",
    text: "A ticket is the starting point. The account and workspace establish the boundary for every piece of context that follows.",
    label: "01 / Intake",
  },
  {
    title: "Bring the evidence together.",
    text: "The intended investigation uses allowlisted, read-only account tools and published knowledge. Recorded steps and sources support the recommendation; hidden model reasoning is never presented as evidence.",
    label: "02 / Investigate",
  },
  {
    title: "Make a deliberate decision.",
    text: "An authenticated agent reviews the proposal and sources, edits the reply, or rejects or escalates the case. Low or conflicting evidence calls for manual review.",
    label: "03 / Human review",
  },
  {
    title: "Act safely. Keep the record.",
    text: "The backend must verify permissions, proposal version, policy and idempotency before admitting a simulated action. Durable records and audit events establish the outcome. Real provider writes remain outside the MVP.",
    label: "04 / Simulate & audit",
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
              <p className="eyebrow text-muted-foreground">{step.label}</p>
              <div>
                <h2 className="font-heading text-3xl font-medium tracking-tight">
                  {step.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {step.text}
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
