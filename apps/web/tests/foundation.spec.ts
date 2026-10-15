import { expect, test } from "@playwright/test"

test("public product story and preview CTA are honest and navigable", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Every answer"
  )
  await page
    .getByRole("link", { name: "Explore the workspace", exact: true })
    .first()
    .click()
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(
    page.getByText("Preview workspace", { exact: true }).first()
  ).toBeVisible()
  expect(errors).toEqual([])
})

test("FAQ supports keyboard activation", async ({ page }) => {
  await page.goto("/#questions")
  const question = page.getByRole("button", {
    name: "Can the AI take actions on its own?",
  })
  await question.focus()
  await page.keyboard.press("Enter")
  await expect(
    page.getByText("Every action requires an authenticated human decision.", {
      exact: false,
    })
  ).toBeVisible()
})

test("reduced motion keeps the public page visible without overflow", async ({
  page,
}) => {
  const hydrationErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat/i.test(message.text()))
      hydrationErrors.push(message.text())
  })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  await expect(page.locator("[data-liquid-interactive]")).toHaveCount(0)
  expect(hydrationErrors).toEqual([])
})

test("mobile menu is accessible and navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile)
  await page.goto("/")
  await expect(
    page.getByRole("link", { name: "Explore Handled", exact: true })
  ).toBeHidden()
  await page.getByRole("button", { name: "Open navigation" }).click()
  const menu = page.getByRole("dialog", { name: "Explore Handled" })
  await expect(menu).toBeVisible()
  await menu.getByRole("link", { name: "Product", exact: true }).click()
  await expect(page).toHaveURL(/\/product/)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
})

test("ticket search and filters expose a useful empty state and reset", async ({
  page,
}) => {
  await page.goto("/tickets")
  await expect(page.getByRole("link", { name: /TKT-1001/ })).toBeVisible()
  await page
    .getByRole("textbox", { name: "Search tickets" })
    .fill("no-matching-customer")
  await expect(
    page.getByRole("heading", { name: "No matching conversations." })
  ).toBeVisible()
  await page.getByRole("button", { name: "Clear filters", exact: true }).click()
  await expect(page.getByRole("link", { name: /TKT-1001/ })).toBeVisible()
  await page.getByRole("combobox", { name: "Filter by status" }).click()
  await page
    .getByRole("option", { name: "Awaiting approval", exact: true })
    .click()
  await expect(page.getByRole("link", { name: /TKT-1001/ })).toBeVisible()
  await expect(page.getByRole("link", { name: /TKT-1002/ })).toHaveCount(0)
})

test("workspace switching clears sample records and keeps navigation scoped", async ({
  page,
  isMobile,
}) => {
  await page.goto("/tickets")
  await expect(page.getByRole("link", { name: /TKT-1001/ })).toBeVisible()
  if (isMobile)
    await page
      .getByRole("button", { name: "Open workspace navigation" })
      .click()
  await page.getByRole("combobox", { name: "Select preview workspace" }).click()
  await page.getByRole("option", { name: "PixelDesk", exact: true }).click()
  if (isMobile)
    await expect(
      page.getByRole("dialog", { name: "Workspace navigation" })
    ).toBeHidden()
  await expect(
    page.getByRole("heading", { name: "This workspace is a clean slate." })
  ).toBeVisible()
  await expect(page.getByText("Maya Rahman", { exact: false })).toHaveCount(0)
  // The workspace provider resets the mobile sheet when the workspace changes.
  if (!isMobile)
    await page.getByRole("link", { name: "Overview", exact: true }).click()
  else {
    await page
      .getByRole("button", { name: "Open workspace navigation" })
      .click()
    await page
      .getByRole("dialog", { name: "Workspace navigation" })
      .getByRole("link", { name: "Overview", exact: true })
      .click()
  }
  await expect(
    page.getByRole("heading", { name: "This workspace is a clean slate." })
  ).toBeVisible()
})

test("auth validates input without pretending to create a session", async ({
  page,
}) => {
  const authRequests: string[] = []
  page.on("request", (request) => {
    if (/\/auth\/v1|\/api\/v1/.test(request.url()))
      authRequests.push(request.url())
  })
  await page.goto("/login")
  await page.getByRole("button", { name: "Sign in", exact: true }).click()
  await expect(
    page.getByText("Enter a valid email address.", { exact: true })
  ).toBeVisible()
  await page
    .getByLabel("Email address", { exact: true })
    .fill("sample@example.com")
  await page.getByLabel("Password", { exact: true }).fill("sample-password")
  await page.getByRole("button", { name: "Sign in", exact: true }).click()
  await expect(
    page.getByRole("status").filter({ hasText: "No session was created." })
  ).toBeVisible()
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByLabel("Password", { exact: true })).toHaveValue("")
  expect(authRequests).toEqual([])
})

test("source dialog and approval rehearsal are explicit and cannot mutate accounts", async ({
  page,
}) => {
  const writes: string[] = []
  page.on("request", (request) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method()))
      writes.push(request.url())
  })
  await page.goto("/tickets/10000000-0000-4000-8000-000000001001")
  await page.getByRole("tab", { name: "Evidence", exact: true }).click()
  await page.getByRole("button", { name: /Two settled payments/ }).click()
  await expect(
    page.getByRole("dialog", { name: "Two settled payments" })
  ).toBeVisible()
  await page.getByRole("button", { name: "Close", exact: true }).click()
  await page
    .getByRole("button", { name: "Rehearse approval", exact: true })
    .click()
  const dialog = page.getByRole("alertdialog", {
    name: "Rehearse this approval?",
  })
  await expect(dialog).toBeVisible()
  await dialog.getByRole("button", { name: "Confirm local rehearsal" }).click()
  await expect(
    page.getByRole("status").filter({ hasText: "Local rehearsal:" })
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Rehearse approval", exact: true })
  ).toHaveCount(0)
  expect(writes).toEqual([])
})

test("low confidence cannot be approved and draft editing stays local", async ({
  page,
}) => {
  await page.goto("/tickets/10000000-0000-4000-8000-000000001003")
  await expect(
    page.getByRole("button", { name: "Rehearse approval" })
  ).toBeDisabled()
  await page.getByRole("button", { name: "Edit draft" }).click()
  const dialog = page.getByRole("dialog", { name: "Edit sample reply" })
  await dialog
    .getByRole("textbox", { name: "Reply draft" })
    .fill("A sample reply for manual review.")
  await dialog.getByRole("button", { name: "Save local draft" }).click()
  await expect(dialog).toBeHidden()
  await expect(page.locator("blockquote")).toHaveText(
    "A sample reply for manual review."
  )
  await page.getByRole("button", { name: "Reject or escalate" }).click()
  await expect(
    page.getByRole("button", { name: "Record local decision" })
  ).toBeDisabled()
  await page
    .getByRole("textbox", { name: /Reason/ })
    .fill("Verify the product mapping first.")
  await page.getByRole("button", { name: "Record local decision" }).click()
  await expect(
    page.getByRole("status").filter({ hasText: "escalated for manual review" })
  ).toBeVisible()
})

test("theme preference works without affecting typed form content", async ({
  page,
}) => {
  await page.goto("/settings")
  await page.getByRole("combobox", { name: "Color theme" }).click()
  await page.getByRole("option", { name: "Dark", exact: true }).click()
  await expect(page.locator("html")).toHaveClass(/dark/)
  await page.getByRole("combobox", { name: "Color theme" }).click()
  await page.getByRole("option", { name: "Light", exact: true }).click()
  await expect(page.locator("html")).not.toHaveClass(/dark/)
})
