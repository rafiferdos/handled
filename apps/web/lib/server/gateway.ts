import { createHmac } from "node:crypto"
import { isIP } from "node:net"
import { z } from "zod"

type Environment = Record<string, string | undefined>
type Tokens = {
  access_token: string
  refresh_token: string
  expires_in: number
  user: { id: string; email?: string }
}
const tokensSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.number().positive(),
  user: z.object({ id: z.string(), email: z.string().optional() }),
})
const requestTimeout = 85_000
const noStore = { "Cache-Control": "private, no-store" }

function failure(code: string, status: number): Response {
  return Response.json(
    {
      error: {
        code,
        message: "The request could not be completed.",
        details: null,
      },
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    },
    { status, headers: noStore }
  )
}
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  return origin === new URL(request.url).origin
}
function configuration(env: Environment) {
  const api = new URL(env.HANDLED_API_URL || "https://invalid.invalid/api/v1")
  const auth = new URL(env.SUPABASE_URL || "https://invalid.invalid")
  if (
    !env.HANDLED_API_URL ||
    !env.SUPABASE_URL ||
    !env.SUPABASE_PUBLISHABLE_KEY ||
    api.protocol !== "https:" ||
    auth.protocol !== "https:" ||
    api.username ||
    api.password ||
    auth.username ||
    auth.password ||
    api.search ||
    api.hash ||
    api.pathname !== "/api/v1"
  )
    throw new Error("Unconfigured gateway")
  return {
    api: api.toString().replace(/\/$/, ""),
    auth: auth.origin,
    key: env.SUPABASE_PUBLISHABLE_KEY,
  }
}
function cookie(request: Request, name: string) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}
function storeTokens(response: Response, tokens: Tokens, secure: boolean) {
  const attributes = `Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`
  response.headers.append(
    "Set-Cookie",
    `handled_access=${tokens.access_token}; Max-Age=${Math.floor(tokens.expires_in)}; ${attributes}`
  )
  response.headers.append(
    "Set-Cookie",
    `handled_refresh=${tokens.refresh_token}; Max-Age=2592000; ${attributes}`
  )
}
function clearTokens(response: Response, secure: boolean) {
  for (const name of ["handled_access", "handled_refresh"])
    response.headers.append(
      "Set-Cookie",
      `${name}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`
    )
}
async function authRequest(
  env: Environment,
  path: string,
  init: RequestInit,
  fetcher: typeof fetch
) {
  const config = configuration(env)
  return fetcher(`${config.auth}/auth/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  })
}
async function refresh(
  request: Request,
  env: Environment,
  fetcher: typeof fetch
) {
  const token = cookie(request, "handled_refresh")
  if (!token) return null
  const response = await authRequest(
    env,
    "token?grant_type=refresh_token",
    { method: "POST", body: JSON.stringify({ refresh_token: token }) },
    fetcher
  )
  if (response.status >= 500 || response.status === 429)
    throw new Error("Authentication is temporarily unavailable")
  if (!response.ok) return null
  const parsed = tokensSchema.safeParse(await response.json())
  return parsed.success ? parsed.data : null
}
async function safeResponse(upstream: Response) {
  const body: unknown = await upstream.json().catch(() => null)
  if (!body || typeof body !== "object")
    return failure("DEPENDENCY_UNAVAILABLE", 502)
  return Response.json(body, {
    status: upstream.status,
    headers: {
      ...noStore,
      ...(upstream.headers.get("X-Request-Id")
        ? { "X-Request-Id": upstream.headers.get("X-Request-Id")! }
        : {}),
    },
  })
}

export async function handleSession(
  request: Request,
  env: Environment = process.env,
  fetcher: typeof fetch = fetch
) {
  if (request.method !== "GET" && !sameOrigin(request))
    return failure("FORBIDDEN", 403)
  const secure = new URL(request.url).protocol === "https:"
  try {
    configuration(env)
    if (request.method === "DELETE") {
      let token = cookie(request, "handled_access")
      let renewed = token ? null : await refresh(request, env, fetcher)
      token ||= renewed?.access_token
      const revoke = (access: string) =>
        authRequest(
          env,
          "logout?scope=local",
          { method: "POST", headers: { Authorization: `Bearer ${access}` } },
          fetcher
        )
      if (token) {
        let result = await revoke(token)
        if ((result.status === 401 || result.status === 403) && !renewed) {
          renewed = await refresh(request, env, fetcher)
          if (renewed) result = await revoke(renewed.access_token)
        }
        if (!result.ok && result.status !== 401 && result.status !== 403)
          return failure("DEPENDENCY_UNAVAILABLE", 503)
      }
      const response = Response.json(
        { data: { user: null }, requestId: crypto.randomUUID() },
        { headers: noStore }
      )
      clearTokens(response, secure)
      return response
    }
    if (request.method === "POST") {
      const parsed = z
        .object({
          email: z.email().max(254),
          password: z.string().min(1).max(200),
        })
        .safeParse(await request.json().catch(() => null))
      if (!parsed.success) return failure("VALIDATION_ERROR", 400)
      const upstream = await authRequest(
        env,
        "token?grant_type=password",
        { method: "POST", body: JSON.stringify(parsed.data) },
        fetcher
      )
      if (upstream.status >= 500) return failure("DEPENDENCY_UNAVAILABLE", 503)
      if (!upstream.ok)
        return failure(
          upstream.status === 429 ? "RATE_LIMITED" : "INVALID_CREDENTIALS",
          upstream.status === 429 ? 429 : 401
        )
      const tokens = tokensSchema.parse(await upstream.json())
      const response = Response.json(
        { data: { user: tokens.user }, requestId: crypto.randomUUID() },
        { headers: noStore }
      )
      storeTokens(response, tokens, secure)
      return response
    }
    const access = cookie(request, "handled_access")
    if (access) {
      const upstream = await authRequest(
        env,
        "user",
        { method: "GET", headers: { Authorization: `Bearer ${access}` } },
        fetcher
      )
      if (upstream.ok) {
        const user = z
          .object({ id: z.string(), email: z.string().optional() })
          .parse(await upstream.json())
        return Response.json(
          { data: { user }, requestId: crypto.randomUUID() },
          { headers: noStore }
        )
      }
      if (upstream.status !== 401 && upstream.status !== 403)
        return failure("DEPENDENCY_UNAVAILABLE", 503)
    }
    const tokens = await refresh(request, env, fetcher)
    if (!tokens) return failure("UNAUTHENTICATED", 401)
    const response = Response.json(
      { data: { user: tokens.user }, requestId: crypto.randomUUID() },
      { headers: noStore }
    )
    storeTokens(response, tokens, secure)
    return response
  } catch {
    return failure("DEPENDENCY_UNAVAILABLE", 503)
  }
}

export async function handleApi(
  request: Request,
  path: string[],
  env: Environment = process.env,
  fetcher: typeof fetch = fetch
) {
  if (
    !path.length ||
    !["me", "workspaces", "invites"].includes(path[0]) ||
    path.some((part) => !/^[a-zA-Z0-9_-]+$/.test(part))
  )
    return failure("RESOURCE_NOT_FOUND", 404)
  if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(request.method))
    return failure("VALIDATION_ERROR", 405)
  if (request.method !== "GET" && !sameOrigin(request))
    return failure("FORBIDDEN", 403)
  try {
    const config = configuration(env)
    let renewed: Tokens | null = null
    let access = cookie(request, "handled_access")
    if (!access) {
      renewed = await refresh(request, env, fetcher)
      access = renewed?.access_token
    }
    if (!access) return failure("UNAUTHENTICATED", 401)
    const payload = request.method === "GET" ? undefined : await request.text()
    if (payload && Buffer.byteLength(payload) > 256_000)
      return failure("VALIDATION_ERROR", 413)
    const url = `${config.api}/${path.join("/")}${new URL(request.url).search}`
    const send = (token: string) =>
      fetcher(url, {
        method: request.method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Request-Id": crypto.randomUUID(),
          ...(request.headers.get("idempotency-key")
            ? { "Idempotency-Key": request.headers.get("idempotency-key")! }
            : {}),
        },
        body: payload,
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(requestTimeout),
      })
    let upstream = await send(access)
    if (upstream.status === 401 && !renewed) {
      renewed = await refresh(request, env, fetcher)
      if (renewed) upstream = await send(renewed.access_token)
    }
    const response = await safeResponse(upstream)
    if (renewed)
      storeTokens(response, renewed, new URL(request.url).protocol === "https:")
    return response
  } catch {
    return failure("DEPENDENCY_UNAVAILABLE", 503)
  }
}

export async function handleIntake(
  request: Request,
  slug: string,
  env: Environment = process.env,
  fetcher: typeof fetch = fetch
) {
  if (!sameOrigin(request)) return failure("FORBIDDEN", 403)
  try {
    const config = configuration(env)
    const forms = z
      .record(z.string(), z.string().min(1))
      .parse(JSON.parse(env.SUPPORT_FORMS_JSON || "{}"))
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
      !forms[slug] ||
      !env.SUPPORT_PROXY_SECRET
    )
      return failure("PUBLIC_INTAKE_DISABLED", 503)
    // Vercel overwrites this header; arbitrary X-Forwarded-For is never trusted.
    const ip =
      env.VERCEL === "1"
        ? request.headers.get("x-vercel-forwarded-for")?.trim()
        : env.NODE_ENV !== "production"
          ? "127.0.0.1"
          : undefined
    if (!ip || !isIP(ip)) return failure("DEPENDENCY_UNAVAILABLE", 503)
    const body = z
      .object({
        subject: z.string().trim().min(1).max(200),
        body: z.string().trim().min(1).max(10_000),
        requesterEmail: z.email().max(254),
        requesterCustomerRef: z.string().max(64).optional(),
      })
      .strict()
      .safeParse(await request.json().catch(() => null))
    const idempotencyKey = request.headers.get("idempotency-key")
    if (!body.success || !idempotencyKey || idempotencyKey.length > 100)
      return failure("VALIDATION_ERROR", 400)
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const origin = new URL(request.url).origin
    const signature = createHmac("sha256", env.SUPPORT_PROXY_SECRET)
      .update(`${timestamp}\n${slug}\n${origin}\n${ip}`)
      .digest("hex")
    const upstream = await fetcher(
      `${config.api}/public/workspaces/${slug}/tickets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: origin,
          "X-Support-Form-Token": forms[slug],
          "Idempotency-Key": idempotencyKey,
          "X-Support-Client-IP": ip,
          "X-Support-Timestamp": timestamp,
          "X-Support-Signature": signature,
        },
        body: JSON.stringify(body.data),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(requestTimeout),
      }
    )
    return safeResponse(upstream)
  } catch {
    return failure("DEPENDENCY_UNAVAILABLE", 503)
  }
}
