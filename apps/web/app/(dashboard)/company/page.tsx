import type { Metadata } from "next"
import { CompanyProfileView } from "@/components/dashboard/company-profile"

export const metadata: Metadata = { title: "Company profile" }

export default function CompanyPage() {
  return <CompanyProfileView />
}
