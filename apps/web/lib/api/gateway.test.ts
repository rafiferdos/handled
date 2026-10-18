import assert from "node:assert/strict"
import test from "node:test"
import { handleApi, handleSession, handleIntake } from "../server/gateway.ts"

const env = {
  HANDLED_API_URL: "https://api.example.test/api/v1",
  SUPABASE_URL: "https://auth.example.test",
  SUPABASE_PUBLISHABLE_KEY: "public-test-key",
}
const json = (body: unknown, status = 200) => Response.json(body, { status })
test("login stores tokens only in protected cookies, returning no bearer credentials", async () => {
  const response = await handleSession(
    new Request("https://app.example.test/api/session", {
      method: "POST",
      headers: {
        Origin: "https://app.example.test",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@example.test",
        password: "private-password",
      }),
    }),
    env,
    async () =>
      json({
        access_token: "private-access",
        refresh_token: "private-refresh",
        expires_in: 3600,
        user: { id: "user-id", email: "admin@example.test" },
      })
  )
  assert.equal(response.status, 200)
  const body = await response.text()
  assert.ok(
    !body.includes("private-access") && !body.includes("private-refresh")
  )
  const cookies = response.headers.getSetCookie()
  assert.equal(cookies.length, 2)
  assert.ok(
    cookies.every(
      (cookie) =>
        cookie.includes("HttpOnly") &&
        cookie.includes("Secure") &&
        cookie.includes("SameSite=Lax")
    )
  )
})
test("session writes reject cross-origin requests before contacting auth", async () => {
  let calls = 0
  const response = await handleSession(
    new Request("https://app.example.test/api/session", {
      method: "POST",
      headers: { Origin: "https://evil.example.test" },
      body: "{}",
    }),
    env,
    async () => {
      calls++
      return json({})
    }
  )
  assert.equal(response.status, 403)
  assert.equal(calls, 0)
})

test("sign-out revokes a refresh-only session after its access cookie expired", async () => {
  const calls: { url: string; authorization: string | null }[] = []
  const response = await handleSession(
    new Request("https://app.example.test/api/session", {
      method: "DELETE",
      headers: {
        Origin: "https://app.example.test",
        Cookie: "handled_refresh=still-active",
      },
    }),
    env,
    async (url, init) => {
      calls.push({
        url: String(url),
        authorization: new Headers(init?.headers).get("Authorization"),
      })
      if (String(url).includes("/token?"))
        return json({
          access_token: "renewed-for-revocation",
          refresh_token: "new-refresh",
          expires_in: 3600,
          user: { id: "user-id" },
        })
      return new Response(null, { status: 204 })
    }
  )
  assert.equal(response.status, 200)
  assert.equal(calls.length, 2)
  assert.ok(calls[1].url.endsWith("logout?scope=local"))
  assert.equal(calls[1].authorization, "Bearer renewed-for-revocation")
  assert.ok(
    response.headers
      .getSetCookie()
      .every((cookie) => cookie.includes("Max-Age=0"))
  )
})

test("an auth outage does not masquerade as wrong credentials or successful provider sign-out", async () => {
  for (const method of ["POST", "DELETE"]) {
    const response = await handleSession(
      new Request("https://app.example.test/api/session", {
        method,
        headers: {
          Origin: "https://app.example.test",
          Cookie: "handled_refresh=active",
          "Content-Type": "application/json",
        },
        body:
          method === "POST"
            ? JSON.stringify({ email: "a@example.test", password: "password" })
            : undefined,
      }),
      env,
      async () => json({}, 503)
    )
    assert.equal(response.status, 503)
    assert.equal(response.headers.getSetCookie().length, 0)
  }
})
test("expired API session refreshes once and retries the identical idempotent decision", async () => {
  const calls: { url: string; headers: Headers; body: string | undefined }[] =
    []
  const response = await handleApi(
    new Request(
      "https://app.example.test/api/handled/workspaces/w/proposals/p/approve",
      {
        method: "POST",
        headers: {
          Origin: "https://app.example.test",
          Cookie: "handled_access=old; handled_refresh=refresh",
          "Content-Type": "application/json",
          "Idempotency-Key": "same-decision",
        },
        body: '{"expectedVersion":1}',
      }
    ),
    ["workspaces", "w", "proposals", "p", "approve"],
    env,
    async (url, init) => {
      calls.push({
        url: String(url),
        headers: new Headers(init?.headers),
        body: init?.body?.toString(),
      })
      if (String(url).includes("/auth/v1/token"))
        return json({
          access_token: "new",
          refresh_token: "next",
          expires_in: 3600,
          user: { id: "user-id" },
        })
      if (new Headers(init?.headers).get("Authorization") === "Bearer old")
        return json({ error: { code: "UNAUTHENTICATED" } }, 401)
      return json(
        { data: { actionExecutionId: "action" }, requestId: "r" },
        202
      )
    }
  )
  assert.equal(response.status, 202)
  assert.equal(calls.length, 3)
  assert.equal(calls[2].headers.get("Idempotency-Key"), "same-decision")
  assert.equal(calls[0].body, calls[2].body)
  assert.ok(!calls[2].headers.has("Cookie"))
})
test("gateway refuses path escapes and public endpoints through the authenticated proxy", async () => {
  for (const path of [
    ["..", "collect"],
    ["public", "workspaces", "test", "tickets"],
  ]) {
    const response = await handleApi(
      new Request("https://app.example.test/api/handled/test", {
        headers: { Cookie: "handled_access=a" },
      }),
      path,
      env,
      async () => {
        throw new Error("must not fetch")
      }
    )
    assert.equal(response.status, 404)
  }
})
test("public proxy uses configured token and verified platform IP, never caller supplied IP", async () => {
  let forwarded: Headers | undefined
  const response = await handleIntake(
    new Request("https://app.example.test/api/support/test", {
      method: "POST",
      headers: {
        Origin: "https://app.example.test",
        "Content-Type": "application/json",
        "Idempotency-Key": "public-key",
        "x-vercel-forwarded-for": "203.0.113.42",
        "x-forwarded-for": "1.2.3.4",
      },
      body: JSON.stringify({
        subject: "A duplicate charge",
        body: "Please check my account.",
        requesterEmail: "customer@example.test",
      }),
    }),
    "test",
    {
      ...env,
      VERCEL: "1",
      SUPPORT_FORMS_JSON: JSON.stringify({ test: "private-form-token" }),
      SUPPORT_PROXY_SECRET: "private-proxy-secret",
    },
    async (_url, init) => {
      forwarded = new Headers(init?.headers)
      return json({ data: { receipt: "accepted" }, requestId: "r" }, 201)
    }
  )
  assert.equal(response.status, 201)
  assert.equal(forwarded?.get("x-support-form-token"), "private-form-token")
  assert.equal(forwarded?.get("x-support-client-ip"), "203.0.113.42")
  assert.equal(forwarded?.get("x-support-signature")?.length, 64)
  assert.ok(!(await response.text()).includes("private-form-token"))
})
