import assert from "node:assert/strict"
import test from "node:test"
import { z } from "zod"
import { createApiClient, ApiError } from "./client.ts"

const resultSchema = z.object({ id: z.string() })
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })

test("validates envelopes before exposing data", async () => {
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    fetcher: async () => json({ data: { id: "a" }, requestId: "req-1" }),
  })
  assert.deepEqual(await client.get("/me/bootstrap", resultSchema), {
    data: { id: "a" },
    requestId: "req-1",
  })
})
test("rejects malformed successful payloads rather than trusting a generic cast", async () => {
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    fetcher: async () => json({ data: { id: 123 }, requestId: "req-1" }),
  })
  await assert.rejects(
    client.get("/me/bootstrap", resultSchema),
    (error: unknown) =>
      error instanceof ApiError && error.code === "INVALID_RESPONSE"
  )
})
test("HTML gateway failures never become user-facing raw response text", async () => {
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    fetcher: async () =>
      new Response("<html>secret upstream error</html>", { status: 502 }),
  })
  await assert.rejects(
    client.get("/me/bootstrap", resultSchema),
    (error: unknown) =>
      error instanceof ApiError &&
      !error.message.includes("secret") &&
      error.status === 502
  )
})
test("normalizes an expired session and retains request correlation without leaking raw server text", async () => {
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    fetcher: async () =>
      json(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "raw token must not be echoed",
            details: null,
          },
          requestId: "req-expired",
          timestamp: "2026-10-15T12:00:00Z",
        },
        401
      ),
  })
  await assert.rejects(
    client.get("/me/bootstrap", resultSchema),
    (error: unknown) =>
      error instanceof ApiError &&
      error.code === "UNAUTHENTICATED" &&
      error.requestId === "req-expired" &&
      !error.message.includes("token")
  )
})
test("timeouts finish even when a fetch adapter ignores AbortSignal", async () => {
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    timeoutMs: 15,
    fetcher: () => new Promise(() => {}),
  })
  await assert.rejects(
    client.get("/me/bootstrap", resultSchema),
    (error: unknown) =>
      error instanceof ApiError && error.code === "DEPENDENCY_TIMEOUT"
  )
})
test("rejects cross-origin path overrides before a bearer token can leave the intended API", async () => {
  let calls = 0
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    accessToken: () => "private-token",
    fetcher: async () => {
      calls++
      return json({ data: { id: "a" }, requestId: "r" })
    },
  })
  await assert.rejects(client.get("//evil.example.test/collect", resultSchema))
  assert.equal(calls, 0)
})
test("forbids unsafe URL schemes and embedded credentials in base configuration", () => {
  assert.throws(() =>
    createApiClient({ baseUrl: "https://user:secret@api.example.test" })
  )
  assert.throws(() => createApiClient({ baseUrl: "javascript:alert(1)" }))
})
test("validates paginated meta rather than losing the list contract", async () => {
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    fetcher: async () =>
      json({
        data: [{ id: "a" }],
        meta: { page: 1, limit: 20, total: 1, hasNext: false },
        requestId: "r",
      }),
  })
  assert.deepEqual(
    (await client.list("/workspaces/w/tickets", resultSchema)).meta,
    { page: 1, limit: 20, total: 1, hasNext: false }
  )
})
test("malformed list metadata is rejected", async () => {
  const client = createApiClient({
    baseUrl: "https://api.example.test",
    fetcher: async () =>
      json({
        data: [{ id: "a" }],
        meta: { page: 0, limit: 999, total: -1, hasNext: false },
        requestId: "r",
      }),
  })
  await assert.rejects(client.list("/workspaces/w/tickets", resultSchema))
})

test("authenticated writes retain their idempotency key through the same-origin session proxy", async () => {
  let received: RequestInit | undefined
  let address = ""
  const client = createApiClient({
    baseUrl: "https://handled.example.test",
    apiPath: "/api/handled",
    credentials: "same-origin",
    fetcher: async (url, init) => {
      address = String(url)
      received = init
      return json({ data: { id: "action" }, requestId: "queued" }, 202)
    },
  })
  await client.post(
    "/workspaces/w/proposals/p/approve",
    { expectedVersion: 2 },
    resultSchema,
    { idempotencyKey: "stable-decision" }
  )
  assert.equal(
    address,
    "https://handled.example.test/api/handled/workspaces/w/proposals/p/approve"
  )
  assert.equal(received?.method, "POST")
  assert.equal(received?.credentials, "same-origin")
  assert.equal(
    new Headers(received?.headers).get("Idempotency-Key"),
    "stable-decision"
  )
  assert.deepEqual(JSON.parse(String(received?.body)), { expectedVersion: 2 })
})
