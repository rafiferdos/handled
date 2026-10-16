/** Browser-only company preferences. This is not a persisted workspace API contract. */
export interface CompanyProfile {
  companyName: string
  website: string
  supportEmail: string
  industry: string
  timeZone: string
  logoDataUrl: string | null
}
export type CompanyProfileErrors = Partial<Record<keyof CompanyProfile, string>>

export function companyInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/u)
      .slice(0, 2)
      .map((word) => Array.from(word)[0])
      .join("")
      .toLocaleUpperCase() || "CO"
  )
}

export function normalizeCompanyProfile(
  profile: CompanyProfile
): CompanyProfile {
  return {
    ...profile,
    companyName: profile.companyName.trim(),
    website: profile.website.trim(),
    supportEmail: profile.supportEmail.trim(),
    industry: profile.industry.trim(),
    timeZone: profile.timeZone.trim(),
  }
}

export function validateCompanyProfile(
  profile: CompanyProfile
): CompanyProfileErrors {
  const value = normalizeCompanyProfile(profile)
  const errors: CompanyProfileErrors = {}
  if (
    Array.from(value.companyName).length < 2 ||
    Array.from(value.companyName).length > 80
  )
    errors.companyName = "Use a company name between 2 and 80 characters."
  if (value.website) {
    try {
      const url = new URL(value.website)
      if (
        url.protocol !== "https:" ||
        !url.hostname.includes(".") ||
        url.username ||
        url.password ||
        value.website.length > 2048
      )
        throw new Error("Invalid URL")
    } catch {
      errors.website =
        "Enter a full HTTPS website address without login details."
    }
  }
  if (
    value.supportEmail &&
    (value.supportEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value.supportEmail))
  )
    errors.supportEmail = "Enter a valid support email address."
  if (value.industry.length > 80)
    errors.industry = "Keep the industry under 80 characters."
  try {
    if (!value.timeZone) throw new Error("Missing time zone")
    new Intl.DateTimeFormat("en", { timeZone: value.timeZone }).format()
  } catch {
    errors.timeZone = "Enter a valid time zone, such as UTC or Asia/Dhaka."
  }
  return errors
}

export async function readCompanyLogo(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
    throw new Error("Choose a PNG, JPEG or WebP image.")
  if (file.size > 512 * 1024)
    throw new Error("Choose an image smaller than 512 KB.")
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("This image could not be read. Choose another image.")
  })
  const validSize =
    bitmap.width > 0 &&
    bitmap.height > 0 &&
    bitmap.width <= 4096 &&
    bitmap.height <= 4096
  bitmap.close()
  if (!validSize)
    throw new Error("Choose an image up to 4096 pixels wide and high.")
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () =>
      reject(new Error("This image could not be read. Choose another image."))
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("This image could not be read."))
    reader.readAsDataURL(file)
  })
}
