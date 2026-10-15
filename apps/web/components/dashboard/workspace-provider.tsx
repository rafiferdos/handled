"use client"

import { createContext, useContext, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { createSampleAdapter, sampleWorkspaces } from "@/lib/api/sample-adapter"

const adapter = createSampleAdapter()
type Workspace = (typeof sampleWorkspaces)[number]
const WorkspaceContext = createContext<{
  workspace: Workspace
  switchWorkspace: (id: string) => void
  adapter: typeof adapter
} | null>(null)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace>(sampleWorkspaces[0])
  const client = useQueryClient()
  function switchWorkspace(id: string) {
    const next = sampleWorkspaces.find((item) => item.id === id)
    if (!next || next.id === workspace.id) return
    void client.cancelQueries({ queryKey: ["sample"] })
    client.removeQueries({ queryKey: ["sample"] })
    setWorkspace(next)
  }
  return (
    <WorkspaceContext value={{ workspace, switchWorkspace, adapter }}>
      <div key={workspace.id}>{children}</div>
    </WorkspaceContext>
  )
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext)
  if (!value) throw new Error("Workspace UI requires its scoped layout.")
  return value
}
