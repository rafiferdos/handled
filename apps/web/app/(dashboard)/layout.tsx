import type { Metadata } from "next"
import { WorkspaceProvider } from "@/components/dashboard/workspace-provider"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WorkspaceProvider live={Boolean(process.env.HANDLED_API_URL)}>
      <DashboardShell>{children}</DashboardShell>
    </WorkspaceProvider>
  )
}
