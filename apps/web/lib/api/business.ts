import { z } from "zod"
import type { createApiClient } from "./client.ts"
import {
  ticketPriorities,
  ticketStatuses,
  type TicketFilters,
} from "./schemas.ts"

const timestamp = z.iso.datetime({ offset: true })
const version = z.number().int().positive()
export const actionTypes = [
  "REFUND_DUPLICATE_PAYMENT",
  "CANCEL_AT_PERIOD_END",
  "RESTORE_PRODUCT_ACCESS",
] as const
export const ticketSchema = z.object({
  id: z.uuid(),
  reference: z.string(),
  subject: z.string(),
  category: z.string().nullable(),
  priority: z.enum(ticketPriorities),
  status: z.enum(ticketStatuses),
  customerId: z.uuid().nullable(),
  customerVerifiedAt: timestamp.nullable(),
  assigneeId: z.uuid().nullable(),
  requesterEmail: z.string().nullable(),
  requesterCustomerRef: z.string().nullable(),
  version,
  source: z.string(),
  createdAt: timestamp,
  updatedAt: timestamp,
})
export type LiveTicket = z.infer<typeof ticketSchema>
export const customerSchema = z.object({
  id: z.uuid(),
  externalRef: z.string(),
  name: z.string(),
  email: z.email(),
  status: z.string(),
  version,
})
export const messageSchema = z.object({
  id: z.uuid(),
  authorType: z.string(),
  visibility: z.string(),
  authorUserId: z.uuid().nullable(),
  body: z.string(),
  createdAt: timestamp,
})
export const recommendationSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("REFUND_DUPLICATE_PAYMENT"),
    targetRef: z.string().min(1),
    params: z.strictObject({
      amountMinor: z.number().int().positive(),
      currency: z.string().regex(/^[A-Z]{3}$/),
    }),
  }),
  z.strictObject({
    type: z.literal("CANCEL_AT_PERIOD_END"),
    targetRef: z.string().min(1),
    params: z.strictObject({}),
  }),
  z.strictObject({
    type: z.literal("RESTORE_PRODUCT_ACCESS"),
    targetRef: z.string().min(1),
    params: z.strictObject({}),
  }),
])
const sourceFields = {
  sourceRefId: z.string(),
  title: z.string(),
  excerpt: z.string(),
  contentHash: z.string(),
  observedAt: timestamp,
}
export const sourceSchema = z.discriminatedUnion("sourceType", [
  z.object({ sourceType: z.literal("TOOL"), ...sourceFields }),
  z.object({
    sourceType: z.literal("KNOWLEDGE"),
    ...sourceFields,
    documentId: z.uuid(),
    documentVersion: version,
    chunkId: z.uuid(),
    score: z.number().nullable(),
  }),
])
export const proposalSchema = z.object({
  id: z.uuid(),
  workspaceId: z.uuid(),
  ticketId: z.uuid(),
  investigationId: z.uuid(),
  version,
  status: z.enum([
    "DRAFT",
    "READY",
    "APPROVED",
    "REJECTED",
    "ESCALATED",
    "SUPERSEDED",
  ]),
  category: z.string(),
  summary: z.string(),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  missingFacts: z.array(z.string()),
  recommendation: recommendationSchema.nullable(),
  replyDraft: z.string(),
  evidenceRefs: z.array(z.string()),
  sources: z.array(sourceSchema),
  createdAt: timestamp,
})
export type LiveProposal = z.infer<typeof proposalSchema>
export const investigationSchema = z.object({
  id: z.uuid(),
  workspaceId: z.uuid(),
  ticketId: z.uuid(),
  status: z.enum(["QUEUED", "RUNNING", "COMPLETED", "FAILED", "NEEDS_REVIEW"]),
  triggeredByUserId: z.uuid(),
  model: z.string().nullable(),
  promptVersion: z.string().nullable(),
  startedAt: timestamp.nullable(),
  finishedAt: timestamp.nullable(),
  failureCode: z.string().nullable(),
  createdAt: timestamp,
})
export const investigationDetailSchema = investigationSchema.extend({
  steps: z.array(
    z.object({
      id: z.uuid(),
      sequence: version,
      type: z.string(),
      label: z.string(),
      status: z.string(),
      toolName: z.string().nullable(),
      sourceRefs: z.array(z.string()),
      durationMs: z.number().nullable(),
      errorCode: z.string().nullable(),
    })
  ),
  proposal: proposalSchema.nullable(),
})
export const actionSchema = z.object({
  id: z.uuid(),
  ticketId: z.uuid(),
  proposalId: z.uuid(),
  proposalVersion: version,
  type: z.enum(actionTypes),
  targetRef: z.string(),
  status: z.enum([
    "QUEUED",
    "RUNNING",
    "SUCCEEDED",
    "FAILED",
    "OUTCOME_UNKNOWN",
  ]),
  attempts: z.number().int().nonnegative(),
  version,
  beforeState: z.unknown(),
  afterState: z.unknown(),
  failureCode: z.string().nullable(),
  retryable: z.boolean(),
  simulation: z.boolean(),
  createdAt: timestamp,
  finishedAt: timestamp.nullable(),
})
export const auditSchema = z.object({
  id: z.uuid(),
  entityType: z.string(),
  entityId: z.uuid(),
  eventType: z.string(),
  actorType: z.string(),
  actorId: z.uuid().nullable(),
  metadata: z.unknown(),
  requestId: z.string(),
  createdAt: timestamp,
})
export const policyRulesSchema = z.object({
  allowedActions: z.array(z.enum(actionTypes)),
  maxRefundMinor: z.number().int().positive().optional(),
  deniedActions: z.array(z.enum(actionTypes)).optional(),
})
export const knowledgeSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  version,
  publishedVersion: version.nullable(),
})
export const knowledgeDetailSchema = knowledgeSchema.extend({
  body: z.string(),
  policyRules: policyRulesSchema,
  publishedRevision: z
    .object({
      version,
      indexStatus: z.enum(["PENDING", "INDEXING", "READY", "FAILED"]),
      embeddingModel: z.string().nullable(),
      failureCode: z.string().nullable(),
      publishedAt: timestamp,
      contentHash: z.string(),
    })
    .nullable(),
})
export type KnowledgeDocument = z.infer<typeof knowledgeSchema>
export type KnowledgeInput = {
  slug: string
  title: string
  body: string
  policyRules: z.infer<typeof policyRulesSchema>
}
export function ticketPath(workspaceId: string, ticketId?: string) {
  return `/workspaces/${z.uuid().parse(workspaceId)}/tickets${ticketId ? `/${z.uuid().parse(ticketId)}` : ""}`
}
export function createBusinessApi(
  api: ReturnType<typeof createApiClient>,
  workspaceId: string
) {
  const base = `/workspaces/${z.uuid().parse(workspaceId)}`
  const ticket = (id: string) => ticketPath(workspaceId, id)
  return {
    tickets(filters: TicketFilters = {}, page = 1) {
      const query = new URLSearchParams({ page: String(page), limit: "25" })
      if (filters.search?.trim())
        query.set("search", filters.search.trim().slice(0, 100))
      if (filters.status && filters.status !== "ALL")
        query.set("status", filters.status)
      if (filters.priority && filters.priority !== "ALL")
        query.set("priority", filters.priority)
      return api.list(`${base}/tickets?${query}`, ticketSchema)
    },
    ticket: (id: string) => api.get(ticket(id), ticketSchema),
    messages: (id: string) =>
      api.list(`${ticket(id)}/messages?limit=100`, messageSchema),
    customers: (search = "") =>
      api.list(
        `${base}/customers?limit=100${search.trim() ? `&search=${encodeURIComponent(search.trim().slice(0, 100))}` : ""}`,
        customerSchema
      ),
    customer: (id: string) =>
      api.get(`${base}/customers/${z.uuid().parse(id)}`, customerSchema),
    verifyCustomer: (
      id: string,
      customerId: string,
      verificationReason: string,
      expectedVersion: number
    ) =>
      api.post(
        `${ticket(id)}/verify-customer`,
        { customerId, verificationReason, expectedVersion },
        ticketSchema
      ),
    investigations: (id: string) =>
      api.list(`${ticket(id)}/investigations?limit=100`, investigationSchema),
    investigation: (id: string) =>
      api.get(
        `${base}/investigations/${z.uuid().parse(id)}`,
        investigationDetailSchema
      ),
    startInvestigation: (id: string) =>
      api.post(
        `${ticket(id)}/investigations`,
        {},
        z.object({
          investigationId: z.uuid(),
          status: z.enum(["QUEUED", "RUNNING"]),
        })
      ),
    retryInvestigation: (id: string) =>
      api.post(
        `${base}/investigations/${z.uuid().parse(id)}/retry`,
        {},
        z.object({
          investigationId: z.uuid(),
          status: z.enum(["QUEUED", "RUNNING"]),
        })
      ),
    editProposal: (
      proposal: LiveProposal,
      summary: string,
      replyDraft: string
    ) =>
      api.post(
        `${base}/proposals/${z.uuid().parse(proposal.id)}/edit`,
        {
          expectedVersion: proposal.version,
          summary,
          replyDraft,
          recommendation: proposal.recommendation,
        },
        proposalSchema
      ),
    approveProposal: (
      proposal: LiveProposal,
      idempotencyKey: string,
      reason?: string
    ) => {
      const humanReason = reason?.trim()
      if (proposal.confidence === "MEDIUM" && !humanReason)
        throw new Error(
          "Add an approval reason for medium-confidence evidence."
        )
      if (humanReason && humanReason.length > 2000)
        throw new Error("Keep the approval reason under 2000 characters.")
      return api.post(
        `${base}/proposals/${z.uuid().parse(proposal.id)}/approve`,
        {
          expectedVersion: proposal.version,
          ...(humanReason ? { reason: humanReason } : {}),
        },
        z.object({ actionExecutionId: z.uuid(), status: z.literal("QUEUED") }),
        { idempotencyKey }
      )
    },
    decideProposal: (
      proposal: LiveProposal,
      decision: "reject" | "escalate",
      reason: string
    ) =>
      api.post(
        `${base}/proposals/${z.uuid().parse(proposal.id)}/${decision}`,
        { expectedVersion: proposal.version, reason },
        z.object({
          decisionId: z.uuid(),
          proposalId: z.uuid(),
          proposalVersion: version,
          decision: z.enum(["REJECTED", "ESCALATED"]),
          actorUserId: z.uuid(),
          reason: z.string().nullable(),
          createdAt: timestamp,
        })
      ),
    actions: (id: string) =>
      api.list(`${ticket(id)}/actions?limit=100`, actionSchema),
    retryAction: (id: string, expectedVersion: number) =>
      api.post(
        `${base}/actions/${z.uuid().parse(id)}/retry`,
        { expectedVersion },
        z.object({ actionExecutionId: z.uuid(), status: z.literal("QUEUED") })
      ),
    reconcileAction: (id: string, expectedVersion: number) =>
      api.post(
        `${base}/actions/${z.uuid().parse(id)}/reconcile`,
        { expectedVersion },
        actionSchema
      ),
    audit: (id?: string, page = 1) =>
      api.list(
        `${id ? ticket(id) : base}/audit?limit=25&page=${page}`,
        auditSchema
      ),
    knowledge: () =>
      api.list(`${base}/knowledge/documents?limit=100`, knowledgeSchema),
    knowledgeDetail: (id: string) =>
      api.get(
        `${base}/knowledge/documents/${z.uuid().parse(id)}`,
        knowledgeDetailSchema
      ),
    createKnowledge: (input: KnowledgeInput) =>
      api.post(`${base}/knowledge/documents`, input, knowledgeSchema),
    updateKnowledge: (
      id: string,
      expectedVersion: number,
      input: KnowledgeInput
    ) =>
      api.patch(
        `${base}/knowledge/documents/${z.uuid().parse(id)}`,
        { ...input, expectedVersion },
        knowledgeSchema
      ),
    publishKnowledge: (id: string, expectedVersion: number) =>
      api.post(
        `${base}/knowledge/documents/${z.uuid().parse(id)}/publish`,
        { expectedVersion },
        knowledgeSchema
      ),
    reindexKnowledge: (id: string, expectedVersion: number) =>
      api.post(
        `${base}/knowledge/documents/${z.uuid().parse(id)}/reindex`,
        { expectedVersion },
        z.object({
          documentId: z.uuid(),
          version,
          indexStatus: z.literal("PENDING"),
        })
      ),
  }
}
