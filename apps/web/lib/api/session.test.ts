import assert from "node:assert/strict"
import test from "node:test"
import { QueryClient } from "@tanstack/react-query"
import { announceSessionChange, signIn } from "./session.ts"

test("account changes notify other tabs without broadcasting credentials or tenant data", async () => {
  const channel = new BroadcastChannel("handled-session")
  try {
    const received = new Promise<unknown>((resolve, reject) => {
      const deadline = setTimeout(
        () => reject(new Error("No cross-tab notification")),
        1000
      )
      channel.onmessage = (event) => {
        clearTimeout(deadline)
        resolve(event.data)
      }
    })
    announceSessionChange()
    assert.equal(await received, "changed")
  } finally {
    channel.close()
  }
})

test("switching accounts cancels private requests and removes the previous user's fresh cached tenant data", async () => {
  const cache = new QueryClient()
  cache.setQueryData(["session"], { id: "user-a" })
  cache.setQueryData(["live", "workspaces", "user-a"], [{ id: "tenant-a" }])
  cache.setQueryData(["live", "tenant-a", "ticket", "private-a"], {
    subject: "Private A ticket",
  })
  let cancelled = false
  const inFlight = cache
    .fetchQuery({
      queryKey: ["live", "tenant-a", "pending"],
      queryFn: ({ signal }) =>
        new Promise((_resolve, reject) =>
          signal.addEventListener("abort", () => {
            cancelled = true
            reject(new Error("Cancelled"))
          })
        ),
    })
    .catch(() => undefined)
  await signIn(
    { email: "b@example.test", password: "password" },
    cache,
    async () =>
      Response.json({ data: { user: { id: "user-b" } }, requestId: "r" })
  )
  await inFlight
  assert.equal(cancelled, true)
  assert.equal(cache.getQueryCache().getAll().length, 0)
})

test("a rejected login does not treat an existing account as the new identity", async () => {
  const cache = new QueryClient()
  cache.setQueryData(["session"], { id: "user-a" })
  await assert.rejects(
    signIn({ email: "b@example.test", password: "wrong" }, cache, async () =>
      Response.json({}, { status: 401 })
    ),
    /email or password/
  )
  assert.deepEqual(cache.getQueryData(["session"]), { id: "user-a" })
})
