import { expect, test, type Page } from "@playwright/test"

const previewName = "Northstar Support"
const logo = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNIfrbvPwAGvgMH+FB3pAAAAABJRU5ErkJggg==",
  "base64"
)

async function openNavigation(page: Page) {
  const menu = page.getByRole("button", {
    name: "Open workspace navigation",
  })
  if (await menu.isVisible()) await menu.click()
}

async function navigate(page: Page, destination: string) {
  await openNavigation(page)
  await page
    .getByRole("navigation", { name: "Workspace navigation" })
    .getByRole("link", { name: destination, exact: true })
    .click()
}

async function switchCompany(page: Page, name: string) {
  await openNavigation(page)
  await page.getByRole("combobox", { name: "Select workspace" }).click()
  await page.getByRole("option", { name, exact: true }).click()
  await expect(page.locator("header [data-company-name]")).toHaveText(name)
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
})

test("company profile is a useful workspace destination", async ({ page }) => {
  await page.goto("/company")
  await expect(
    page.getByRole("heading", { level: 1, name: "Your company, in focus." })
  ).toBeVisible()
  await expect(page.locator("header [data-company-name]")).toHaveText(
    "AcmeCloud"
  )
  await expect(page.getByLabel("Company name", { exact: true })).toHaveValue(
    "AcmeCloud"
  )
  await expect(
    page.getByText("Subscription not connected", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Save profile" })
  ).toBeDisabled()
})

test("saving company details updates the workspace without sending a server write", async ({
  page,
}) => {
  const writes: string[] = []
  page.on("request", (request) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method()))
      writes.push(request.url())
  })
  await page.goto("/company")
  await page.getByLabel("Company name", { exact: true }).fill(previewName)
  await page
    .getByLabel("Website", { exact: true })
    .fill("https://northstar.example")
  await page
    .getByLabel("Support email", { exact: true })
    .fill("help@northstar.example")
  await page.getByLabel("Industry", { exact: true }).fill("Customer support")
  await page.getByLabel("Time zone", { exact: true }).fill("Europe/London")
  await page.getByRole("button", { name: "Save profile" }).click()
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Company profile saved in this preview." })
  ).toBeVisible()
  await expect(page.locator("header [data-company-name]")).toHaveText(
    previewName
  )

  await navigate(page, "Overview")
  await expect(page.getByRole("link", { name: /TKT-1001/ })).toBeVisible()
  await openNavigation(page)
  await expect(
    page.getByRole("combobox", { name: "Select workspace" })
  ).toContainText(previewName)
  await page
    .getByRole("navigation", { name: "Workspace navigation" })
    .getByRole("link", { name: "Company", exact: true })
    .click()
  await expect(page.getByLabel("Company name", { exact: true })).toHaveValue(
    previewName
  )
  await expect(page.getByLabel("Website", { exact: true })).toHaveValue(
    "https://northstar.example"
  )
  await expect(page.getByLabel("Support email", { exact: true })).toHaveValue(
    "help@northstar.example"
  )
  await expect(page.getByLabel("Industry", { exact: true })).toHaveValue(
    "Customer support"
  )
  await expect(page.getByLabel("Time zone", { exact: true })).toHaveValue(
    "Europe/London"
  )

  await page.reload()
  await expect(page.getByLabel("Company name", { exact: true })).toHaveValue(
    "AcmeCloud"
  )
  await expect(page.locator("header [data-company-name]")).toHaveText(
    "AcmeCloud"
  )
  expect(writes).toEqual([])
})

test("company profiles remain isolated while ticket and knowledge records follow the active company", async ({
  page,
}) => {
  await page.goto("/company")
  await page.getByLabel("Company name", { exact: true }).fill(previewName)
  await page.getByRole("button", { name: "Save profile" }).click()
  await switchCompany(page, "PixelDesk")
  await expect(page.getByLabel("Company name", { exact: true })).toHaveValue(
    "PixelDesk"
  )
  await page.getByLabel("Company name", { exact: true }).fill("Orbit Desk")
  await page.getByRole("button", { name: "Save profile" }).click()
  await navigate(page, "Ticket inbox")
  await expect(
    page.getByRole("heading", { name: "This workspace is a clean slate." })
  ).toBeVisible()
  await expect(page.getByRole("link", { name: /TKT-1001/ })).toHaveCount(0)
  await navigate(page, "Knowledge")
  await expect(page.getByRole("button", { name: /^Read / })).toHaveCount(0)
  await expect(page.getByText("Published duplicate-charge policy")).toHaveCount(
    0
  )

  await switchCompany(page, previewName)
  await expect(
    page.getByRole("button", { name: "Read Published duplicate-charge policy" })
  ).toBeVisible()
  await navigate(page, "Company")
  await expect(page.getByLabel("Company name", { exact: true })).toHaveValue(
    previewName
  )
  await page.getByLabel("Company name", { exact: true }).fill("Unsaved name")
  await switchCompany(page, "Orbit Desk")
  await expect(page.getByLabel("Company name", { exact: true })).toHaveValue(
    "Orbit Desk"
  )
  await switchCompany(page, previewName)
  await expect(page.getByLabel("Company name", { exact: true })).toHaveValue(
    previewName
  )
})

test("invalid profile fields explain their errors and cancel restores the saved company", async ({
  page,
}) => {
  await page.goto("/company")
  const fields = [
    { name: "Company name", value: "A" },
    { name: "Website", value: "http://insecure.example" },
    { name: "Support email", value: "not-an-email" },
    { name: "Time zone", value: "Mars/Olympus" },
  ]
  const original = await Promise.all(
    fields.map(({ name }) =>
      page.getByLabel(name, { exact: true }).inputValue()
    )
  )
  for (const { name, value } of fields)
    await page.getByLabel(name, { exact: true }).fill(value)
  await page.getByRole("button", { name: "Save profile" }).click()
  for (const { name } of fields) {
    const input = page.getByLabel(name, { exact: true })
    await expect(input).toHaveAttribute("aria-invalid", "true")
    const descriptions = (await input.getAttribute("aria-describedby"))!
    for (const id of descriptions.split(/\s+/))
      await expect(page.locator(`[id="${id}"]`)).toBeVisible()
  }
  await expect(page.locator("header [data-company-name]")).toHaveText(
    "AcmeCloud"
  )
  await page.getByRole("button", { name: "Cancel changes" }).click()
  for (const [index, { name }] of fields.entries()) {
    await expect(page.getByLabel(name, { exact: true })).toHaveValue(
      original[index]
    )
    await expect(page.getByLabel(name, { exact: true })).not.toHaveAttribute(
      "aria-invalid",
      "true"
    )
  }
  await expect(
    page.getByRole("button", { name: "Save profile" })
  ).toBeDisabled()
})

test("logo uploads decode safely and rejected files do not replace the selected logo", async ({
  page,
}) => {
  await page.goto("/company")
  const upload = page.getByLabel("Company logo", { exact: true })
  const remove = page.getByRole("button", { name: "Remove logo", exact: true })
  const preview = page
    .locator("main form")
    .getByRole("img", { name: "Company logo", exact: true })
  const saved = page
    .getByRole("region", { name: "Company identity" })
    .getByRole("img", { name: "Company logo", exact: true })
  await upload.setInputFiles({
    name: "company.png",
    mimeType: "image/png",
    buffer: logo,
  })
  await expect(remove).toBeVisible()
  await expect(preview).toHaveAttribute(
    "src",
    `data:image/png;base64,${logo.toString("base64")}`
  )
  await page.getByRole("button", { name: "Save profile" }).click()
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Company profile saved in this preview." })
  ).toBeVisible()
  await expect(saved).toHaveAttribute(
    "src",
    `data:image/png;base64,${logo.toString("base64")}`
  )
  await switchCompany(page, "PixelDesk")
  await expect(saved).toBeHidden()
  await expect(remove).toBeHidden()
  await switchCompany(page, "AcmeCloud")
  await expect(saved).toHaveAttribute(
    "src",
    `data:image/png;base64,${logo.toString("base64")}`
  )

  for (const { error, ...file } of [
    {
      name: "unsafe.svg",
      mimeType: "image/svg+xml",
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" />'),
      error: "Choose a PNG, JPEG or WebP image.",
    },
    {
      name: "oversized.png",
      mimeType: "image/png",
      buffer: Buffer.alloc(512 * 1024 + 1),
      error: "Choose an image smaller than 512 KB.",
    },
    {
      name: "broken.png",
      mimeType: "image/png",
      buffer: Buffer.from("not an image"),
      error: "This image could not be read. Choose another image.",
    },
  ]) {
    await upload.setInputFiles(file)
    await expect(page.locator("main").getByRole("alert")).toHaveText(error)
    await expect(remove).toBeVisible()
    await expect(preview).toHaveAttribute(
      "src",
      `data:image/png;base64,${logo.toString("base64")}`
    )
    await expect(
      page.getByRole("button", { name: "Save profile" })
    ).toBeDisabled()
  }

  await remove.click()
  await page.getByRole("button", { name: "Save profile" }).click()
  await expect(remove).toBeHidden()
  await expect(saved).toBeHidden()
  await expect(
    page.getByRole("button", { name: "Save profile" })
  ).toBeDisabled()
})

test("long company names and editable controls fit a compact mobile workspace", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto("/company")
  const longName = "N".repeat(80)
  await page.getByLabel("Company name", { exact: true }).fill(longName)
  await page.getByLabel("Industry", { exact: true }).fill("I".repeat(80))
  await page.getByRole("button", { name: "Save profile" }).click()
  await expect(page.locator("header [data-company-name]")).toHaveText(longName)
  for (const name of [
    "Company name",
    "Website",
    "Support email",
    "Industry",
    "Time zone",
  ]) {
    const control = page.getByLabel(name, { exact: true })
    await expect(control).toBeVisible()
    expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  }
  for (const name of ["Save profile", "Cancel changes"]) {
    const control = page.getByRole("button", { name, exact: true })
    expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
  await openNavigation(page)
  await expect(
    page.getByRole("combobox", { name: "Select workspace" })
  ).toContainText(longName)
  await expect(
    page.getByRole("link", { name: "Company", exact: true })
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
})

test("workspace navigation dismisses when resizing to desktop or using history", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/dashboard")
  await navigate(page, "Company")
  await openNavigation(page)
  const panel = page.getByRole("dialog", { name: "Workspace navigation" })
  await expect(panel).toBeVisible()
  await page.setViewportSize({ width: 1200, height: 800 })
  await expect(panel).toBeHidden()
  await page.setViewportSize({ width: 390, height: 844 })
  await openNavigation(page)
  await expect(panel).toBeVisible()
  await page.goBack()
  await expect(panel).toBeHidden()
  await expect(page).toHaveURL(/\/dashboard$/)
})
