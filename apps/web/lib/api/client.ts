import { z } from "zod"
import {
  errorEnvelopeSchema,
  paginationSchema,
  type ApiResponse,
  type PaginatedResponse,
} from "./schemas.ts"

const safeMessages: Record<string, string> = {
  UNAUTHENTICATED: "Your session has expired. Please sign in again.",
  FORBIDDEN: "You do not have permission to do that.",
  RESOURCE_NOT_FOUND: "This resource could not be found in your workspace.",
  VALIDATION_ERROR: "Please check the information and try again.",
  PROPOSAL_VERSION_CONFLICT:
    "This proposal changed. Refresh before making a decision.",
  RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
  DEPENDENCY_TIMEOUT: "The request took too long. Please try again.",
  DEPENDENCY_UNAVAILABLE:
    "The service is currently unavailable. Please try again.",
  INVALID_RESPONSE: "The service returned an unexpected response.",
  INVALID_STATE_TRANSITION: "This item changed. Refresh before trying again.",
  BUSINESS_RULE_FAILED:
    "This action is not eligible. Review the current evidence.",
  PUBLIC_INTAKE_DISABLED: "This support form is currently unavailable.",
  INVALID_CREDENTIALS: "The email or password was not accepted.",
}

export class ApiError extends Error {
  readonly code: string
  readonly status: number
  readonly requestId?: string
  constructor(code: string, status = 0, requestId?: string) {
    super(
      safeMessages[code] ??
        "The request could not be completed. Please try again."
    )
    this.name = "ApiError"
    this.code = code
    this.status = status
    this.requestId = requestId
  }
}

interface ClientConfig {
  /** An API origin, e.g. https://api.example.com. No keys or user credentials. */
  baseUrl: string
  accessToken?: () => string | undefined | Promise<string | undefined>
  timeoutMs?: number
  fetcher?: typeof fetch
  apiPath?: "/api/v1" | "/api/handled"
  credentials?: RequestCredentials
  onUnauthenticated?: () => void
}

interface WriteOptions {
  idempotencyKey?: string
}

/** Validated REST transport; session cookies are used only by the same-origin proxy. */
export function createApiClient({
  baseUrl,
  accessToken,
  timeoutMs = 10_000,
  fetcher = fetch,
  apiPath = "/api/v1",
  credentials = "omit",
  onUnauthenticated,
}: ClientConfig) {
  const origin = new URL(baseUrl)
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname)
  if (
    origin.username ||
    origin.password ||
    origin.search ||
    origin.hash ||
    origin.pathname !== "/" ||
    !(origin.protocol === "https:" || (origin.protocol === "http:" && local))
  ) {
    throw new Error(
      "API configuration requires an HTTPS origin, or HTTP localhost, without credentials or a path."
    )
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0)
    throw new Error("API timeout must be positive.")

  async function request<T>(
    path: string,
    schema: z.ZodType<T>,
    method = "GET",
    body?: unknown,
    options?: WriteOptions
  ): Promise<T> {
    if (
      !path.startsWith("/") ||
      path.startsWith("//") ||
      path.includes("\\") ||
      path.includes("#")
    )
      throw new ApiError("INVALID_RESPONSE")
    const url = new URL(`${apiPath}${path}`, origin)
    if (url.origin !== origin.origin || !url.pathname.startsWith(`${apiPath}/`))
      throw new ApiError("INVALID_RESPONSE")
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    // Race the entire read/validation operation so a stalled token provider,
    // fetch adapter or streaming body cannot keep the UI pending forever.
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort()
        reject(new ApiError("DEPENDENCY_TIMEOUT"))
      }, timeoutMs)
    })
    const operation = async () => {
      const token = await accessToken?.()
      if (controller.signal.aborted) throw new ApiError("DEPENDENCY_TIMEOUT")
      const headers: Record<string, string> = {
        Accept: "application/json",
        "X-Request-Id": crypto.randomUUID(),
      }
      if (token) headers.Authorization = `Bearer ${token}`
      if (body !== undefined) headers["Content-Type"] = "application/json"
      if (options?.idempotencyKey)
        headers["Idempotency-Key"] = options.idempotencyKey
      const response = await fetcher(url, {
        method,
        body: body === undefined ? undefined : JSON.stringify(body),
        headers,
        signal: controller.signal,
        cache: "no-store",
        redirect: "error",
        credentials,
      })
      const requestId = response.headers.get("X-Request-Id") ?? undefined
      const responseBody: unknown = await response.json().catch(() => {
        throw new ApiError("INVALID_RESPONSE", response.status, requestId)
      })
      if (!response.ok) {
        if (response.status === 401) onUnauthenticated?.()
        const parsed = errorEnvelopeSchema.safeParse(responseBody)
        const fallbackCode =
          response.status === 401
            ? "UNAUTHENTICATED"
            : response.status === 403
              ? "FORBIDDEN"
              : "DEPENDENCY_UNAVAILABLE"
        throw new ApiError(
          parsed.success ? parsed.data.error.code : fallbackCode,
          response.status,
          parsed.success ? parsed.data.requestId : requestId
        )
      }
      const parsed = schema.safeParse(responseBody)
      if (!parsed.success)
        throw new ApiError("INVALID_RESPONSE", response.status, requestId)
      return parsed.data
    }
    try {
      return await Promise.race([operation(), timeout])
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError(
        controller.signal.aborted
          ? "DEPENDENCY_TIMEOUT"
          : "DEPENDENCY_UNAVAILABLE"
      )
    } finally {
      if (timer) clearTimeout(timer)
    }
  }

  return {
    post<T>(
      path: string,
      body: unknown,
      schema: z.ZodType<T>,
      options?: WriteOptions
    ): Promise<ApiResponse<T>> {
      return request(
        path,
        z.object({ data: schema, requestId: z.string().min(1) }),
        "POST",
        body,
        options
      )
    },
    patch<T>(
      path: string,
      body: unknown,
      schema: z.ZodType<T>,
      options?: WriteOptions
    ): Promise<ApiResponse<T>> {
      return request(
        path,
        z.object({ data: schema, requestId: z.string().min(1) }),
        "PATCH",
        body,
        options
      )
    },
    get<T>(path: string, schema: z.ZodType<T>): Promise<ApiResponse<T>> {
      return request(
        path,
        z.object({ data: schema, requestId: z.string().min(1) })
      )
    },
    list<T>(path: string, schema: z.ZodType<T>): Promise<PaginatedResponse<T>> {
      return request(
        path,
        z.object({
          data: z.array(schema),
          meta: paginationSchema,
          requestId: z.string().min(1),
        })
      )
    },
  }
}
