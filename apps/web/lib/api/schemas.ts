import { z } from "zod"

export const paginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().nonnegative(),
  hasNext: z.boolean(),
})
export type PaginationMeta = z.infer<typeof paginationSchema>
export interface ApiResponse<T> {
  data: T
  requestId: string
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta
}

export const errorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().nullable().optional(),
  }),
  requestId: z.string().min(1),
  timestamp: z.string(),
})

// Wire enums align with apps/api/src/common/contracts/domain.enums.ts.
// Ticket fields below are a PREVIEW view model, not a frozen business API DTO.
export const ticketStatuses = [
  "NEW",
  "QUEUED",
  "INVESTIGATING",
  "AWAITING_APPROVAL",
  "NEEDS_REVIEW",
  "EXECUTING",
  "EXECUTION_FAILED",
  "RESOLVED",
  "REJECTED",
  "CLOSED",
] as const
export const ticketPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const
export const ticketPreviewSchema = z.object({
  id: z.uuid(),
  workspaceId: z.uuid(),
  reference: z.string(),
  subject: z.string(),
  message: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.email(),
    initials: z.string(),
  }),
  status: z.enum(ticketStatuses),
  priority: z.enum(ticketPriorities),
  category: z.string(),
  createdAt: z.iso.datetime(),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  recommendation: z.string(),
  action: z.enum([
    "REFUND_DUPLICATE_PAYMENT",
    "CANCEL_AT_PERIOD_END",
    "RESTORE_PRODUCT_ACCESS",
  ]),
  replyDraft: z.string(),
  evidence: z.array(
    z.object({
      reference: z.string(),
      title: z.string(),
      detail: z.string(),
      kind: z.enum(["account", "policy"]),
    })
  ),
})
export type TicketPreview = z.infer<typeof ticketPreviewSchema>
export type TicketStatus = TicketPreview["status"]
export type TicketPriority = TicketPreview["priority"]
export interface TicketFilters {
  search?: string
  status?: TicketStatus | "ALL"
  priority?: TicketPriority | "ALL"
}
