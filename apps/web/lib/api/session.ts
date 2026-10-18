import type { QueryClient } from "@tanstack/react-query"
import { ApiError } from "./client.ts"

export function announceSessionChange() {
  if (typeof BroadcastChannel === "undefined") return
  const channel = new BroadcastChannel("handled-session")
  channel.postMessage("changed")
  channel.close()
}

export async function signIn(
  credentials: { email: string; password: string },
  cache: QueryClient,
  fetcher: typeof fetch = fetch
) {
  const response = await fetcher("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })
  if (!response.ok)
    throw new ApiError(
      response.status === 401
        ? "INVALID_CREDENTIALS"
        : response.status === 429
          ? "RATE_LIMITED"
          : "DEPENDENCY_UNAVAILABLE",
      response.status
    )
  // An identity change must not reuse fresh data or an in-flight request from
  // the previous account, including when sign-in was opened in another tab.
  await cache.cancelQueries()
  cache.clear()
  announceSessionChange()
}
