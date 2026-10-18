import type { Metadata } from "next"
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Fingerprint,
  Inbox,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { ButtonLink } from "@/components/shared/button-link"
import { ProductPreview } from "@/components/marketing/product-preview"
import { Reveal } from "@/components/motion/reveal"
import { ScrollHeading } from "@/components/motion/scroll-heading"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = { title: "The product" }

const features = [
  {
    icon: Inbox,
    title: "An inbox with perspective",
    body: "Search tickets, filter by status and priority, and move from a question to its account context.",
    href: "/tickets",
    action: "Open ticket inbox",
    label: "The starting point",
  },
  {
    icon: Sparkles,
    title: "A reviewable recommendation",
    body: "Inspect a proposal, its confidence and its supporting sources before a human decision.",
    href: "/tickets/10000000-0000-4000-8000-000000001001",
    action: "Review proposal",
    label: "The human checkpoint",
  },
  {
    icon: BookOpen,
    title: "Knowledge with provenance",
    body: "Find the published policy behind a recommendation. Source and version references make the answer easier to check.",
    href: "/knowledge",
    action: "Browse knowledge",
    label: "The source of truth",
  },
  {
    icon: Fingerprint,
    title: "Outcomes with a record",
    body: "Follow the relationship between evidence, a human decision and the next step.",
    href: "/activity",
    action: "View activity",
    label: "The connected record",
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
      className={`story-feature-preview secondary-feature-artifact secondary-feature-artifact-${index + 1} mt-7 overflow-hidden rounded-xl border`}
    >
      <div className="secondary-artifact-heading">
        <feature.icon aria-hidden="true" className="size-3.5 text-signal" />
        <span>
          {
            [
              "Ticket inbox",
              "Reply draft",
              "Published knowledge",
              "Case relationship",
            ][index]
          }
        </span>
        <span className="secondary-artifact-reference">
          {index === 2 ? "v1" : "TKT-1001"}
        </span>
      </div>
      {index === 0 && (
        <ul className="secondary-inbox-list">
          {[
            {
              reference: "1001",
              initials: "MR",
              title: "Duplicate payment",
              status: "Awaiting approval",
            },
            {
              reference: "1002",
              initials: "DL",
              title: "Period-end cancellation",
              status: "New",
            },
            {
              reference: "1003",
              initials: "SK",
              title: "Missing product access",
              status: "Needs review",
            },
          ].map((ticket) => (
            <li key={ticket.reference}>
              <span aria-hidden="true" className="secondary-ticket-avatar">
                {ticket.initials}
              </span>
              <span className="secondary-ticket-subject">
                <strong>{ticket.title}</strong>
                <span>TKT-{ticket.reference} · AcmeCloud</span>
              </span>
              <span className="secondary-ticket-status">{ticket.status}</span>
            </li>
          ))}
        </ul>
      )}
      {index === 1 && (
        <div className="secondary-reply-preview">
          <div className="secondary-source-chips">
            <span>PAY-9001 / PAY-9002</span>
            <span>KB-REFUND-v1</span>
          </div>
          <blockquote>
            Hi Maya, your account shows two settled $29.00 payments for October.
            The duplicate-charge policy supports reviewing the extra payment for
            a refund.
          </blockquote>
          <p>
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            Human review required
          </p>
        </div>
      )}
      {index === 2 && (
        <div className="secondary-policy-preview">
          <div className="secondary-policy-title">
            <FileText aria-hidden="true" className="size-5 text-signal" />
            <div>
              <span>Billing policy</span>
              <strong>Duplicate charges</strong>
            </div>
            <span className="secondary-published-label">Published</span>
          </div>
          <p>
            An additional settled charge for the same subscription and billing
            period is eligible for review.
          </p>
          <dl>
            <div>
              <dt>Source</dt>
              <dd>KB-REFUND</dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>v1</dd>
            </div>
          </dl>
        </div>
      )}
      {index === 3 && (
        <div className="secondary-record-preview">
          <ol>
            <li>
              <FileText aria-hidden="true" className="size-4" />
              <span>
                Evidence<strong>Account + policy</strong>
              </span>
            </li>
            <li>
              <ShieldCheck aria-hidden="true" className="size-4" />
              <span>
                Human checkpoint<strong>Awaiting approval</strong>
              </span>
            </li>
            <li>
              <Fingerprint aria-hidden="true" className="size-4" />
              <span>
                Linked record<strong>Decision + next step</strong>
              </span>
            </li>
          </ol>
          <p>A clear path from a proposed action to the reason behind it.</p>
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
          <div className="secondary-product-intro mt-10 grid gap-9 md:mt-12 md:grid-cols-[1.05fr_0.95fr] md:gap-20">
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
              <div className="secondary-product-context max-w-md border-t font-mono text-[11px] tracking-wide">
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
          <div className="secondary-workspace-caption mb-7 flex items-center justify-between gap-4 border-b border-white/15 pb-4 font-mono text-[11px] tracking-wide text-white/60">
            <span>THE WORKSPACE / A CLOSER LOOK</span>
            <span className="flex items-center gap-2">
              <span className="story-mint-dot size-1.5 rounded-full" />
              THREE SUPPORT CASES
            </span>
          </div>
          <ProductPreview />
        </div>
      </section>
      <section className="secondary-product-features page-container py-20 md:py-28">
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
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                  <FeaturePreview feature={feature} index={index} />
                  <ButtonLink
                    href={feature.href}
                    variant="link"
                    className="mt-6 h-auto p-0 text-sm"
                  >
                    {feature.action}{" "}
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
