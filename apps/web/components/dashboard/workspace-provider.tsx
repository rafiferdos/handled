"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { ApiError, createApiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { announceSessionChange } from "@/lib/api/session"
import {
  readWorkspaceSelection,
  resolveWorkspaceSelection,
  saveWorkspaceSelection,
  workspaceSelectionKey,
} from "@/lib/workspace/workspace-selection"
import { createSampleAdapter, sampleWorkspaces } from "@/lib/api/sample-adapter"
import {
  companyInitials,
  normalizeCompanyProfile,
  validateCompanyProfile,
  type CompanyProfile,
} from "@/lib/workspace/company-profile"

const adapter = createSampleAdapter()
type Workspace = {
  id: string
  name: string
  slug: string
  initials: string
  version?: number
  role?: "ADMIN" | "AGENT" | "VIEWER"
}
const workspaceSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  version: z.number(),
})
const initialProfiles: Record<string, CompanyProfile> = Object.fromEntries(
  sampleWorkspaces.map((item) => [
    item.id,
    {
      companyName: item.name,
      website: `https://${item.slug}.example`,
      supportEmail: `support@${item.slug}.example`,
      industry: "Software & technology",
      timeZone: "UTC",
      logoDataUrl: null,
    },
  ])
)
const WorkspaceContext = createContext<{
  workspace: Workspace
  workspaces: Workspace[]
  profile: CompanyProfile
  updateProfile: (profile: CompanyProfile) => void
  switchWorkspace: (id: string) => void
  adapter: typeof adapter
  api: ReturnType<typeof createApiClient> | null
  mode: "live" | "sample"
  user: { id: string; email?: string } | null
  signOut: () => Promise<void>
} | null>(null)

export function WorkspaceProvider({
  children,
  live = false,
}: {
  children: React.ReactNode
  live?: boolean
}) {
  return live ? (
    <LiveWorkspaceProvider>{children}</LiveWorkspaceProvider>
  ) : (
    <SampleWorkspaceProvider>{children}</SampleWorkspaceProvider>
  )
}

function SampleWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState<string>(sampleWorkspaces[0].id)
  const [profiles, setProfiles] = useState(initialProfiles)
  const client = useQueryClient()
  const workspaces = sampleWorkspaces.map((item) => ({
    ...item,
    name: profiles[item.id].companyName,
    initials: companyInitials(profiles[item.id].companyName),
  }))
  const workspace = workspaces.find((item) => item.id === workspaceId)!
  function switchWorkspace(id: string) {
    if (!sampleWorkspaces.some((item) => item.id === id) || id === workspaceId)
      return
    void client.cancelQueries({ queryKey: ["sample"] })
    client.removeQueries({ queryKey: ["sample"] })
    setWorkspaceId(id)
  }
  function updateProfile(next: CompanyProfile) {
    if (Object.keys(validateCompanyProfile(next)).length) return
    setProfiles((current) => ({
      ...current,
      [workspaceId]: normalizeCompanyProfile(next),
    }))
  }
  return (
    <WorkspaceContext
      value={{
        workspace,
        workspaces,
        profile: profiles[workspaceId],
        updateProfile,
        switchWorkspace,
        adapter,
        api: null,
        mode: "sample",
        user: null,
        signOut: async () => {},
      }}
    >
      <div key={workspace.id}>{children}</div>
    </WorkspaceContext>
  )
}

function LiveWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const cache = useQueryClient()
  const [selection, setSelection] = useState(() =>
    readWorkspaceSelection(() =>
      typeof window === "undefined"
        ? null
        : window.sessionStorage.getItem(workspaceSelectionKey)
    )
  )
  const [newCompany, setNewCompany] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [api] = useState(() =>
    createApiClient({
      baseUrl:
        typeof window === "undefined"
          ? "http://localhost"
          : window.location.origin,
      apiPath: "/api/handled",
      credentials: "same-origin",
      timeoutMs: 90_000,
      onUnauthenticated: () =>
        window.dispatchEvent(new Event("handled:unauthenticated")),
    })
  )
  useEffect(() => {
    const redirect = () => {
      cache.clear()
      router.replace("/login")
    }
    window.addEventListener("handled:unauthenticated", redirect)
    const channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel("handled-session")
    if (channel)
      channel.onmessage = (event) => {
        if (event.data !== "changed") return
        void cache.cancelQueries().then(() => {
          cache.clear()
          window.location.reload()
        })
      }
    return () => {
      window.removeEventListener("handled:unauthenticated", redirect)
      channel?.close()
    }
  }, [cache, router])
  const session = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await fetch("/api/session", { cache: "no-store" })
      if (response.status === 401) throw new ApiError("UNAUTHENTICATED", 401)
      if (!response.ok)
        throw new ApiError("DEPENDENCY_UNAVAILABLE", response.status)
      return z
        .object({
          data: z.object({
            user: z.object({ id: z.string(), email: z.string().optional() }),
          }),
        })
        .parse(await response.json()).data.user
    },
  })
  const companies = useQuery({
    queryKey: ["live", "workspaces", session.data?.id],
    enabled: !!session.data,
    queryFn: async () => {
      const profileResponse = await fetch("/api/handled/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      })
      if (!profileResponse.ok)
        throw new ApiError(
          profileResponse.status === 401
            ? "UNAUTHENTICATED"
            : "DEPENDENCY_UNAVAILABLE",
          profileResponse.status
        )
      const result = await api.list("/workspaces?limit=100", workspaceSchema)
      return result.data.map((item) => ({
        ...item,
        initials: companyInitials(item.name),
      }))
    },
  })
  const expired = [session.error, companies.error].some(
    (error) => error instanceof ApiError && error.status === 401
  )
  const workspaces = companies.data || []
  const selected = resolveWorkspaceSelection(
    workspaces,
    session.data?.id,
    selection
  )
  const membership = useQuery({
    queryKey: ["live", selected?.id, "membership", session.data?.id],
    enabled: !!selected && !!session.data,
    queryFn: async () => {
      const members = await api.list(
        `/workspaces/${selected!.id}/members?limit=100`,
        z.object({
          userId: z.uuid(),
          role: z.enum(["ADMIN", "AGENT", "VIEWER"]),
          status: z.string(),
        })
      )
      return members.data.find(
        (member) =>
          member.userId === session.data?.id && member.status === "ACTIVE"
      )?.role
    },
  })
  useEffect(() => {
    if (expired) {
      cache.clear()
      router.replace("/login")
    }
  }, [expired, cache, router])
  async function signOut() {
    await cache.cancelQueries()
    const result = await fetch("/api/session", { method: "DELETE" }).catch(
      () => null
    )
    if (!result?.ok) {
      toast.error("Sign-out could not be completed. Please try again.")
      return
    }
    cache.clear()
    announceSessionChange()
    router.replace("/login")
    router.refresh()
  }
  const error = session.error || companies.error
  if (session.isPending || (session.data && companies.isPending) || expired)
    return (
      <main id="main-content" className="mx-auto max-w-xl p-10" role="status">
        Opening your workspace… The free preview may take a minute to wake.
      </main>
    )
  if (error)
    return (
      <main id="main-content" className="mx-auto max-w-xl space-y-4 p-10">
        <p role="alert">{error.message}</p>
        <Button
          onClick={() => {
            void session.refetch()
            void companies.refetch()
          }}
        >
          Try again
        </Button>
        <Button variant="outline" onClick={() => void signOut()}>
          Sign out
        </Button>
      </main>
    )
  const workspace = selected
    ? { ...selected, role: membership.data }
    : undefined
  if (!workspace)
    return (
      <main id="main-content" className="mx-auto max-w-xl space-y-4 p-10">
        <h1 className="font-heading text-3xl">Your first workspace</h1>
        <p>Create a workspace, or ask an administrator for an invitation.</p>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault()
            setCreating(true)
            setCreateError("")
            try {
              await api.post(
                "/workspaces",
                { name: newCompany, slug: newSlug },
                workspaceSchema
              )
              await companies.refetch()
            } catch (error) {
              setCreateError(
                error instanceof Error
                  ? error.message
                  : "Could not create the workspace."
              )
            } finally {
              setCreating(false)
            }
          }}
        >
          <label className="block">
            Company name
            <Input
              required
              maxLength={100}
              value={newCompany}
              onChange={(event) => setNewCompany(event.target.value)}
            />
          </label>
          <label className="block">
            Workspace address
            <Input
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              minLength={3}
              maxLength={40}
              value={newSlug}
              onChange={(event) => setNewSlug(event.target.value)}
            />
          </label>
          {createError && <p role="alert">{createError}</p>}
          <Button disabled={creating}>Create workspace</Button>
        </form>
        <Button variant="outline" onClick={() => void signOut()}>
          Sign out
        </Button>
      </main>
    )
  const profile: CompanyProfile = {
    companyName: workspace.name,
    website: "",
    supportEmail: "",
    industry: "",
    timeZone: "UTC",
    logoDataUrl: null,
  }
  return (
    <WorkspaceContext
      value={{
        workspace,
        workspaces,
        profile,
        adapter,
        api,
        mode: "live",
        user: session.data || null,
        signOut,
        updateProfile: () => {},
        switchWorkspace: (id) => {
          if (!workspaces.some((item) => item.id === id) || id === workspace.id)
            return
          void cache.cancelQueries({
            predicate: (query) =>
              query.queryKey[0] !== "session" &&
              query.queryKey[1] !== "workspaces",
          })
          cache.removeQueries({
            predicate: (query) =>
              query.queryKey[0] !== "session" &&
              query.queryKey[1] !== "workspaces",
          })
          const next = { userId: session.data!.id, workspaceId: id }
          saveWorkspaceSelection(next, (value) =>
            window.sessionStorage.setItem(workspaceSelectionKey, value)
          )
          setSelection(next)
        },
      }}
    >
      <div key={workspace.id}>{children}</div>
    </WorkspaceContext>
  )
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext)
  if (!value) throw new Error("Workspace UI requires its scoped layout.")
  return value
}
