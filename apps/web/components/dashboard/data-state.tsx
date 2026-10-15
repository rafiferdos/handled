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
  description = "No sample tickets match this view.",
  action,
}: {
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted">
        <Inbox className="size-5 text-muted-foreground" />
      </span>
      <h2 className="font-heading text-xl font-medium tracking-tight">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
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
      className="flex min-h-64 flex-col items-center justify-center rounded-2xl border px-6 py-10 text-center"
    >
      <TriangleAlert className="mb-4 size-6 text-warning" />
      <h2 className="font-heading text-xl font-medium">{title}</h2>
      <p className="mt-2 max-w-sm text-xs text-muted-foreground">
        Please try again. No account data has been changed.
      </p>
      <Button variant="outline" className="mt-5" onClick={retry}>
        <RefreshCw className="mr-2 size-3.5" />
        Try again
      </Button>
    </div>
  )
}
