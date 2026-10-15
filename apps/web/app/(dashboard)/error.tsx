"use client"
import { ErrorState } from "@/components/dashboard/data-state"
export default function DashboardError({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return <ErrorState retry={retry} />
}
