import { expect, test } from "@playwright/test"

test("marketing artwork stays contained across tablet breakpoints", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  for (const width of [1024, 1200, 900, 1100, 768, 1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await expect
      .poll(
        () =>
          page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth
          ),
        { message: `No sideways scroll at ${width}px` }
      )
      .toBeLessThanOrEqual(0)
    const sheets = await page.evaluate(() => {
      const stage = document
        .querySelector(".hero-visual")!
        .getBoundingClientRect()
      const dossier = document
        .querySelector(".hero-proof-card")!
        .getBoundingClientRect()
      const policy = document
        .querySelector(".hero-policy-sheet")!
        .getBoundingClientRect()
      return {
        gap: policy.top - dossier.bottom,
        bottom: stage.bottom - policy.bottom,
      }
    })
    expect(
      sheets.gap,
      `Policy clears the review card at ${width}px`
    ).toBeGreaterThan(8)
    expect(
      sheets.bottom,
      `Policy stays inside the stage at ${width}px`
    ).toBeGreaterThanOrEqual(0)
  }
})

test("overview review entry follows the active workspace", async ({
  page,
  isMobile,
}) => {
  await page.goto("/dashboard")
  await expect(
    page.getByRole("link", { name: "Review next sample", exact: true })
  ).toHaveAttribute("href", "/tickets/10000000-0000-4000-8000-000000001001")
  if (isMobile)
    await page
      .getByRole("button", { name: "Open workspace navigation" })
      .click()
  await page.getByRole("combobox", { name: "Select preview workspace" }).click()
  await page.getByRole("option", { name: "PixelDesk", exact: true }).click()
  await expect(
    page.getByRole("heading", { name: "This workspace is a clean slate." })
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Review next sample", exact: true })
  ).toHaveCount(0)
})

test("sample showcase supports keyboard case selection and correct case links", async ({
  page,
}) => {
  const writes: string[] = []
  page.on("request", (request) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method()))
      writes.push(request.url())
  })
  await page.goto("/#workflow")
  const cases = page.getByRole("tablist", {
    name: "Explore sample support cases",
  })
  await expect(cases).toBeVisible()
  await cases
    .getByRole("tab", { name: "Duplicate payment", exact: true })
    .focus()
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Enter")
  const panel = page.getByRole("tabpanel")
  await expect(panel).toContainText("TKT-1002")
  await expect(panel).toContainText("Keep access through the paid period.")
  await expect(
    panel.getByRole("link", { name: "Inspect sample case" })
  ).toHaveAttribute("href", "/tickets/10000000-0000-4000-8000-000000001002")
  await cases.getByRole("tab", { name: "Missing access", exact: true }).click()
  await expect(panel).toContainText("TKT-1003")
  await expect(panel).toContainText("Manual review comes first.")
  await expect(panel).toContainText("Account mapping is unverified")
  await expect(
    panel.getByRole("link", { name: "Inspect sample case" })
  ).toHaveAttribute("href", "/tickets/10000000-0000-4000-8000-000000001003")
  await expect(
    panel.getByRole("button", { name: /approve|execute|refund/i })
  ).toHaveCount(0)
  expect(writes).toEqual([])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
})

test("reduced motion keeps case exploration readable and static", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/product")
  await page.getByRole("tab", { name: "Missing access", exact: true }).click()
  await expect(page.getByRole("tabpanel")).toContainText(
    "Manual review comes first."
  )
  await expect(page.locator("[data-liquid-interactive]")).toHaveCount(0)
  expect(
    await page
      .getByRole("tabpanel")
      .evaluate((panel) =>
        panel
          .getAnimations({ subtree: true })
          .every(
            (animation) =>
              animation.playState !== "running" ||
              Number(animation.effect?.getComputedTiming().duration) <= 1
          )
      )
  ).toBe(true)
  expect(errors).toEqual([])
})
