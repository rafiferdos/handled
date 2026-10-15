import Link from "next/link"
import { ArrowDown, ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react"
import { ButtonLink } from "@/components/shared/button-link"
import { SectionHeading } from "@/components/shared/section-heading"
import { HeroVisual } from "@/components/marketing/hero-visual"
import { ProductPreview } from "@/components/marketing/product-preview"
import { TrustPanels } from "@/components/marketing/trust-panels"
import { WorkflowMap } from "@/components/marketing/workflow-map"
import { Faq } from "@/components/marketing/faq"
import { Reveal } from "@/components/motion/reveal"

export default function HomePage() {
  return (
    <>
      <section className="page-container relative grid items-center gap-2 pt-10 pb-0 md:min-h-[760px] md:grid-cols-[1.04fr_1fr] md:gap-0 md:py-10 lg:min-h-[780px]">
        <div className="relative z-10 pt-3 md:pb-20">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-2.5 text-muted-foreground md:mb-7">
              <span className="size-1.5 rounded-full bg-success" />A clearer way
              to support
            </p>
            <h1 className="max-w-[680px] font-heading text-[clamp(2.8rem,6.7vw,6.25rem)] leading-[0.98] font-medium tracking-[-0.065em]">
              Every answer.
              <br />
              <span className="text-muted-foreground">In good hands.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.07}>
            <p className="mt-6 max-w-[385px] text-sm leading-[1.85] text-muted-foreground md:mt-8 md:text-base">
              AI-assisted customer support, with evidence behind every answer
              and a human behind every decision.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 md:mt-9">
              <ButtonLink
                href="/dashboard"
                className="h-12 rounded-full px-6 text-xs"
              >
                Explore the workspace
                <ArrowUpRight className="ml-4 size-4" />
              </ButtonLink>
              <Link
                href="/#workflow"
                className="group inline-flex items-center gap-2 rounded-md py-3 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                See how it works
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground">
              <ShieldCheck className="size-3 shrink-0" />
              Interactive preview. Sample data. Your call.
            </p>
          </Reveal>
        </div>
        <div className="relative -mx-2 mt-2 mb-4 md:mt-0 md:-mr-8 md:mb-0 lg:-mr-12">
          <HeroVisual />
        </div>
        <div className="flex justify-between gap-5 border-t py-5 md:absolute md:inset-x-0 md:bottom-0">
          <p className="font-mono text-[10px] leading-relaxed tracking-wide text-muted-foreground">
            BUILT FOR THE PEOPLE
            <br className="sm:hidden" /> BEHIND THE REPLY.
          </p>
          <a
            href="#workflow"
            aria-label="Discover the workflow"
            className="flex items-center gap-3 rounded-md text-[11px] text-muted-foreground focus-visible:outline-2"
          >
            A little less chaos
            <ArrowDown className="size-3.5" />
          </a>
        </div>
      </section>

      <section
        id="workflow"
        className="relative mt-3 overflow-hidden bg-[#182126] py-16 text-[#f0f3f3] md:mt-8 md:py-24"
      >
        <div className="surface-grid pointer-events-none absolute inset-0 opacity-[0.05]" />
        <div className="page-container relative">
          <Reveal className="mb-9 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
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
            <p className="max-w-[280px] text-sm leading-relaxed text-[#b5c1c7]">
              Three everyday questions. Explore the context behind each one, and
              what a careful next step looks like.
            </p>
          </Reveal>
          <ProductPreview />
          <p className="mt-7 flex items-center gap-2.5 text-[11px] leading-relaxed text-[#a4b1b7]">
            <ShieldCheck className="size-3.5 shrink-0" />
            Designed for evidence first, a human decision next. This preview
            never changes an account.
          </p>
        </div>
      </section>

      <section id="approach" className="page-container py-20 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Thoughtfully assisted. Always human."
            title="Move the work forward. Keep the trust intact."
          >
            The small details make the difference: a source you can trace, a
            decision you understand, a person in control.
          </SectionHeading>
        </Reveal>
        <TrustPanels />
      </section>

      <WorkflowMap />

      <section
        id="questions"
        className="page-container grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-28"
      >
        <Reveal>
          <SectionHeading
            eyebrow="A few things, answered"
            title="Clarity starts here."
          />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
            What the product does, what you can try today, and the decisions
            that stay yours.
          </p>
          <div className="mt-8 flex items-center gap-3 border-t pt-5">
            <span className="flex size-9 items-center justify-center rounded-full border bg-muted/40">
              <ShieldCheck className="size-4 text-muted-foreground" />
            </span>
            <p className="max-w-[200px] text-xs leading-relaxed text-muted-foreground">
              Explore the sample workspace.
              <br />
              No sign-in needed.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <Faq />
        </Reveal>
      </section>
    </>
  )
}
