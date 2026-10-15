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
      <section className="marketing-hero page-container relative grid items-center gap-2 pt-10 pb-0 md:min-h-[790px] md:grid-cols-[1.08fr_1fr] md:gap-0 md:py-14 lg:min-h-[850px]">
        <div className="hero-editorial relative z-10 min-w-0 pt-3 md:pb-20">
          <Reveal preset="rise">
            <p className="eyebrow mb-7 flex items-center gap-2.5 text-muted-foreground md:mb-10">
              <span className="flex size-5 items-center justify-center rounded-full border border-signal/25 bg-signal-surface">
                <span className="size-1 rounded-full bg-signal" />
              </span>
              A clearer way to support
            </p>
            <h1 className="hero-headline font-heading font-medium">
              Every answer.
              <br />
              <span className="hero-title-accent text-signal">
                In good hands.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.09}>
            <p className="mt-7 max-w-[375px] text-sm leading-[1.85] text-muted-foreground md:mt-9 md:text-base">
              AI-assisted customer support, with evidence behind every answer
              and a human behind every decision.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 md:mt-9">
              <ButtonLink
                href="/dashboard"
                className="signal-button h-12 rounded-full px-6 text-xs"
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
        <div className="hero-visual-column relative mt-5 mb-7 min-w-0 md:mt-0 md:mb-12">
          <HeroVisual />
        </div>
        <div className="flex justify-between gap-5 border-t py-5 md:absolute md:inset-x-0 md:bottom-0">
          <p className="font-mono text-[9px] leading-relaxed tracking-[0.16em] text-muted-foreground md:text-[10px]">
            BUILT FOR THE PEOPLE
            <br className="sm:hidden" /> BEHIND THE REPLY.
          </p>
          <a
            href="#workflow"
            aria-label="Discover the workflow"
            className="group flex shrink-0 items-center gap-3 rounded-md text-[10px] text-muted-foreground focus-visible:outline-2 md:text-[11px]"
          >
            A little less chaos
            <span className="flex size-7 items-center justify-center rounded-full border transition-colors group-hover:border-signal/40 group-hover:text-signal">
              <ArrowDown className="size-3" />
            </span>
          </a>
        </div>
      </section>

      <section
        id="workflow"
        className="showcase-section relative mt-3 overflow-hidden bg-[#151b1d] py-16 text-[#f0f3f3] md:mt-8 md:py-28"
      >
        <div className="surface-grid pointer-events-none absolute inset-0 opacity-[0.05]" />
        <div className="page-container relative">
          <Reveal
            preset="left"
            className="mb-10 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end"
          >
            <div>
              <p className="eyebrow mb-5 flex items-center gap-3 text-[#b7e9d0]">
                <span className="h-px w-7 bg-[#b7e9d0]/60" /> From a ticket to a
                thoughtful resolution
              </p>
              <h2 className="max-w-2xl font-heading text-[2.55rem] leading-[1.02] font-medium tracking-[-0.055em] md:text-[clamp(3rem,5.4vw,5rem)]">
                Everything you need.
                <br />
                <span className="text-[#91a29a]">Nothing left to guess.</span>
              </h2>
            </div>
            <p className="max-w-[260px] border-l border-[#b7e9d0]/25 pl-5 text-sm leading-relaxed text-[#b5c1c7]">
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

      <section
        id="approach"
        className="approach-section page-container py-20 md:py-32"
      >
        <Reveal preset="left">
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
        className="questions-section page-container grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-32"
      >
        <Reveal preset="left">
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
        <Reveal preset="panel" delay={0.06}>
          <Faq />
        </Reveal>
      </section>
    </>
  )
}
