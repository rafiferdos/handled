import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Brand } from "@/components/shared/brand"
import { ButtonLink } from "@/components/shared/button-link"

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="page-container flex min-h-svh flex-col py-8"
    >
      <Brand />
      <div className="my-auto max-w-xl py-20">
        <p className="eyebrow mb-5 text-muted-foreground">404 / A loose end</p>
        <h1 className="font-heading text-5xl leading-tight font-medium tracking-[-0.045em] md:text-6xl">
          This page slipped
          <br />
          out of the queue.
        </h1>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The page may have moved, or the address may be incomplete. Let&apos;s
          get you somewhere useful.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" className="h-11 rounded-full px-5">
            <ArrowLeft className="mr-2 size-3.5" />
            Back to Handled
          </ButtonLink>
          <ButtonLink
            href="/dashboard"
            variant="outline"
            className="h-11 rounded-full px-5"
          >
            Preview workspace
            <ArrowUpRight className="ml-3 size-3.5" />
          </ButtonLink>
        </div>
      </div>
    </main>
  )
}
