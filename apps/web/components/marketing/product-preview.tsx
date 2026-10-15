import { sampleTickets } from "@/lib/api/fixtures"
import { SampleShowcase, type ShowcaseCopy } from "./sample-showcase"

const copy: Record<string, ShowcaseCopy> = {
  "TKT-1001": {
    label: "Duplicate payment",
    outcome: "Review a $29.00 duplicate refund.",
    explanation:
      "Two settled payments. One billing period. A published policy to check before a person decides.",
    evidenceNotes: [
      "Two $29.00 payments for the same period",
      "Duplicate charges are eligible for review",
    ],
    signal: "Evidence supports a review",
  },
  "TKT-1002": {
    label: "Cancellation",
    outcome: "Keep access through the paid period.",
    explanation:
      "The sample subscription runs through October 31. Review a period-end cancellation that respects the time already paid for.",
    evidenceNotes: [
      "Team plan active through October 31",
      "Access continues until the paid period ends",
    ],
    signal: "Check the timing, then decide",
  },
  "TKT-1003": {
    label: "Missing access",
    outcome: "Manual review comes first.",
    explanation:
      "A settled payment alone is not enough. A person must verify the product mapping before deciding whether access should change.",
    evidenceNotes: [
      "Account mapping is unverified",
      "Restoration needs verified product evidence",
    ],
    signal: "Incomplete evidence · no approval",
  },
}

export function ProductPreview() {
  // Validate fixtures on the server; do not ship the schema runtime for a demo.
  const cases = sampleTickets.flatMap((ticket) =>
    copy[ticket.reference] ? [{ ticket, copy: copy[ticket.reference] }] : []
  )
  return <SampleShowcase cases={cases} />
}
