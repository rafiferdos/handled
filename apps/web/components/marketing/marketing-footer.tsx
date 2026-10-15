import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Brand, BrandMark } from "@/components/shared/brand"
import { ButtonLink } from "@/components/shared/button-link"
import { Reveal } from "@/components/motion/reveal"

export function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="page-container pt-8 pb-10 md:pt-10 md:pb-12">
        <Reveal className="material-panel relative flex flex-col justify-between gap-10 bg-muted/25 p-7 sm:p-10 md:min-h-[360px] md:flex-row md:items-end md:p-14">
          <div className="closing-orbit" aria-hidden="true" />
          <BrandMark
            className="pointer-events-none absolute top-9 right-9 hidden size-16 text-foreground/8 md:block"
            aria-hidden="true"
          />
          <div>
            <p className="eyebrow mb-5 text-muted-foreground">
              Bring a little clarity to your queue
            </p>
            <h2 className="max-w-2xl font-heading text-[2.75rem] leading-[1.02] font-medium tracking-[-0.055em] md:text-7xl">
              Better support.
              <br />
              <span className="text-muted-foreground">Still your call.</span>
            </h2>
          </div>
          <div className="relative w-fit shrink-0">
            <ButtonLink
              href="/dashboard"
              className="h-12 rounded-full px-6 text-xs"
            >
              Explore the workspace <ArrowUpRight className="ml-3 size-4" />
            </ButtonLink>
            <p className="mt-3 text-center text-[10px] text-muted-foreground">
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
