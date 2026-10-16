import { expect, test } from "@playwright/test"

test("hero annotations retain frosted transparency", async ({ page }) => {
  await page.goto("/")
  await expect
    .poll(() =>
      page
        .locator(".hero-proof-card")
        .evaluate((element) => getComputedStyle(element).backdropFilter)
    )
    .toContain("blur(")
  await expect
    .poll(() =>
      page
        .locator(".hero-proof-card")
        .evaluate((element) => getComputedStyle(element).backgroundColor)
    )
    .toMatch(/\/\s*0?\.\d+\)/)
})

test("the scroll story reaches a visible outcome and becomes a normal reading flow with reduced motion", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Mobile uses the readable four-step layout")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  const story = page.locator(".workflow-story")
  await expect(story).toHaveCount(1, { timeout: 2000 })
  await expect(story).toHaveAttribute("data-story-enhanced", "true")
  const bounds = await story.evaluate((element) => ({
    top: element.getBoundingClientRect().top + scrollY,
    height: element.getBoundingClientRect().height,
    viewport: innerHeight,
  }))
  await page.evaluate(
    ({ top, viewport }) => scrollTo(0, top - viewport * 0.25),
    bounds
  )
  const receipt = page.locator('[data-workflow-layer="receipt"]')
  await expect(receipt).toHaveCSS("opacity", "0")
  const ticket = page.locator('[data-workflow-layer="ticket"]')
  const start = await ticket.evaluate(
    (element) => element.getBoundingClientRect().top
  )
  await page.evaluate(
    ({ top, height, viewport }) => scrollTo(0, top + height - viewport * 0.8),
    bounds
  )
  await expect
    .poll(async () =>
      Number(
        await receipt.evaluate((element) => getComputedStyle(element).opacity)
      )
    )
    .toBeGreaterThan(0.95)
  const end = await ticket.evaluate(
    (element) => element.getBoundingClientRect().top
  )
  expect(start - end).toBeGreaterThan(90)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(story).not.toHaveAttribute("data-story-enhanced", "true")
  await expect(page.locator(".workflow-scene-shell")).toBeHidden()
  await expect(
    story.getByRole("heading", { name: "Your decision", exact: true })
  ).toBeVisible()
})
