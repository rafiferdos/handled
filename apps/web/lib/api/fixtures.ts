import { ticketPreviewSchema } from "./schemas.ts"

export const sampleWorkspaces = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "AcmeCloud",
    slug: "acme-cloud",
    initials: "AC",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "PixelDesk",
    slug: "pixel-desk",
    initials: "PD",
  },
] as const

const workspaceId = sampleWorkspaces[0].id
/** Canonical golden cases. Illustrative frontend fixtures, never API/DB proof. */
export const sampleTickets = ticketPreviewSchema.array().parse([
  {
    id: "10000000-0000-4000-8000-000000001001",
    workspaceId,
    reference: "TKT-1001",
    subject: "I was charged twice for my Pro plan.",
    message:
      "Hi team, I noticed two charges of $29.00 for my Pro plan this month. Could you check what happened and help me with the extra charge? Thanks!",
    customer: {
      name: "Maya Rahman",
      email: "maya@example.com",
      initials: "MR",
    },
    status: "AWAITING_APPROVAL",
    priority: "HIGH",
    category: "Duplicate charge",
    createdAt: "2026-10-15T08:42:00Z",
    confidence: "HIGH",
    recommendation: "Review a $29.00 duplicate refund for PAY-9002.",
    action: "REFUND_DUPLICATE_PAYMENT",
    replyDraft:
      "Hi Maya, the account records show two settled $29.00 payments for your October Pro subscription. The published duplicate-charge policy supports reviewing the extra payment for a refund. An agent needs to review and approve the next step.",
    evidence: [
      {
        reference: "PAY-9001 / PAY-9002",
        title: "Two settled payments",
        detail:
          "Each payment is 2900 minor units USD for SUB-1001, billing period 2026-10. PAY-9002 is the proposed duplicate target.",
        kind: "account",
      },
      {
        reference: "KB-REFUND-v1",
        title: "Published duplicate-charge policy",
        detail:
          "An additional settled charge for the same customer, subscription, billing period, amount and currency is eligible for review if not already refunded.",
        kind: "policy",
      },
    ],
  },
  {
    id: "10000000-0000-4000-8000-000000001002",
    workspaceId,
    reference: "TKT-1002",
    subject: "Cancel, but keep access to end of month.",
    message:
      "Please cancel my Team subscription at the end of this month. I would still like to use the product until the current period ends.",
    customer: {
      name: "Daniel Lee",
      email: "daniel@example.com",
      initials: "DL",
    },
    status: "NEW",
    priority: "MEDIUM",
    category: "Cancellation",
    createdAt: "2026-10-15T08:10:00Z",
    confidence: "MEDIUM",
    recommendation:
      "Review cancellation at the end of the current billing period.",
    action: "CANCEL_AT_PERIOD_END",
    replyDraft:
      "Hi Daniel, your Team subscription is active through October 31. An agent can review a cancellation at period end, preserving access through that date. No subscription has been changed in this preview.",
    evidence: [
      {
        reference: "SUB-1002",
        title: "Active Team subscription",
        detail:
          "currentPeriodEnd is 2026-10-31 and cancelAtPeriodEnd is false in the account.",
        kind: "account",
      },
      {
        reference: "KB-CANCEL-v1",
        title: "Published cancellation policy",
        detail:
          "Cancellation at current period end preserves access until that date.",
        kind: "policy",
      },
    ],
  },
  {
    id: "10000000-0000-4000-8000-000000001003",
    workspaceId,
    reference: "TKT-1003",
    subject: "Payment succeeded but no product access.",
    message:
      "I paid for my Starter plan, but the product still says my access is revoked. Can you investigate?",
    customer: {
      name: "Sofia Karim",
      email: "sofia@example.com",
      initials: "SK",
    },
    status: "NEEDS_REVIEW",
    priority: "URGENT",
    category: "Product access",
    createdAt: "2026-10-15T07:35:00Z",
    confidence: "LOW",
    recommendation:
      "Review the payment and product mapping before restoring access.",
    action: "RESTORE_PRODUCT_ACCESS",
    replyDraft:
      "Hi Sofia, your account shows a settled payment and a revoked access record. An agent needs to verify the exact product mapping and account evidence before deciding the next step. No access has been changed.",
    evidence: [
      {
        reference: "PAY-9003 / ACCESS-1003",
        title: "Payment and access mismatch",
        detail:
          "A 1900 minor-unit USD settled payment and REVOKED access with SYNC_ERROR. The product mapping requires agent review.",
        kind: "account",
      },
      {
        reference: "KB-ACCESS-v1",
        title: "Published access-restoration policy",
        detail:
          "Active subscription plus the required settled payment and a verified same-product sync mismatch makes access restoration eligible for review.",
        kind: "policy",
      },
    ],
  },
])
