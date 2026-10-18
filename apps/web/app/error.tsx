"use client"

import { Button } from "@/components/ui/button"
import { ButtonLink } from "@/components/shared/button-link"

export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <main
      id="main-content"
      className="page-container flex min-h-[70svh] flex-col items-start justify-center py-16"
    >
      <p className="eyebrow mb-5 text-muted-foreground">A moment to regroup</p>
      <h1 className="font-heading text-4xl font-medium tracking-tight">
        Something interrupted this page.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        Please try again. If the problem continues, return to the public
        website.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={retry}>Try again</Button>
        <ButtonLink href="/" variant="outline">
          Return home
        </ButtonLink>
      </div>
    </main>
  )
}
