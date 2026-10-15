"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Box,
  ChevronRight,
  Inbox,
  LayoutDashboard,
  Menu,
  Settings2,
  ShieldCheck,
} from "lucide-react"
import { Brand } from "@/components/shared/brand"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { sampleWorkspaces } from "@/lib/api/sample-adapter"
import { useWorkspace } from "./workspace-provider"
import { cn } from "@/lib/utils"

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Ticket inbox", href: "/tickets", icon: Inbox },
  { label: "Knowledge", href: "/knowledge", icon: BookOpen },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings2 },
]

function WorkspacePicker() {
  const { workspace, switchWorkspace } = useWorkspace()
  return (
    <Select
      value={workspace.id}
      onValueChange={(value) => value && switchWorkspace(value)}
      items={sampleWorkspaces.map((item) => ({
        value: item.id,
        label: item.name,
      }))}
    >
      <SelectTrigger
        className="workspace-picker w-full rounded-xl border bg-background px-3 text-sm data-[size=default]:h-13"
        aria-label="Select preview workspace"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-signal-surface text-[11px] font-semibold text-signal">
            {workspace.initials}
          </span>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {sampleWorkspaces.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col px-5 py-7">
      <Brand className="mb-10 px-2" />
      <WorkspacePicker />
      <p className="eyebrow mt-9 mb-3 px-3 text-[11px] text-muted-foreground">
        Workspace
      </p>
      <nav aria-label="Workspace navigation" className="space-y-1.5">
        {navigation.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "workspace-nav-link relative flex min-h-11 items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                active
                  ? "border-signal/20 bg-signal-surface font-medium text-foreground"
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              )}
            >
              <item.icon className={cn("size-4", active && "text-signal")} />
              {item.label}
              {item.href === "/tickets" && (
                <span className="ml-auto font-mono text-[11px] opacity-60">
                  ↗
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto pt-10">
        <div className="rounded-xl border bg-background p-4">
          <ShieldCheck className="mb-3 size-4 text-signal" />
          <p className="text-xs font-medium">Human decisions, by design.</p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Explore sample cases. Your data and accounts are not connected.
          </p>
        </div>
        <Separator className="my-5" />
        <div className="flex items-center gap-3 px-2">
          <Avatar className="size-8">
            <AvatarFallback className="bg-foreground text-[11px] text-background">
              P
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-medium">Preview visitor</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Sample workspace access
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const page =
    navigation.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    )?.label ?? "Workspace"
  return (
    <div className="workspace-shell min-h-svh bg-background">
      <aside className="workspace-rail fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar lg:block">
        <SidebarContent />
      </aside>
      <div className="min-w-0 lg:pl-64">
        <header className="workspace-header sticky top-0 z-20 flex h-18 items-center justify-between gap-3 border-b bg-background px-5 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    size="icon"
                    variant="ghost"
                    className="lg:hidden"
                    aria-label="Open workspace navigation"
                  />
                }
              >
                <Menu />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="workspace-rail w-[280px] bg-sidebar p-0"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Workspace navigation</SheetTitle>
                  <SheetDescription>
                    Switch preview workspace or navigate the sample product.
                  </SheetDescription>
                </SheetHeader>
                <SidebarContent onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="hidden text-[13px] text-muted-foreground sm:inline">
              Workspace
            </span>
            <ChevronRight className="hidden size-3 text-muted-foreground sm:block" />
            <span className="truncate text-[13px] font-medium">{page}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Badge
              variant="outline"
              className="gap-1.5 border-warning/20 bg-warning-surface px-2.5 py-1 text-[11px] text-warning"
            >
              <Box className="size-3" />
              Preview
            </Badge>
            <ThemeToggle />
            <Link
              href="/"
              aria-label="Back to public website"
              className="flex items-center gap-2 rounded-md p-2 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-2"
            >
              <span className="hidden sm:inline">Back to website</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </header>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b bg-muted/25 px-5 py-3 text-[11px] leading-relaxed text-muted-foreground md:px-8">
          <p>
            <span className="font-medium text-foreground">
              Preview workspace
            </span>
            <span className="mx-2">/</span>Sample data. No connected accounts or
            real actions.
          </p>
          <Link href="/how-it-works" className="underline underline-offset-3">
            How it works
          </Link>
        </div>
        <main
          id="main-content"
          className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-11 lg:px-10 xl:px-12"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
