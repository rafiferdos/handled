import { z } from "zod"

export const workspaceSelectionKey = "handled:workspace-selection"
const selectionSchema = z.strictObject({
  userId: z.uuid(),
  workspaceId: z.uuid(),
})
export type WorkspaceSelection = z.infer<typeof selectionSchema>

export function readWorkspaceSelection(read: () => string | null) {
  try {
    const parsed = selectionSchema.safeParse(JSON.parse(read() || "null"))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function saveWorkspaceSelection(
  selection: WorkspaceSelection,
  write: (value: string) => void
) {
  try {
    write(JSON.stringify(selection))
    return true
  } catch {
    return false
  }
}

export function resolveWorkspaceSelection<T extends { id: string }>(
  workspaces: readonly T[],
  userId: string | undefined,
  selection: WorkspaceSelection | null
): T | undefined {
  const id = selection?.userId === userId ? selection?.workspaceId : undefined
  return workspaces.find((item) => item.id === id) || workspaces[0]
}
