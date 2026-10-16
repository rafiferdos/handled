import type { Metadata } from "next"
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Fingerprint,
  Inbox,
  Sparkles,
} from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { ButtonLink } from "@/components/shared/button-link"
import { ProductPreview } from "@/components/marketing/product-preview"
import { Reveal } from "@/components/motion/reveal"
import { ScrollHeading } from "@/components/motion/scroll-heading"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = { title: "The product" }

const features = [
  {
    icon: Inbox,
    title: "An inbox with perspective",
    body: "Search sample tickets, filter by status and priority, and move from a question to its account context.",
    href: "/tickets",
    label: "The starting point",
    detail: [
      "TKT-1001 · Duplicate payment",
      "TKT-1002 · Cancellation",
      "TKT-1003 · Missing access",
    ],
  },
  {
    icon: Sparkles,
    title: "A reviewable recommendation",
    body: "Inspect a sample proposal, its confidence and its supporting sources before a human decision.",
    href: "/tickets/10000000-0000-4000-8000-000000001001",
    label: "The human checkpoint",
    detail: [
      "Source references attached",
      "Reply open for editing",
      "Human decision required",
    ],
  },
  {
    icon: BookOpen,
    title: "Knowledge with provenance",
    body: "Find the published policy behind a recommendation. Source and version references make the answer easier to check.",
    href: "/knowledge",
    label: "The source of truth",
    detail: [
      "Duplicate charges / v1",
      "Period-end cancellation / v1",
      "Product access / v1",
    ],
  },
  {
    icon: Fingerprint,
    title: "Outcomes with a record",
    body: "See how evidence, a human decision and the next step should stay connected. Preview events are illustrative and remain local.",
    href: "/activity",
    label: "The connected record",
    detail: ["Evidence reviewed", "Decision explained", "Outcome traceable"],
  },
]

function FeaturePreview({
  feature,
  index,
}: {
  feature: (typeof features)[number]
  index: number
}) {
  return (
    <div
      aria-hidden="true"
      className="story-feature-preview mt-8 overflow-hidden rounded-xl border bg-background/80"
    >
      <div className="flex items-center justify-between gap-3 border-b bg-muted/25 px-4 py-3">
        <p className="flex items-center gap-2 font-mono text-[8px] tracking-wider text-muted-foreground uppercase">
          <feature.icon className="size-3 text-signal" />
          {feature.label}
        </p>
        <Badge variant="outline" className="text-[8px] text-muted-foreground">
          Sample
        </Badge>
      </div>
      <div className={index === 3 ? "relative space-y-0 p-4" : "space-y-2 p-3"}>
        {feature.detail.map((detail, detailIndex) => (
          <div
            key={detail}
            className={
              index === 3
                ? "relative flex items-center gap-3 py-3 text-[11px]"
                : detailIndex === 0
                  ? "flex items-center gap-3 rounded-lg border border-signal/20 bg-signal-surface px-3 py-3 text-[11px]"
                  : "flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-[11px] text-muted-foreground"
            }
          >
            <span className="relative flex size-5 shrink-0 items-center justify-center rounded-full border border-signal/20 bg-background text-signal">
              {index === 3 ? (
                <Check className="size-2.5" />
              ) : (
                <span className="font-mono text-[8px]">0{detailIndex + 1}</span>
              )}
            </span>
            <span className="flex-1">{detail}</span>
            {detailIndex === 0 && (
              <ArrowUpRight className="size-3 text-signal" />
            )}
          </div>
        ))}
      </div>
      {index === 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3 font-mono text-[8px] text-signal uppercase">
          <span>Ready for a closer look</span>
          <span className="size-1.5 rounded-full bg-signal" />
        </div>
      )}
    </div>
  )
}

export default function ProductPage() {
  return (
    <>
      <section className="story-product-hero relative overflow-hidden border-b py-20 md:py-28">
        <div className="page-container relative">
          <Reveal preset="rise">
            <p className="eyebrow mb-7 flex items-center gap-3 text-muted-foreground">
              <span className="size-1.5 rounded-full bg-signal" />
              The product / One connected workspace
            </p>
          </Reveal>
          <ScrollHeading
            as="h1"
            className="max-w-5xl font-heading text-[3.1rem] leading-[1.02] font-medium tracking-[-0.055em] sm:text-6xl md:text-[5.5rem] lg:text-[6.4rem]"
            text={[
              { text: "Less searching" },
              { text: "for context." },
              {
                text: "More room to help.",
                className: "text-muted-foreground",
              },
            ]}
          />
          <div className="mt-10 grid gap-9 md:mt-12 md:grid-cols-[1.05fr_0.95fr] md:gap-20">
            <Reveal preset="rise" delay={0.08}>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                Handled brings a customer&apos;s question, verified account
                context and published knowledge into a reviewable support
                workflow.
              </p>
              <ButtonLink
                href="/dashboard"
                className="signal-button mt-7 h-12 rounded-full px-6"
              >
                Explore the workspace <ArrowUpRight className="ml-5 size-4" />
              </ButtonLink>
            </Reveal>
            <Reveal preset="left" delay={0.12}>
              <div className="max-w-md border-t font-mono text-[10px] tracking-wide">
                {[
                  "ACCOUNT CONTEXT",
                  "PUBLISHED KNOWLEDGE",
                  "YOUR DECISION",
                ].map((label, index) => (
                  <div
                    key={label}
                    className="flex items-center gap-5 border-b py-4"
                  >
                    <span className="text-signal">0{index + 1}</span>
                    <span className="flex-1 text-muted-foreground">
                      {label}
                    </span>
                    <ArrowUpRight className="size-3.5 text-signal" />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="story-ink overflow-hidden py-10 md:py-16">
        <div className="page-container">
          <div className="mb-7 flex items-center justify-between gap-4 border-b border-white/15 pb-4 font-mono text-[9px] tracking-wide text-white/50">
            <span>THE WORKSPACE / A CLOSER LOOK</span>
            <span className="flex items-center gap-2">
              <span className="story-mint-dot size-1.5 rounded-full" />
              SAMPLE PREVIEW
            </span>
          </div>
          <ProductPreview />
        </div>
      </section>
      <section className="page-container py-20 md:py-28">
        <Reveal
          preset="rise"
          className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end"
        >
          <SectionHeading
            eyebrow="Designed for the full support loop"
            title="A place for every next step."
          />
          <p className="max-w-[240px] border-l border-signal/40 pl-4 text-sm leading-relaxed text-muted-foreground">
            From the first question to a decision you can explain.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-12">
          {features.map((feature, index) => (
            <Reveal
              key={feature.title}
              preset="panel"
              delay={(index % 2) * 0.06}
              className={
                index === 0 || index === 3
                  ? "min-w-0 md:col-span-7"
                  : "min-w-0 md:col-span-5"
              }
            >
              <Card className="story-feature-card material-panel relative h-full gap-0 p-6 shadow-none ring-0 sm:p-8">
                <CardContent className="p-0">
                  <div className="mb-8 flex items-start justify-between gap-5 border-b pb-5">
                    <span className="story-chapter-number font-heading text-[4rem] leading-none font-medium tracking-[-0.08em] sm:text-7xl">
                      0{index + 1}
                    </span>
                    <span className="flex size-11 items-center justify-center rounded-full border border-signal/20 bg-signal-surface">
                      <feature.icon className="size-4 text-signal" />
                    </span>
                  </div>
                  <p className="eyebrow mb-3 text-muted-foreground">
                    {feature.label}
                  </p>
                  <ScrollHeading
                    as="h3"
                    text={feature.title}
                    className="max-w-md font-heading text-[1.9rem] leading-[1.08] font-medium tracking-[-0.04em] sm:text-4xl md:text-[clamp(1.7rem,2.8vw,2.25rem)]"
                  />
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                  <FeaturePreview feature={feature} index={index} />
                  <ButtonLink
                    href={feature.href}
                    variant="link"
                    className="mt-6 h-auto p-0 text-xs"
                  >
                    Explore sample{" "}
                    <ArrowUpRight className="ml-3 size-3.5 text-signal" />
                  </ButtonLink>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
