import type { Metadata } from "next"
import { TicketDetail } from "@/features/tickets/ticket-detail"
export const metadata: Metadata = { title: "Review sample ticket" }
export default async function TicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>
}) {
  const { ticketId } = await params
  return <TicketDetail ticketId={ticketId} />
}
