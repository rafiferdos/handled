import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TicketPriority, TicketStatus } from "@/lib/api/schemas"

export function humanize(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase())
}
export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 text-[9px] font-normal",
        status === "AWAITING_APPROVAL"
          ? "border-success/20 bg-success-surface text-success"
          : status === "NEEDS_REVIEW" || status === "EXECUTION_FAILED"
            ? "border-warning/20 bg-warning-surface text-warning"
            : "bg-muted text-muted-foreground"
      )}
    >
      <span className="size-1 rounded-full bg-current" />
      {humanize(status)}
    </Badge>
  )
}
export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px]",
        priority === "URGENT" || priority === "HIGH"
          ? "text-warning"
          : "text-muted-foreground"
      )}
    >
      <span aria-hidden="true" className="font-mono">
        {priority === "URGENT" ? "!!!" : priority === "HIGH" ? "!!" : "!"}
      </span>
      {humanize(priority)}
    </span>
  )
}
