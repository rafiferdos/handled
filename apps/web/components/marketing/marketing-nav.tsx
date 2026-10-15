"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu } from "lucide-react"
import { Brand } from "@/components/shared/brand"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { ButtonLink } from "@/components/shared/button-link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"

const links = [
  { label: "Product", href: "/product" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Our approach", href: "/#approach" },
]

export function MarketingNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <header className="material-nav sticky top-0 z-40 border-b border-border/60">
      <div className="page-container flex h-20 items-center justify-between gap-6">
        <Brand />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="nav-link text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden text-xs text-muted-foreground hover:text-foreground md:block"
          >
            Log in
          </Link>
          <ButtonLink
            href="/dashboard"
            className="hidden h-9 rounded-full px-5 text-xs sm:inline-flex"
          >
            Explore Handled <ArrowUpRight className="ml-2 size-3.5" />
          </ButtonLink>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent className="p-2">
              <SheetHeader>
                <SheetTitle>Explore Handled</SheetTitle>
                <SheetDescription>
                  Evidence-first support, with people in control.
                </SheetDescription>
              </SheetHeader>
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1 px-4"
              >
                {[
                  ...links,
                  { label: "Log in", href: "/login" },
                  { label: "Preview workspace", href: "/dashboard" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-base hover:bg-muted focus-visible:outline-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
