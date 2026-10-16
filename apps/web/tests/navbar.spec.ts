import { expect, test } from "@playwright/test"

test("desktop navigation exposes the current page with comfortable targets", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Mobile uses the navigation panel")
  await page.goto("/product")
  const nav = page.getByRole("navigation", {
    name: "Main navigation",
    exact: true,
  })
  const product = nav.getByRole("link", { name: "Product", exact: true })
  await expect(product).toHaveAttribute("aria-current", "page")
  for (const link of await nav.getByRole("link").all()) {
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  }
  await nav.getByRole("link", { name: "How it works", exact: true }).focus()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/how-it-works$/)
  await expect(
    nav.getByRole("link", { name: "How it works", exact: true })
  ).toHaveAttribute("aria-current", "page")
})

test("tablet navigation supports Escape, focus return and route selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 800 })
  await page.goto("/")
  const trigger = page.getByRole("button", { name: "Open navigation menu" })
  await expect(trigger).toBeVisible()
  await trigger.click()
  const panel = page.getByRole("dialog", {
    name: "Explore Handled",
    exact: true,
  })
  await expect(panel).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(panel).toBeHidden()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await panel.getByRole("link", { name: "How it works", exact: false }).click()
  await expect(page).toHaveURL(/\/how-it-works$/)
  await expect(panel).toBeHidden()
})

test("mobile actions remain reachable in a short window and the panel closes at desktop width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 450 })
  await page.goto("/")
  await page.getByRole("button", { name: "Open navigation menu" }).click()
  const panel = page.getByRole("dialog", {
    name: "Explore Handled",
    exact: true,
  })
  const action = panel.getByRole("link", {
    name: "Explore Handled",
    exact: true,
  })
  await action.scrollIntoViewIfNeeded()
  await expect(action).toBeVisible()
  const box = (await action.boundingBox())!
  expect(box.y + box.height).toBeLessThanOrEqual(450)
  await expect(
    panel.getByRole("button", { name: "Close navigation" })
  ).toBeVisible()
  await page.setViewportSize({ width: 1200, height: 800 })
  await expect(panel).toBeHidden()
  await expect(
    page.getByRole("navigation", { name: "Main navigation", exact: true })
  ).toBeVisible()
})

test("the approach destination closes the menu and leaves its heading below the navbar", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/product")
  await page.getByRole("button", { name: "Open navigation menu" }).click()
  const panel = page.getByRole("dialog", {
    name: "Explore Handled",
    exact: true,
  })
  await panel.getByRole("link", { name: "Our approach", exact: true }).click()
  await expect(page).toHaveURL(/\/#approach$/)
  await expect(panel).toBeHidden()
  const heading = page.getByRole("heading", {
    name: "Move the work forward. Keep the trust intact.",
    exact: true,
  })
  await expect(heading).toBeVisible()
  const bounds = await heading.evaluate((element) => ({
    headingTop: element.getBoundingClientRect().top,
    headerBottom: document
      .querySelector(".premium-nav")!
      .getBoundingClientRect().bottom,
  }))
  expect(bounds.headingTop).toBeGreaterThanOrEqual(bounds.headerBottom)
})
