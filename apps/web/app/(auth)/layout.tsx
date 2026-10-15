import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, BookOpen, MessageSquare, ShieldCheck } from "lucide-react"
import { Brand, BrandMark } from "@/components/shared/brand"
import { ThemeToggle } from "@/components/shared/theme-toggle"

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="auth-composition relative hidden overflow-hidden p-12 text-[#f0f3f3] lg:flex lg:flex-col xl:p-16">
        <Brand className="relative z-10" />
        <div className="surface-grid pointer-events-none absolute inset-0 opacity-[0.035]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 size-[680px] rounded-full border border-white/5 shadow-[0_0_0_90px_rgb(255_255_255/0.015),0_0_0_180px_rgb(255_255_255/0.01)]"
        />
        <BrandMark
          aria-hidden="true"
          className="pointer-events-none absolute top-[20%] -right-20 size-[400px] rotate-[-12deg] text-white/[0.025]"
        />
        <div className="relative my-auto py-16">
          <div aria-hidden="true" className="mb-12 flex items-center gap-3">
            {[MessageSquare, BookOpen, ShieldCheck].map((Icon, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl border ${index === 2 ? "border-[#90bba8]/30 bg-[#90bba8]/10 text-[#b6d9c8]" : "border-white/10 bg-white/4 text-[#aabac0]"}`}
                >
                  <Icon className="size-5" />
                </div>
                {index < 2 && <span className="h-px w-6 bg-white/15" />}
              </div>
            ))}
          </div>
          <p className="eyebrow mb-6 text-[#9eafb5]">
            A little clarity goes a long way.
          </p>
          <h2 className="max-w-lg font-heading text-6xl leading-[1.05] font-medium tracking-[-0.05em]">
            Good support
            <br />
            starts with
            <br />
            <span className="text-[#bff5d4]">understanding.</span>
          </h2>
          <p className="mt-7 max-w-sm text-sm leading-relaxed text-[#9eafb5]">
            The question. The context. The thoughtful next step. All in good
            hands.
          </p>
        </div>
        <p className="relative flex items-center gap-3 text-[11px] text-[#9eafb5]">
          <ShieldCheck className="size-4" />
          Evidence-first. Human-controlled.
        </p>
      </aside>
      <div className="flex min-h-svh flex-col">
        <header className="flex items-center justify-between px-6 py-6 md:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2"
          >
            <ArrowLeft className="size-3.5" />
            Back to Handled
          </Link>
          <ThemeToggle />
        </header>
        <main
          id="main-content"
          className="mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-center px-6 py-12 md:px-10"
        >
          {children}
        </main>
        <footer className="px-6 py-6 text-center text-[10px] text-muted-foreground">
          © 2026 Handled · Your next step, thoughtfully considered.
        </footer>
      </div>
    </div>
  )
}
