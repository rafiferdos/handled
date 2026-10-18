import assert from "node:assert/strict"
import test from "node:test"
import {
  actionSchema,
  knowledgeDetailSchema,
  proposalSchema,
  ticketSchema,
  ticketPath,
  createBusinessApi,
  type LiveProposal,
} from "./business.ts"
import { createApiClient } from "./client.ts"

const id = "11111111-1111-4111-8111-111111111111"
const proposal: LiveProposal = {
  id,
  workspaceId: id,
  ticketId: id,
  investigationId: id,
  version: 7,
  status: "READY",
  category: "BILLING",
  summary: "Refund",
  confidence: "HIGH",
  missingFacts: [],
  recommendation: {
    type: "REFUND_DUPLICATE_PAYMENT",
    targetRef: "payment-1",
    params: { amountMinor: 1000, currency: "USD" },
  },
  replyDraft: "We reviewed your account.",
  evidenceRefs: [],
  sources: [],
  createdAt: "2026-10-18T00:00:00.000Z",
}
test("proposal decisions reject invalid resource IDs before transport", () => {
  const business = createBusinessApi(
    createApiClient({ baseUrl: "https://api.example.com" }),
    id
  )
  assert.throws(() =>
    business.approveProposal({ ...proposal, id: "../../other" }, "decision-key")
  )
})
test("approval sends the exact version and stable idempotency key", async () => {
  let body: unknown
  let key: string | null = null
  const business = createBusinessApi(
    createApiClient({
      baseUrl: "https://api.example.com",
      fetcher: async (_url, options) => {
        body = JSON.parse(String(options?.body))
        key = new Headers(options?.headers).get("Idempotency-Key")
        return Response.json(
          {
            data: { actionExecutionId: id, status: "QUEUED" },
            requestId: "request-1",
          },
          { status: 202 }
        )
      },
    }),
    id
  )
  const result = await business.approveProposal(proposal, "stable-approval-key")
  assert.deepEqual(body, { expectedVersion: 7 })
  assert.equal(key, "stable-approval-key")
  assert.equal(result.data.status, "QUEUED")
})
test("medium-confidence approval requires a human reason and sends it with the exact version", async () => {
  let body: unknown
  let calls = 0
  const business = createBusinessApi(
    createApiClient({
      baseUrl: "https://api.example.com",
      fetcher: async (_url, options) => {
        calls++
        body = JSON.parse(String(options?.body))
        return Response.json(
          { data: { actionExecutionId: id, status: "QUEUED" }, requestId: "r" },
          { status: 202 }
        )
      },
    }),
    id
  )
  const medium = { ...proposal, confidence: "MEDIUM" as const }
  assert.throws(
    () => business.approveProposal(medium, "decision-key"),
    /reason/
  )
  assert.equal(calls, 0)
  await business.approveProposal(
    medium,
    "decision-key",
    " I checked the cited policy and account records. "
  )
  assert.deepEqual(body, {
    expectedVersion: 7,
    reason: "I checked the cited policy and account records.",
  })
})
test("editing sends full content while retaining validated action parameters", async () => {
  let body: unknown
  const business = createBusinessApi(
    createApiClient({
      baseUrl: "https://api.example.com",
      fetcher: async (_url, options) => {
        body = JSON.parse(String(options?.body))
        return Response.json(
          { data: { ...proposal, version: 8 }, requestId: "request-1" },
          { status: 201 }
        )
      },
    }),
    id
  )
  await business.editProposal(proposal, "Reviewed summary", "Reviewed reply")
  assert.deepEqual(body, {
    expectedVersion: 7,
    summary: "Reviewed summary",
    replyDraft: "Reviewed reply",
    recommendation: proposal.recommendation,
  })
})
test("live tickets accept unverified intake without inventing customer context", () => {
  const ticket = ticketSchema.parse({
    id,
    reference: "T-1",
    subject: "Charged twice",
    category: null,
    priority: "MEDIUM",
    status: "NEW",
    customerId: null,
    customerVerifiedAt: null,
    assigneeId: null,
    requesterEmail: "a@example.com",
    requesterCustomerRef: null,
    version: 1,
    source: "PUBLIC",
    createdAt: "2026-10-18T00:00:00.000Z",
    updatedAt: "2026-10-18T00:00:00.000Z",
  })
  assert.equal(ticket.customerId, null)
  assert.equal("confidence" in ticket, false)
})
test("workspace and ticket paths reject an untrusted resource path", () => {
  assert.equal(ticketPath(id, id), `/workspaces/${id}/tickets/${id}`)
  assert.throws(() => ticketPath(id, "../other-workspace"))
})
test("queued action is distinct from a completed simulated action", () => {
  const action = actionSchema.parse({
    id,
    ticketId: id,
    proposalId: id,
    proposalVersion: 1,
    type: "REFUND_DUPLICATE_PAYMENT",
    targetRef: "payment-1",
    status: "QUEUED",
    attempts: 0,
    version: 1,
    beforeState: null,
    afterState: null,
    failureCode: null,
    retryable: false,
    simulation: true,
    createdAt: "2026-10-18T00:00:00.000Z",
    finishedAt: null,
  })
  assert.equal(action.status, "QUEUED")
  assert.equal(action.afterState, null)
  assert.equal(action.simulation, true)
})
test("knowledge detail retains index failure instead of claiming published means ready", () => {
  const doc = knowledgeDetailSchema.parse({
    id,
    slug: "refund-policy",
    title: "Refund policy",
    status: "PUBLISHED",
    version: 1,
    publishedVersion: 1,
    body: "Policy",
    policyRules: { allowedActions: [] },
    publishedRevision: {
      version: 1,
      indexStatus: "FAILED",
      embeddingModel: "model",
      failureCode: "DEPENDENCY_UNAVAILABLE",
      publishedAt: "2026-10-18T00:00:00.000Z",
      contentHash: "a".repeat(64),
    },
  })
  assert.equal(doc.publishedRevision?.indexStatus, "FAILED")
})
test("proposal rejects unsupported action parameters", () => {
  assert.equal(
    proposalSchema.safeParse({
      id,
      workspaceId: id,
      ticketId: id,
      investigationId: id,
      version: 1,
      status: "READY",
      category: "BILLING",
      summary: "Refund",
      confidence: "HIGH",
      missingFacts: [],
      recommendation: {
        type: "CANCEL_AT_PERIOD_END",
        targetRef: "sub-1",
        params: { arbitrary: true },
      },
      replyDraft: "We reviewed your account.",
      evidenceRefs: [],
      sources: [],
      createdAt: "2026-10-18T00:00:00.000Z",
    }).success,
    false
  )
})
