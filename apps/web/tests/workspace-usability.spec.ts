import { expect, test } from "@playwright/test"

const firstTicket = "/tickets/10000000-0000-4000-8000-000000001001"

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
})

test("mobile overview brings the conversation queue into the first screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/dashboard")
  const queue = page.getByRole("heading", { name: "The next conversation" })
  await expect(queue).toBeVisible()
  const queueBox = await queue.boundingBox()
  const firstMetric = await page
    .getByText("Tickets", { exact: true })
    .boundingBox()
  const lastMetric = await page
    .getByText("Needs a closer look", { exact: true })
    .boundingBox()
  expect(queueBox!.y + queueBox!.height).toBeLessThan(844)
  expect(lastMetric!.y - firstMetric!.y).toBeLessThanOrEqual(210)
  await expect(
    page.getByRole("heading", { name: "I was charged twice for my Pro plan." })
  ).toBeInViewport({ ratio: 1 })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
})

test("desktop overview keeps summary cards compact and headings readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/dashboard")
  const reviewCard = page.locator('[data-slot="card"]').filter({
    has: page.getByText("Ready for review", { exact: true }),
  })
  await expect(reviewCard).toBeVisible()
  expect((await reviewCard.boundingBox())!.height).toBeLessThanOrEqual(168)
  const headingSize = await page
    .getByRole("heading", { level: 1 })
    .evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize)
    )
  expect(headingSize).toBeGreaterThanOrEqual(34)
  expect(headingSize).toBeLessThanOrEqual(36)
})

test("inbox filters match search height and preserve readable ticket text", async ({
  page,
}) => {
  await page.goto("/tickets")
  const search = page.getByRole("textbox", { name: "Search tickets" })
  const status = page.getByRole("combobox", { name: "Filter by status" })
  const priority = page.getByRole("combobox", { name: "Filter by priority" })
  for (const control of [search, status, priority]) {
    await expect(control).toBeVisible()
    expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    expect((await control.boundingBox())!.height).toBe(
      (await search.boundingBox())!.height
    )
  }
  const ticket = page.getByRole("link").filter({ hasText: "TKT-1001" })
  await expect(ticket).toBeVisible()
  expect(
    await ticket
      .getByRole("heading")
      .evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).fontSize)
      )
  ).toBeGreaterThanOrEqual(14)
  expect(
    await ticket
      .getByText(/TKT-1001/)
      .evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).fontSize)
      )
  ).toBeGreaterThanOrEqual(12)
  await status.click()
  await page.getByRole("option", { name: "Needs review", exact: true }).click()
  await expect(
    page.getByRole("heading", {
      name: "Payment succeeded but no product access.",
    })
  ).toBeVisible()
  await expect(
    page.getByRole("link").filter({ hasText: "TKT-1001" })
  ).toHaveCount(0)
})

test("laptop ticket review keeps both columns usable and actions reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 650 })
  await page.goto(firstTicket)
  const conversation = page.getByRole("tabpanel")
  const recommendation = page.getByRole("region", {
    name: "Recommendation",
    exact: true,
  })
  await expect(recommendation).toBeVisible()
  const conversationBox = await conversation.boundingBox()
  const recommendationBox = await recommendation.boundingBox()
  expect(conversationBox!.width).toBeGreaterThanOrEqual(450)
  expect(recommendationBox!.width).toBeGreaterThanOrEqual(350)
  expect(recommendationBox!.x + recommendationBox!.width).toBeLessThanOrEqual(
    1200
  )
  expect(recommendationBox!.x).toBeGreaterThanOrEqual(
    conversationBox!.x + conversationBox!.width + 20
  )
  expect(recommendationBox!.y).toBeLessThan(conversationBox!.y + 60)
  expect(
    await recommendation.evaluate(
      (element) => getComputedStyle(element).position
    )
  ).not.toBe("sticky")
  for (const tab of await page.getByRole("tab").all()) {
    expect((await tab.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  }
  expect(
    await recommendation
      .locator("blockquote")
      .evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).fontSize)
      )
  ).toBeGreaterThanOrEqual(14)
  const decision = recommendation.getByRole("button", {
    name: "Reject or escalate",
  })
  await decision.scrollIntoViewIfNeeded()
  await expect(decision).toBeInViewport()
  await decision.click()
  const decisionSelect = page.getByRole("combobox", {
    name: "Decision",
    exact: true,
  })
  expect((await decisionSelect.boundingBox())!.height).toBeGreaterThanOrEqual(
    44
  )
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
})

test("settings theme control matches workspace fields", async ({ page }) => {
  await page.goto("/settings")
  const theme = page.getByRole("combobox", { name: "Color theme" })
  await expect(theme).toBeVisible()
  expect((await theme.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  expect(
    (await page
      .getByRole("textbox", { name: "Name", exact: true })
      .boundingBox())!.height
  ).toBeGreaterThanOrEqual(44)
})

test("knowledge policies expose a visible reading action", async ({ page }) => {
  await page.goto("/knowledge")
  const read = page.getByRole("button", {
    name: "Read Published duplicate-charge policy",
  })
  await expect(read).toBeVisible()
  await expect(read).toContainText("Read policy")
  expect((await read.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  await read.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toContainText("Published duplicate-charge policy")
  const close = dialog.getByRole("button", { name: "Close", exact: true })
  await expect
    .poll(async () => (await close.boundingBox())!.width)
    .toBeGreaterThanOrEqual(44)
  await expect
    .poll(async () => (await close.boundingBox())!.height)
    .toBeGreaterThanOrEqual(44)
  await close.click()
  await expect(dialog).not.toBeVisible()
})

test("mobile workspace navigation has a reachable close target", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/dashboard")
  await page.getByRole("button", { name: "Open workspace navigation" }).click()
  const navigation = page.getByRole("dialog", { name: "Workspace navigation" })
  const close = navigation.getByRole("button", {
    name: "Close",
    exact: true,
  })
  await expect(close).toBeInViewport()
  await expect
    .poll(async () => (await close.boundingBox())!.width)
    .toBeGreaterThanOrEqual(44)
  await expect
    .poll(async () => (await close.boundingBox())!.height)
    .toBeGreaterThanOrEqual(44)
  await close.click()
  await expect(navigation).not.toBeVisible()
})
