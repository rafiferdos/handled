import assert from "node:assert/strict"
import test from "node:test"
import {
  createSampleAdapter,
  sampleWorkspaces,
  ticketQueryKey,
} from "./sample-adapter.ts"

const [acme, pixel] = sampleWorkspaces

test("ticket reads are scoped to their workspace even for a guessed identifier", async () => {
  const adapter = createSampleAdapter()
  const ticket = (await adapter.listTickets(acme.id)).data[0]
  assert.ok(ticket)
  await assert.rejects(adapter.getTicket(pixel.id, ticket.id))
  const other = await adapter.listTickets(pixel.id)
  assert.equal(other.data.length, 0)
  assert.equal(other.meta.total, 0)
})
test("search and status filters combine without exposing unrelated records", async () => {
  const adapter = createSampleAdapter()
  const response = await adapter.listTickets(acme.id, {
    search: "Maya",
    status: "AWAITING_APPROVAL",
  })
  assert.equal(response.data.length, 1)
  assert.equal(response.data[0].reference, "TKT-1001")
  assert.equal(
    (await adapter.listTickets(acme.id, { search: "no-such-ticket" })).data
      .length,
    0
  )
})
test("workspace query keys cannot share cache entries", () => {
  assert.notDeepEqual(ticketQueryKey(acme.id), ticketQueryKey(pixel.id))
  assert.notDeepEqual(
    ticketQueryKey(acme.id, { status: "NEW" }),
    ticketQueryKey(acme.id, { status: "RESOLVED" })
  )
})
test("returned sample data cannot mutate future requests", async () => {
  const adapter = createSampleAdapter()
  const result = await adapter.listTickets(acme.id)
  result.data[0].subject = "mutated"
  assert.equal(
    (await adapter.listTickets(acme.id)).data[0].subject,
    "I was charged twice for my Pro plan."
  )
})
test("invalid workspace identifiers fail closed", async () => {
  const adapter = createSampleAdapter()
  await assert.rejects(adapter.listTickets("unknown-workspace"))
})
