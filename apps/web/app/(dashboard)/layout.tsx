import type { Metadata } from "next"
import { WorkspaceProvider } from "@/components/dashboard/workspace-provider"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const metadata: Metadata = { robots: { index: false, follow: false } }

/** Public sample shell only. Production authentication must be integrated before live data. */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WorkspaceProvider>
      <DashboardShell>{children}</DashboardShell>
    </WorkspaceProvider>
  )
}
