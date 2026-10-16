import assert from "node:assert/strict"
import test from "node:test"
import {
  companyInitials,
  normalizeCompanyProfile,
  validateCompanyProfile,
  type CompanyProfile,
} from "./company-profile.ts"
const valid: CompanyProfile = {
  companyName: "Northwind Studio",
  website: "https://northwind.example",
  supportEmail: "help@northwind.example",
  industry: "Software",
  timeZone: "UTC",
  logoDataUrl: null,
}
test("rejects invalid identity, credentials in URLs, email and time zone", () => {
  const errors = validateCompanyProfile({
    ...valid,
    companyName: " ",
    website: "https://user:password@example.com",
    supportEmail: "not an email",
    timeZone: "MadeUp/Zone",
  })
  assert.ok(errors.companyName)
  assert.ok(errors.website)
  assert.ok(errors.supportEmail)
  assert.ok(errors.timeZone)
  assert.ok(
    validateCompanyProfile({ ...valid, website: "javascript:alert(1)" }).website
  )
  assert.ok(
    validateCompanyProfile({ ...valid, companyName: "N".repeat(81) })
      .companyName
  )
})
test("normalizes optional company details and supports Unicode initials", () => {
  assert.deepEqual(
    validateCompanyProfile({ ...valid, website: "", supportEmail: "" }),
    {}
  )
  assert.equal(
    normalizeCompanyProfile({ ...valid, companyName: "  Northwind Studio  " })
      .companyName,
    "Northwind Studio"
  )
  assert.equal(companyInitials("Northwind Studio"), "NS")
  assert.equal(companyInitials("😀 Services"), "😀S")
})
