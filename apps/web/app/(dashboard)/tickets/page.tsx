import type { Metadata } from "next"
import { TicketInbox } from "@/features/tickets/ticket-inbox"
export const metadata: Metadata = { title: "Ticket inbox" }
export default function TicketsPage() {
  return <TicketInbox />
}
