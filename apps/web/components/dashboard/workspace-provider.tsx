"use client"

import { createContext, useContext, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { createSampleAdapter, sampleWorkspaces } from "@/lib/api/sample-adapter"
import {
  companyInitials,
  normalizeCompanyProfile,
  validateCompanyProfile,
  type CompanyProfile,
} from "@/lib/workspace/company-profile"

const adapter = createSampleAdapter()
type Workspace = { id: string; name: string; slug: string; initials: string }
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
} | null>(null)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
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
