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
import { ScrollHeading } from "@/components/motion/scroll-heading"

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
          </Reveal>
          <ScrollHeading
            as="h1"
            className="hero-headline font-heading font-medium"
            text={[
              { text: "Every answer." },
              {
                text: "In good hands.",
                className: "hero-title-accent text-signal",
              },
            ]}
          />
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
              Explore at your own pace. No sign-in needed.
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
        className="showcase-section home-showcase relative mt-3 overflow-hidden bg-[#151b1d] py-16 text-[#f0f3f3] md:mt-8 md:py-28"
      >
        <div className="surface-grid pointer-events-none absolute inset-0 opacity-[0.05]" />
        <div className="page-container relative">
          <Reveal
            preset="left"
            className="home-showcase-heading mb-10 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end"
          >
            <div>
              <p className="eyebrow home-section-label mb-5 flex items-center gap-3 text-[#b7e9d0]">
                <span className="home-section-number" aria-hidden="true">
                  01
                </span>{" "}
                From a ticket to a thoughtful resolution
              </p>
              <ScrollHeading
                mode="highlight"
                className="max-w-2xl font-heading text-[2.55rem] leading-[1.02] font-medium tracking-[-0.055em] md:text-[clamp(3rem,5.4vw,5rem)]"
                text={[
                  { text: "Everything you need." },
                  {
                    text: "Nothing left to guess.",
                    className: "text-[#b4daca]",
                  },
                ]}
              />
            </div>
            <p className="home-showcase-intro max-w-[280px] border-l border-[#b7e9d0]/25 pl-5 text-sm leading-relaxed text-[#b5c1c7]">
              Three everyday questions. Explore the context behind each one, and
              what a careful next step looks like.
            </p>
          </Reveal>
          <div className="showcase-pedestal" aria-hidden="true">
            <span>THE QUESTION</span>
            <i />
            <span>THE EVIDENCE</span>
            <i />
            <span>YOUR CALL</span>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section
        id="approach"
        className="approach-section home-approach page-container py-20 md:py-32"
      >
        <Reveal preset="left" className="home-approach-heading">
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
        className="questions-section premium-questions page-container grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-32"
      >
        <Reveal preset="left" className="faq-intro">
          <p className="home-section-label mb-7" aria-hidden="true">
            <span className="home-section-number">04</span> THE FINER DETAILS
          </p>
          <SectionHeading
            eyebrow="A few things, answered"
            title="Clarity starts here."
          />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
            What the product does, what you can try today, and the decisions
            that stay yours.
          </p>
          <div className="faq-assurance glass-inset mt-8 flex items-center gap-3 rounded-2xl border p-5">
            <span className="flex size-9 items-center justify-center rounded-full border bg-muted/40">
              <ShieldCheck className="size-4 text-muted-foreground" />
            </span>
            <p className="max-w-[200px] text-xs leading-relaxed text-muted-foreground">
              Explore the workspace.
              <br />
              No sign-in needed.
            </p>
          </div>
        </Reveal>
        <Reveal preset="panel" delay={0.06} className="faq-surface">
          <Faq />
        </Reveal>
      </section>
    </>
  )
}
