"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useWorkspace } from "@/components/dashboard/workspace-provider"
import type {
  TicketFilters,
  TicketPreview,
  PaginatedResponse,
} from "@/lib/api/schemas"
import { createBusinessApi } from "@/lib/api/business"

export function useBusinessApi() {
  const { api, workspace } = useWorkspace()
  return useMemo(
    () => (api ? createBusinessApi(api, workspace.id) : null),
    [api, workspace.id]
  )
}

type InboxTicket = Pick<
  TicketPreview,
  | "id"
  | "reference"
  | "subject"
  | "status"
  | "priority"
  | "category"
  | "createdAt"
> & { customer: { name: string; initials: string } }

export function useTickets(filters: TicketFilters = {}, page = 1) {
  const { workspace, adapter, mode } = useWorkspace()
  const business = useBusinessApi()
  return useQuery<PaginatedResponse<InboxTicket>>({
    queryKey: [mode, workspace.id, "tickets", filters, page],
    queryFn: async () => {
      if (mode === "sample") return adapter.listTickets(workspace.id, filters)
      if (!business) throw new Error("The workspace connection is unavailable.")
      const response = await business.tickets(filters, page)
      return {
        ...response,
        data: response.data.map((item) => {
          const name =
            item.requesterEmail ??
            item.requesterCustomerRef ??
            (item.customerId ? "Verified customer" : "Unverified requester")
          return {
            ...item,
            category: item.category ?? "Uncategorized",
            customer: { name, initials: name.slice(0, 2).toUpperCase() },
          }
        }),
      }
    },
    refetchInterval: mode === "live" ? 10_000 : false,
  })
}
export function useTicket(ticketId: string) {
  const { workspace, adapter } = useWorkspace()
  return useQuery({
    queryKey: ["sample", workspace.id, "ticket", ticketId],
    queryFn: () => adapter.getTicket(workspace.id, ticketId),
  })
}
