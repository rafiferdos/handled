import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Brand, BrandMark } from "@/components/shared/brand"
import { ButtonLink } from "@/components/shared/button-link"
import { Reveal } from "@/components/motion/reveal"
import { ScrollHeading } from "@/components/motion/scroll-heading"

export function MarketingFooter() {
  return (
    <footer className="premium-footer border-t">
      <div className="page-container pt-8 pb-10 md:pt-10 md:pb-12">
        <Reveal
          preset="panel"
          className="closing-panel material-panel relative flex flex-col justify-between gap-10 p-7 sm:p-10 md:min-h-[420px] md:flex-row md:items-end md:p-14"
        >
          <div className="closing-lightscape" aria-hidden="true">
            <div className="closing-light-column" />
            <svg
              viewBox="0 0 600 480"
              fill="none"
              className="closing-aperture-lines"
            >
              <defs>
                <linearGradient
                  id="closing-rim"
                  x1="100"
                  y1="50"
                  x2="430"
                  y2="450"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#e7fff3" stopOpacity=".7" />
                  <stop offset=".35" stopColor="#9aefc0" stopOpacity=".04" />
                  <stop offset=".8" stopColor="#a6f1cb" stopOpacity=".55" />
                  <stop offset="1" stopColor="#e7fff3" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g transform="rotate(-24 300 240)">
                <ellipse
                  cx="300"
                  cy="240"
                  rx="186"
                  ry="226"
                  stroke="url(#closing-rim)"
                  strokeWidth="1"
                />
                <ellipse
                  cx="300"
                  cy="240"
                  rx="166"
                  ry="203"
                  stroke="url(#closing-rim)"
                  strokeWidth=".5"
                />
                <ellipse
                  cx="300"
                  cy="240"
                  rx="224"
                  ry="94"
                  stroke="url(#closing-rim)"
                  strokeWidth=".7"
                />
              </g>
            </svg>
            <BrandMark className="closing-brand-echo" />
          </div>

          <div>
            <p className="closing-caption closing-kicker eyebrow mb-7">
              Bring a little clarity to your queue
            </p>
            <ScrollHeading
              mode="highlight"
              className="closing-heading max-w-2xl font-heading text-[clamp(2.7rem,6vw,5.6rem)] leading-[0.98] font-medium tracking-[-0.065em]"
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
