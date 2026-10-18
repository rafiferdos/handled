import assert from "node:assert/strict"
import test from "node:test"
import {
  readWorkspaceSelection,
  resolveWorkspaceSelection,
  saveWorkspaceSelection,
} from "./workspace-selection.ts"

const userId = "06a0d8a8-8d9f-4485-8546-2d019d20a976"
const otherUserId = "a51afa63-a42e-4883-933d-343cfb17fba9"
const workspaces = [
  { id: "58845327-5fa7-441e-ac0a-3415d3c0841a", name: "API Lab" },
  { id: "301fad4d-0a09-4220-9a53-03b98679f34f", name: "Browser Lab" },
]
const selection = { userId, workspaceId: workspaces[1].id }

test("restores the selected workspace after a tab reload", () => {
  let stored = ""
  saveWorkspaceSelection(selection, (value) => {
    stored = value
  })
  const reloaded = readWorkspaceSelection(() => stored)
  assert.deepEqual(reloaded, selection)
  assert.equal(
    resolveWorkspaceSelection(workspaces, userId, reloaded),
    workspaces[1]
  )
})

test("does not reuse another account's selection or an inaccessible workspace", () => {
  assert.equal(
    resolveWorkspaceSelection(workspaces, otherUserId, selection),
    workspaces[0]
  )
  assert.equal(
    resolveWorkspaceSelection([workspaces[0]], userId, selection),
    workspaces[0]
  )
  assert.equal(resolveWorkspaceSelection([], userId, selection), undefined)
})

test("rejects malformed storage and tolerates unavailable browser storage", () => {
  assert.equal(
    readWorkspaceSelection(() => "not-json"),
    null
  )
  assert.equal(
    readWorkspaceSelection(
      () => '{"userId":"invalid","workspaceId":"invalid"}'
    ),
    null
  )
  assert.equal(
    readWorkspaceSelection(() => {
      throw new Error("Storage denied")
    }),
    null
  )
  assert.equal(
    saveWorkspaceSelection(selection, () => {
      throw new Error("Storage denied")
    }),
    false
  )
  assert.equal(
    resolveWorkspaceSelection(workspaces, userId, selection),
    workspaces[1]
  )
})
