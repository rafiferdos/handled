"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Monitor, ShieldCheck } from "lucide-react"
import { PageHeading } from "./page-heading"
import { useWorkspace } from "./workspace-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const subscribeHydration = () => () => {}
const hydratedSnapshot = () => true
const serverSnapshot = () => false

export function SettingsView() {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    hydratedSnapshot,
    serverSnapshot
  )
  const { workspace } = useWorkspace()
  const { theme, setTheme } = useTheme()
  return (
    <>
      <PageHeading
        eyebrow={`${workspace.name} / Settings`}
        title="Make a little room for your way."
        description="Choose an appearance for this browser. Workspace details are read-only."
      />
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Card className="workspace-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-xl font-medium">
              <Monitor className="size-4 text-signal" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label id="theme-label">Color theme</Label>
              <Select
                value={hydrated ? (theme ?? "system") : "system"}
                onValueChange={(value) => value && setTheme(value)}
                items={[
                  { value: "system", label: "System preference" },
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
              >
                <SelectTrigger
                  aria-labelledby="theme-label"
                  className="workspace-control h-11 w-full rounded-xl text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="system">System preference</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Follows your device by default. Reduced-motion preferences are
                always respected.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="workspace-panel">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center justify-between gap-3 font-heading text-xl font-medium">
              Workspace details
              <Badge
                variant="outline"
                className="font-sans text-[11px] font-normal"
              >
                Read-only
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Name</Label>
              <Input
                id="workspace-name"
                value={workspace.name}
                readOnly
                className="h-11 rounded-xl bg-muted/20 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-slug">Slug</Label>
              <Input
                id="workspace-slug"
                value={workspace.slug}
                readOnly
                className="h-11 rounded-xl bg-muted/20 font-mono text-xs"
              />
            </div>
            <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" />
              Member invitations and role changes are not available yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
