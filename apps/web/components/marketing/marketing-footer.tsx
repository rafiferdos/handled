import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Brand } from "@/components/shared/brand"
import { ButtonLink } from "@/components/shared/button-link"

export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="page-container py-16 md:py-24">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-5 text-muted-foreground">
              Bring a little clarity to your queue
            </p>
            <h2 className="max-w-2xl font-heading text-4xl leading-[1.05] font-medium tracking-[-0.045em] md:text-6xl">
              Better support.
              <br />
              Still your call.
            </h2>
          </div>
          <ButtonLink href="/dashboard" className="h-12 rounded-full px-6">
            Explore the workspace <ArrowUpRight className="ml-3 size-4" />
          </ButtonLink>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-8 border-t pt-8 md:flex-row md:items-center">
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
