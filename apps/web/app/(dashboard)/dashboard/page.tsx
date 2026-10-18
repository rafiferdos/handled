import type { Metadata } from "next"
import { Overview } from "@/components/dashboard/overview"
export const metadata: Metadata = { title: "Workspace overview" }
export default function OverviewPage() {
  return <Overview />
}
