import { expect, test } from "@playwright/test"

test("coarse-pointer tablets keep the static hero artwork", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1024, height: 900 },
    hasTouch: true,
    reducedMotion: "no-preference",
  })
  const page = await context.newPage()
  await page.goto("/")
  await page.waitForLoadState("networkidle")
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  expect(
    await page.evaluate(() => matchMedia("(pointer: coarse)").matches)
  ).toBe(true)
  await expect(page.locator("[data-liquid-interactive]")).toHaveCount(0)
  await expect(page.locator(".hero-sculpture-layer")).toHaveCSS(
    "animation-name",
    "none"
  )
  await expect(page.locator(".hero-proof-card")).toHaveCSS(
    "animation-name",
    "none"
  )
  await context.close()
})

test("changing motion preference stops decorative hero motion and preserves content", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop decoration is already static on mobile")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/")
  await expect(page.locator("[data-liquid-interactive]")).toHaveCount(1)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(page.locator("[data-liquid-interactive]")).toHaveCount(0)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await page.locator("#approach").scrollIntoViewIfNeeded()
  await expect(
    page.getByRole("heading", {
      name: "Move the work forward. Keep the trust intact.",
    })
  ).toBeVisible()
  expect(
    await page.evaluate(() =>
      document
        .getAnimations()
        .every(
          (animation) =>
            animation.playState !== "running" ||
            Number(animation.effect?.getComputedTiming().duration) <= 1
        )
    )
  ).toBe(true)
})
