import { Inbox, RefreshCw, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingState() {
  return (
    <div
      className="space-y-3"
      role="status"
      aria-label="Loading workspace data"
    >
      <span className="sr-only">Loading workspace data</span>
      {[1, 2, 3].map((n) => (
        <Skeleton key={n} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  )
}
export function EmptyState({
  title = "A little breathing room.",
  description = "No tickets match this view.",
  action,
}: {
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="workspace-empty flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 py-12 text-center">
      <span className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-signal/15 bg-signal-surface">
        <Inbox className="size-5 text-signal" />
      </span>
      <h2 className="font-heading text-xl font-medium tracking-tight">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
export function ErrorState({
  retry,
  title = "We couldn’t load this view.",
}: {
  retry: () => void
  title?: string
}) {
  return (
    <div
      role="alert"
      className="workspace-panel flex min-h-72 flex-col items-center justify-center rounded-2xl border px-6 py-10 text-center"
    >
      <TriangleAlert className="mb-4 size-6 text-warning" />
      <h2 className="font-heading text-xl font-medium">{title}</h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Please try again. No account data has been changed.
      </p>
      <Button
        variant="outline"
        className="mt-6 h-10 rounded-xl"
        onClick={retry}
      >
        <RefreshCw className="mr-2 size-3.5" />
        Try again
      </Button>
    </div>
  )
}
