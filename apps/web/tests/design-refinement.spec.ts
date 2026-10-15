import { expect, test } from "@playwright/test"

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
