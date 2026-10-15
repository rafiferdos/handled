"use client"

import { useQuery } from "@tanstack/react-query"
import { useWorkspace } from "@/components/dashboard/workspace-provider"
import { ticketQueryKey } from "@/lib/api/sample-adapter"
import type { TicketFilters } from "@/lib/api/schemas"

export function useTickets(filters: TicketFilters = {}) {
  const { workspace, adapter } = useWorkspace()
  return useQuery({
    queryKey: ticketQueryKey(workspace.id, filters),
    queryFn: () => adapter.listTickets(workspace.id, filters),
  })
}
export function useTicket(ticketId: string) {
  const { workspace, adapter } = useWorkspace()
  return useQuery({
    queryKey: ["sample", workspace.id, "ticket", ticketId],
    queryFn: () => adapter.getTicket(workspace.id, ticketId),
  })
}
