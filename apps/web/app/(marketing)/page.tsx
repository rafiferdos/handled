import Link from "next/link"
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Fingerprint,
  Layers3,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { ButtonLink } from "@/components/shared/button-link"
import { SectionHeading } from "@/components/shared/section-heading"
import { HeroVisual } from "@/components/marketing/hero-visual"
import { ProductPreview } from "@/components/marketing/product-preview"
import { Faq } from "@/components/marketing/faq"
import { Reveal } from "@/components/motion/reveal"

const principles = [
  {
    number: "01",
    icon: ScanLine,
    title: "The whole story, in one place.",
    copy: "Account context, payment records and published policies. Connected to the ticket, with a source you can check.",
  },
  {
    number: "02",
    icon: Fingerprint,
    title: "Intelligence with a paper trail.",
    copy: "See the recorded tools, source references and recommendation. Understand what supports the answer before deciding.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "The final word is yours.",
    copy: "Review, edit, reject or escalate. Human approval and server-side policy stay between a suggestion and an action.",
  },
]

export default function HomePage() {
  return (
    <>
      <section className="page-container relative grid min-h-[730px] items-center gap-0 py-12 md:min-h-[760px] md:grid-cols-[1.04fr_1fr] md:py-10 lg:min-h-[820px]">
        <div className="relative z-10 pt-4 md:pb-20">
          <p className="eyebrow mb-7 flex items-center gap-2.5 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />A clearer way
            to support
          </p>
          <h1 className="max-w-[680px] font-heading text-[clamp(2.8rem,6.7vw,6.25rem)] leading-[0.98] font-medium tracking-[-0.065em]">
            Every answer.
            <br />
            <span className="text-muted-foreground">In good hands.</span>
          </h1>
          <p className="mt-7 max-w-[360px] text-sm leading-[1.85] text-muted-foreground md:mt-8 md:text-base">
            Turn scattered customer context into clear, evidence-backed next
            steps. AI does the investigation. You make the call.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5 md:mt-10">
            <ButtonLink
              href="/dashboard"
              className="h-12 rounded-full px-6 text-xs"
            >
              Explore the workspace <ArrowUpRight className="ml-4 size-4" />
            </ButtonLink>
            <Link
              href="/#workflow"
              className="group inline-flex items-center gap-2 rounded-md py-3 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              See how it works
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="mt-5 font-mono text-[9px] text-muted-foreground">
            INTERACTIVE PREVIEW · SAMPLE DATA · HUMAN CONTROL
          </p>
        </div>
        <div className="relative -mx-4 -mt-4 md:mt-0 md:-mr-8 lg:-mr-12">
          <HeroVisual />
        </div>
        <div className="flex justify-between gap-5 border-t py-5 md:absolute md:inset-x-0 md:bottom-0">
          <p className="font-mono text-[9px] leading-relaxed tracking-wider text-muted-foreground">
            BUILT FOR THE PEOPLE
            <br className="sm:hidden" /> BEHIND THE REPLY.
          </p>
          <a
            href="#workflow"
            aria-label="Discover the workflow"
            className="flex items-center gap-3 rounded-md text-[10px] text-muted-foreground focus-visible:outline-2"
          >
            A little less chaos <ArrowDown className="size-3.5" />
          </a>
        </div>
      </section>

      <section
        id="workflow"
        className="relative mt-3 overflow-hidden bg-[#182126] py-20 text-[#f0f3f3] md:mt-10 md:py-28"
      >
        <div className="surface-grid pointer-events-none absolute inset-0 opacity-[0.05]" />
        <div className="page-container relative">
          <Reveal className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-5 text-[#a4b1b7]">
                From a ticket to a thoughtful resolution
              </p>
              <h2 className="max-w-xl font-heading text-4xl leading-[1.07] font-medium tracking-[-0.045em] md:text-6xl">
                Everything you need.
                <br />
                <span className="text-[#99a8af]">Nothing left to guess.</span>
              </h2>
            </div>
            <p className="max-w-[280px] text-sm leading-relaxed text-[#a4b1b7]">
              One connected workspace for the question, the context, and the
              human behind the decision.
            </p>
          </Reveal>
          <ProductPreview />
          <div className="mt-10 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
            {[
              {
                n: "01",
                title: "Gather the context",
                text: "The right account. The relevant policy.",
              },
              {
                n: "02",
                title: "Make the evidence clear",
                text: "Traceable sources. A reviewable proposal.",
              },
              {
                n: "03",
                title: "Keep people in control",
                text: "Your decision. A recorded outcome.",
              },
            ].map((item) => (
              <div key={item.n} className="flex gap-4">
                <span className="pt-0.5 font-mono text-[9px] text-[#81949e]">
                  {item.n}
                </span>
                <div>
                  <h3 className="text-xs font-medium">{item.title}</h3>
                  <p className="mt-2 text-[11px] text-[#a4b1b7]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="approach" className="page-container py-24 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Thoughtfully assisted. Always human."
            title="Move the work forward. Keep the trust intact."
          >
            Speed matters. So does knowing why. Handled makes room for both.
          </SectionHeading>
        </Reveal>
        <div className="mt-14 md:mt-20">
          {principles.map((item) => (
            <Reveal key={item.number}>
              <div className="grid gap-5 border-t py-8 md:grid-cols-[70px_1fr_0.9fr] md:items-start md:gap-10 md:py-10">
                <span className="eyebrow text-muted-foreground">
                  {item.number} /
                </span>
                <div className="flex items-start gap-4">
                  <item.icon className="mt-1 size-5 shrink-0 text-muted-foreground" />
                  <h3 className="font-heading text-2xl leading-tight font-medium tracking-[-0.035em] md:text-3xl">
                    {item.title}
                  </h3>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  {item.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/35 py-20 md:py-28">
        <div className="page-container grid gap-12 md:grid-cols-[0.75fr_1.2fr] md:gap-24">
          <Reveal>
            <div className="flex size-14 items-center justify-center rounded-2xl border bg-background shadow-xs">
              <Layers3 className="size-6" />
            </div>
            <p className="eyebrow mt-7 text-muted-foreground">
              One workspace. Fewer loose ends.
            </p>
            <h2 className="mt-4 font-heading text-4xl leading-[1.08] font-medium tracking-[-0.045em] md:text-5xl">
              Built around
              <br />
              the actual work.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A shared foundation for your support team, with a clear place for
              every part of the process.
            </p>
            <ButtonLink
              variant="outline"
              href="/product"
              className="mt-7 h-10 rounded-full bg-transparent px-5 text-xs"
            >
              Meet the product <ArrowUpRight className="ml-4 size-3.5" />
            </ButtonLink>
          </Reveal>
          <div className="grid content-center gap-0">
            {[
              {
                icon: Sparkles,
                title: "Investigation with context",
                text: "Classification, account facts, source retrieval, recommendations and editable replies.",
              },
              {
                icon: ShieldCheck,
                title: "Guardrails that mean something",
                text: "Workspace boundaries, role checks, version checks and explicit human approval.",
              },
              {
                icon: Fingerprint,
                title: "A record you can return to",
                text: "Recorded evidence and outcomes, designed to stay useful after a ticket is closed.",
              },
            ].map((item) => (
              <Reveal key={item.title}>
                <div className="flex gap-5 border-b py-7 first:pt-0">
                  <item.icon className="mt-1 size-5 shrink-0 text-muted-foreground" />
                  <div>
                    <h3 className="font-heading text-xl font-medium tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="questions"
        className="page-container grid gap-10 py-24 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-32"
      >
        <Reveal>
          <SectionHeading
            eyebrow="A few things, answered"
            title="Clarity starts here."
          />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A transparent look at the product, the preview, and the decisions
            that stay yours.
          </p>
        </Reveal>
        <Reveal>
          <Faq />
        </Reveal>
      </section>
    </>
  )
}
