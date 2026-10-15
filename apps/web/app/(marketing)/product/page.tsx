import type { Metadata } from "next"
import {
  ArrowUpRight,
  BookOpen,
  Fingerprint,
  Inbox,
  Sparkles,
} from "lucide-react"
import { SectionHeading } from "@/components/shared/section-heading"
import { ButtonLink } from "@/components/shared/button-link"
import { ProductPreview } from "@/components/marketing/product-preview"
import { Reveal } from "@/components/motion/reveal"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = { title: "The product" }

export default function ProductPage() {
  return (
    <>
      <section className="page-container relative py-20 md:py-24">
        <Reveal>
          <p className="eyebrow mb-6 text-muted-foreground">
            The product / One connected workspace
          </p>
          <h1 className="max-w-4xl font-heading text-5xl leading-[1.04] font-medium tracking-[-0.05em] md:text-7xl">
            Less searching for context.
            <br />
            <span className="text-muted-foreground">More room to help.</span>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground">
            Handled brings a customer&apos;s question, verified account context
            and published knowledge into a reviewable support workflow.
          </p>
          <ButtonLink href="/dashboard" className="mt-8 h-11 rounded-full px-6">
            Explore the workspace <ArrowUpRight className="ml-4 size-4" />
          </ButtonLink>
          <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t pt-5 font-mono text-[10px] tracking-wide text-muted-foreground">
            <span>01 / ACCOUNT CONTEXT</span>
            <span>02 / PUBLISHED KNOWLEDGE</span>
            <span>03 / YOUR DECISION</span>
          </div>
        </Reveal>
      </section>
      <section className="bg-[#182126] py-12 md:py-20">
        <div className="page-container">
          <ProductPreview />
        </div>
      </section>
      <section className="page-container py-24">
        <SectionHeading
          eyebrow="Designed for the full support loop"
          title="A place for every next step."
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {[
            {
              icon: Inbox,
              title: "An inbox with perspective",
              body: "Search sample tickets, filter by status and priority, and move from a question to its account context.",
              href: "/tickets",
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
              detail: [
                "Evidence reviewed",
                "Decision explained",
                "Outcome traceable",
              ],
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={(index % 2) * 0.06}>
              <Card className="material-panel h-full gap-0 p-7 shadow-none ring-0 sm:p-8">
                <CardContent className="p-0">
                  <div className="mb-7 flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl border bg-background">
                      <item.icon className="size-5 text-muted-foreground" />
                    </span>
                    <span className="eyebrow text-muted-foreground">
                      0{index + 1} /
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl font-medium tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                  <div
                    aria-hidden="true"
                    className="mt-6 space-y-2 rounded-xl border bg-background/70 p-3.5"
                  >
                    {item.detail.map((detail, detailIndex) => (
                      <div
                        key={detail}
                        className="flex items-center gap-3 text-[11px]"
                      >
                        <span className="size-1.5 rounded-full bg-muted-foreground/35" />
                        <span className="flex-1">{detail}</span>
                        {detailIndex === 0 && (
                          <Badge
                            variant="outline"
                            className="text-[8px] text-muted-foreground"
                          >
                            Sample
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  <ButtonLink
                    href={item.href}
                    variant="link"
                    className="mt-5 h-auto p-0 text-xs"
                  >
                    Explore sample <ArrowUpRight className="ml-2 size-3.5" />
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
