import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Brand, BrandMark } from "@/components/shared/brand"
import { ButtonLink } from "@/components/shared/button-link"
import { Reveal } from "@/components/motion/reveal"
import { ScrollHeading } from "@/components/motion/scroll-heading"

export function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="page-container pt-8 pb-10 md:pt-10 md:pb-12">
        <Reveal
          preset="panel"
          className="closing-panel material-panel relative flex flex-col justify-between gap-10 p-7 sm:p-10 md:min-h-[420px] md:flex-row md:items-end md:p-14"
        >
          <div className="closing-orbit" aria-hidden="true" />
          <BrandMark
            className="pointer-events-none absolute top-9 right-9 hidden size-16 text-foreground/8 md:block"
            aria-hidden="true"
          />
          <div>
            <p className="closing-caption eyebrow mb-7">
              Bring a little clarity to your queue
            </p>
            <ScrollHeading
              mode="highlight"
              className="max-w-2xl font-heading text-[clamp(2.7rem,6vw,5.6rem)] leading-[0.98] font-medium tracking-[-0.065em]"
              text={[
                { text: "Better support." },
                { text: "Still your call.", className: "closing-subtitle" },
              ]}
            />
          </div>
          <div className="relative w-fit shrink-0">
            <ButtonLink
              href="/dashboard"
              className="signal-button h-12 rounded-full px-6 text-xs"
            >
              Explore the workspace <ArrowUpRight className="ml-3 size-4" />
            </ButtonLink>
            <p className="closing-caption mt-4 text-center text-[11px]">
              Sample workspace · No sign-in required
            </p>
          </div>
        </Reveal>
        <div className="mt-10 flex flex-col justify-between gap-8 pt-4 md:flex-row md:items-center">
          <Brand />
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground"
          >
            <Link href="/product" className="hover:text-foreground">
              Product
            </Link>
            <Link href="/how-it-works" className="hover:text-foreground">
              How it works
            </Link>
            <Link href="/#questions" className="hover:text-foreground">
              Questions
            </Link>
            <Link href="/signup" className="hover:text-foreground">
              Create an account
            </Link>
          </nav>
          <p className="font-mono text-[10px] text-muted-foreground">
            © 2026 Handled · Built with intention.
          </p>
        </div>
      </div>
    </footer>
  )
}
