import { ApiError } from "./client.ts"
import { sampleTickets, sampleWorkspaces } from "./fixtures.ts"
import type {
  PaginatedResponse,
  TicketFilters,
  TicketPreview,
} from "./schemas.ts"

export { sampleWorkspaces }

export function ticketQueryKey(
  workspaceId: string,
  filters: TicketFilters = {}
) {
  return [
    "sample",
    workspaceId,
    "tickets",
    {
      search: filters.search?.trim().toLowerCase() ?? "",
      status: filters.status ?? "ALL",
      priority: filters.priority ?? "ALL",
    },
  ] as const
}

export function createSampleAdapter() {
  function assertWorkspace(workspaceId: string) {
    if (!sampleWorkspaces.some((workspace) => workspace.id === workspaceId))
      throw new ApiError("RESOURCE_NOT_FOUND", 404)
  }
  return {
    mode: "sample" as const,
    async listTickets(
      workspaceId: string,
      filters: TicketFilters = {}
    ): Promise<PaginatedResponse<TicketPreview>> {
      assertWorkspace(workspaceId)
      const search = filters.search?.trim().toLowerCase() ?? ""
      const data = sampleTickets
        .filter((ticket) => ticket.workspaceId === workspaceId)
        .filter(
          (ticket) =>
            !filters.status ||
            filters.status === "ALL" ||
            ticket.status === filters.status
        )
        .filter(
          (ticket) =>
            !filters.priority ||
            filters.priority === "ALL" ||
            ticket.priority === filters.priority
        )
        .filter((ticket) =>
          `${ticket.reference} ${ticket.subject} ${ticket.customer.name} ${ticket.customer.email}`
            .toLowerCase()
            .includes(search)
        )
      return {
        data: structuredClone(data),
        meta: { page: 1, limit: 20, total: data.length, hasNext: false },
        requestId: "sample-read",
      }
    },
    async getTicket(workspaceId: string, ticketId: string) {
      assertWorkspace(workspaceId)
      const data = sampleTickets.find(
        (ticket) => ticket.workspaceId === workspaceId && ticket.id === ticketId
      )
      if (!data) throw new ApiError("RESOURCE_NOT_FOUND", 404)
      return { data: structuredClone(data), requestId: "sample-read" }
    },
  }
}

export type SampleAdapter = ReturnType<typeof createSampleAdapter>
