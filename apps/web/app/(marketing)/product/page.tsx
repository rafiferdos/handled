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

export const metadata: Metadata = { title: "The product" }

export default function ProductPage() {
  return (
    <>
      <section className="page-container py-20 md:py-28">
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
            },
            {
              icon: Sparkles,
              title: "A reviewable recommendation",
              body: "Inspect a sample proposal, its confidence and its supporting sources before a human decision.",
              href: "/tickets/10000000-0000-4000-8000-000000001001",
            },
            {
              icon: BookOpen,
              title: "Knowledge with provenance",
              body: "Explore published sample policies with version references. Domain owners can connect the library to reviewed API contracts.",
              href: "/knowledge",
            },
            {
              icon: Fingerprint,
              title: "Outcomes with a record",
              body: "Understand the intended event trail. The preview clearly distinguishes sample events from durable backend records.",
              href: "/activity",
            },
          ].map((item) => (
            <Reveal key={item.title}>
              <div className="h-full rounded-2xl border bg-card p-7">
                <item.icon className="mb-7 size-6 text-muted-foreground" />
                <h3 className="font-heading text-2xl font-medium tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
                <ButtonLink
                  href={item.href}
                  variant="link"
                  className="mt-5 h-auto p-0 text-xs"
                >
                  Explore sample <ArrowUpRight className="ml-2 size-3.5" />
                </ButtonLink>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
